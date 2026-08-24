import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import OraArmImg from '../../assets/images/arms/ora-astrosfera.png';
import MissionCaptureFrames from './MissionCaptureFrames';
// Compile-time stub in normal builds (imports nothing). The frame renderer swaps
// it for a re-export of MissionCapture3D, so three.js + ora-t0.bin are bundled
// ONLY in the render build, never in what ships. See MissionCaptureLive.js.
import LiveCapture from './MissionCaptureLive';

// The capture stage ships as a pre-rendered frame sequence (MissionCaptureFrames),
// so no arm CAD ever reaches the browser. The live scene is used only during the
// offline frame render (REACT_APP_RENDER3D=1, with LiveCapture swapped in).
// eslint-disable-next-line no-undef
const RENDER3D = process.env.REACT_APP_RENDER3D === '1';

// Pinned, scroll-flown ORBtos mission: orbit → transfer → prox-ops → capture,
// with a synced ops-telemetry screen beside the mission view. Everything on the
// telemetry rail derives from scroll progress, so the two screens can never
// drift apart. Representative profile only — clearly stamped, never flight data.
const STAGES = ['ORBIT', 'TRANSFER', 'PROX-OPS', 'CAPTURE'];

const EVENTS = [
  [0.02, 'TARGET EPHEMERIS LOADED'],
  [0.08, 'PHASING ORBIT ESTABLISHED'],
  [0.2, 'TRANSFER WINDOW OPEN'],
  [0.27, 'TRANSFER BURN — ASTRA-P GUIDANCE'],
  [0.34, 'INTERCEPT SOLUTION LOCKED'],
  [0.4, 'RANGE GATE — 1 KM'],
  [0.52, 'PROX-OPS ENTRY — NAVIQ STEREO LOCK'],
  [0.6, 'STATE ESTIMATE CONVERGED'],
  [0.68, 'FINAL APPROACH AUTHORIZED'],
  [0.78, 'GRASP ENVELOPE REACHED'],
  [0.86, 'CAPTURE SEQUENCE ARMED'],
  [0.93, 'HARD CAPTURE CONFIRMED'],
];

const lerp = (a, b, t) => a + (b - a) * Math.min(1, Math.max(0, t));
const pad = (n, w = 2) => String(Math.floor(Math.abs(n))).padStart(w, '0');

const fmtRange = (m) => {
  if (m >= 10000) return `${Math.round(m / 1000).toLocaleString()} KM`;
  if (m >= 1000) return `${(m / 1000).toFixed(1)} KM`;
  if (m >= 10) return `${Math.round(m)} M`;
  return `${m.toFixed(1)} M`;
};

// --- Globe geometry (all deterministic, computed once) ---------------------
const C = { x: 310, y: 310 };
const EARTH_R = 165;
const TILT = (-20 * Math.PI) / 180;
// Both spacecraft move: the chaser phases on an inner orbit while the target
// travels its own outer orbit, and the transfer leads to a fixed intercept
// point where the two arrive together — not to where the target used to be.
const CHASER_ORBIT = { rx: 255, ry: 205 };
const TARGET_ORBIT = { rx: 288, ry: 234 };

const ellipsePoint = (deg, { rx, ry }) => {
  const t = (deg * Math.PI) / 180;
  const x = rx * Math.cos(t);
  const y = ry * Math.sin(t);
  const cos = Math.cos(TILT);
  const sin = Math.sin(TILT);
  return { x: C.x + x * cos - y * sin, y: C.y + x * sin + y * cos };
};

// Chaser sweeps 190° while the target covers 64° over the same scroll span —
// the phase gap visibly closes before the burn.
const CH_TRACE = Array.from({ length: 121 }, (_, i) => ellipsePoint(140 + (i / 120) * 190, CHASER_ORBIT));
const TGT_THETA = { start: 386, burn: 418, intercept: 450 };
const INTERCEPT = ellipsePoint(TGT_THETA.intercept, TARGET_ORBIT);
// Orbit raising is never a straight chord: the transfer arc leaves the inner
// orbit tangentially and arrives tangent to the outer one. Sweep 120° of true
// anomaly while the radius blends between the two ellipses with zero slope at
// both ends (smoothstep), which gives the tangent Hohmann-like spiral.
const smoothstep = (u) => u * u * (3 - 2 * u);
const TRANSFER = Array.from({ length: 91 }, (_, i) => {
  const u = i / 90;
  const s = smoothstep(u);
  return ellipsePoint(330 + 120 * u, {
    rx: CHASER_ORBIT.rx + (TARGET_ORBIT.rx - CHASER_ORBIT.rx) * s,
    ry: CHASER_ORBIT.ry + (TARGET_ORBIT.ry - CHASER_ORBIT.ry) * s,
  });
});
// The chaser's current position, as a pure function of (stage, sp) — pulled out
// so OrbitDiagram.js can compute the exact same point GlobeScene draws, for a
// zoom that tracks the actual dot instead of duplicating (and risking drifting
// from) this geometry a second time.
const chaserPointAt = (stage, sp) => {
  const traceCount = stage === 0 ? 1 + Math.floor(sp * (CH_TRACE.length - 1)) : CH_TRACE.length;
  const transferCount = stage === 1 ? 1 + Math.floor(sp * (TRANSFER.length - 1)) : stage > 1 ? TRANSFER.length : 0;
  return transferCount > 0 ? TRANSFER[transferCount - 1] : CH_TRACE[traceCount - 1];
};

const STARS = Array.from({ length: 46 }, (_, i) => ({
  x: (i * 173) % 800,
  y: (i * 131) % 600,
  o: 0.12 + ((i * 37) % 10) / 40,
}));

const toPoints = (pts) => pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

// Parallels foreshortened for an orthographic-instrument look, not photorealism.
const PARALLELS = [-110, -55, 0, 55, 110].map((dy) => ({
  cy: C.y + dy,
  rx: Math.sqrt(Math.max(0, EARTH_R * EARTH_R - dy * dy)),
}));

export const GLOBE_PALETTE = {
  earthFrom: '#12233B',
  earthTo: '#04060B',
  sphere: 'rgba(255,255,255,0.16)',
  graticule: 'rgba(255,255,255,0.07)',
  label: 'rgba(255,255,255,0.35)',
  chaserOrbit: 'rgba(255,255,255,0.12)',
  targetOrbit: 'rgba(224,112,26,0.18)',
  plan: 'rgba(46,139,230,0.35)',
  planRing: 'rgba(46,139,230,0.5)',
  planText: 'rgba(46,139,230,0.8)',
  traceGlow: 'rgba(46,139,230,0.25)',
  trace: '#2E8BE6',
  targetTrail: 'rgba(224,112,26,0.5)',
  target: '#E0701A',
  star: '#FFFFFF',
  chaserBody: '#FFFFFF',
  chaserText: 'rgba(255,255,255,0.6)',
  mono: "'JetBrains Mono', monospace",
};

const GlobeScene = ({ stage, sp, palette }) => {
  const P = { ...GLOBE_PALETTE, ...palette };
  const traceCount = stage === 0 ? 1 + Math.floor(sp * (CH_TRACE.length - 1)) : CH_TRACE.length;
  const transferCount = stage === 1 ? 1 + Math.floor(sp * (TRANSFER.length - 1)) : stage > 1 ? TRANSFER.length : 0;
  const visibleTrace = CH_TRACE.slice(0, traceCount);
  const visibleTransfer = TRANSFER.slice(0, transferCount);
  const chaser = chaserPointAt(stage, sp);

  // The target keeps moving throughout both phases and reaches the intercept
  // point exactly when the chaser does.
  const targetTheta =
    stage === 0
      ? TGT_THETA.start + (TGT_THETA.burn - TGT_THETA.start) * sp
      : TGT_THETA.burn + (TGT_THETA.intercept - TGT_THETA.burn) * Math.min(1, sp);
  const target = ellipsePoint(targetTheta, TARGET_ORBIT);
  const targetTrail = Array.from({ length: 25 }, (_, i) =>
    ellipsePoint(targetTheta - 22 + (i / 24) * 22, TARGET_ORBIT)
  );

  // The two labels are anchored close to their own marker, so once the markers
  // themselves close within ~140 viewBox units the text runs into each other
  // ("ORA / CHASER" overlapping "TGT — UNPREPARED RSO") — worst right before
  // intercept, exactly the moment the chaser/target callouts matter least since
  // by then it's obvious they're the same point. Fading both out over that last
  // stretch (fully gone by 50 units apart, well before they visually touch at
  // 0) reads as the labels handing off to the marker itself, not a glitch.
  const labelFade = Math.min(1, Math.max(0, (Math.hypot(chaser.x - target.x, chaser.y - target.y) - 50) / 90));

  return (
    <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <radialGradient id="ms-earth" cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor={P.earthFrom} />
          <stop offset="100%" stopColor={P.earthTo} />
        </radialGradient>
      </defs>

      {STARS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r="1" fill={P.star} opacity={s.o} />
      ))}

      {/* Earth + graticule */}
      <circle cx={C.x} cy={C.y} r={EARTH_R} fill="url(#ms-earth)" stroke={P.sphere} />
      {PARALLELS.map((p, i) => (
        <ellipse key={`p${i}`} cx={C.x} cy={p.cy} rx={p.rx} ry={p.rx * 0.16} fill="none" stroke={P.graticule} />
      ))}
      {[0.35, 0.7].map((f, i) => (
        <ellipse key={`m${i}`} cx={C.x} cy={C.y} rx={EARTH_R * f} ry={EARTH_R} fill="none" stroke={P.graticule} />
      ))}
      <text x={C.x - EARTH_R + 10} y={C.y + EARTH_R + 24} className="fill-current" fill={P.label} fontSize="11" fontFamily={P.mono} letterSpacing="0.1em">
        EARTH — LEO
      </text>

      {/* Reference orbits (dashed): inner chaser phasing orbit, outer target orbit */}
      <ellipse
        cx={C.x}
        cy={C.y}
        rx={CHASER_ORBIT.rx}
        ry={CHASER_ORBIT.ry}
        transform={`rotate(-20 ${C.x} ${C.y})`}
        fill="none"
        stroke={P.chaserOrbit}
        strokeDasharray="3 7"
      />
      <ellipse
        cx={C.x}
        cy={C.y}
        rx={TARGET_ORBIT.rx}
        ry={TARGET_ORBIT.ry}
        transform={`rotate(-20 ${C.x} ${C.y})`}
        fill="none"
        stroke={P.targetOrbit}
        strokeDasharray="2 8"
      />

      {/* Planned transfer + intercept solution, shown once the burn is committed */}
      {stage >= 1 && (
        <g>
          <polyline points={toPoints(TRANSFER)} fill="none" stroke={P.plan} strokeWidth="1" strokeDasharray="4 6" />
          <circle cx={INTERCEPT.x} cy={INTERCEPT.y} r="13" fill="none" stroke={P.planRing} strokeWidth="1" strokeDasharray="3 4" />
          <text x={INTERCEPT.x + 20} y={INTERCEPT.y + 24} fill={P.planText} fontSize="11" fontFamily={P.mono} letterSpacing="0.1em">
            INTERCEPT
          </text>
        </g>
      )}

      {/* Flown trajectory: wide faint pass + thin bright pass reads as glow */}
      {[visibleTrace, visibleTransfer].map(
        (pts, i) =>
          pts.length > 1 && (
            <g key={i}>
              <polyline points={toPoints(pts)} fill="none" stroke={P.traceGlow} strokeWidth="5" />
              <polyline points={toPoints(pts)} fill="none" stroke={P.trace} strokeWidth="1.5" />
            </g>
          )
      )}

      {/* Target: moving marker + trailing arc of its own flown path */}
      <g>
        <polyline points={toPoints(targetTrail)} fill="none" stroke={P.targetTrail} strokeWidth="1.5" />
        <motion.circle
          cx={target.x}
          cy={target.y}
          fill="none"
          stroke={P.target}
          strokeWidth="1"
          initial={false}
          animate={{ r: [7, 18], opacity: [0.9, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
        />
        <circle cx={target.x} cy={target.y} r="5" fill="none" stroke={P.target} strokeWidth="1.5" />
        <line x1={target.x - 12} y1={target.y} x2={target.x + 12} y2={target.y} stroke={P.target} strokeWidth="1" />
        <line x1={target.x} y1={target.y - 12} x2={target.x} y2={target.y + 12} stroke={P.target} strokeWidth="1" />
        <text x={target.x + 18} y={target.y - 12} fill={P.target} fontSize="11" fontFamily={P.mono} letterSpacing="0.1em" opacity={labelFade}>
          TGT — UNPREPARED RSO
        </text>
      </g>

      {/* Chaser */}
      <g>
        <circle cx={chaser.x} cy={chaser.y} r="9" fill="none" stroke={P.planRing} strokeWidth="1" />
        <rect x={chaser.x - 3.5} y={chaser.y - 3.5} width="7" height="7" fill={P.chaserBody} />
        <text x={chaser.x - 14} y={chaser.y + 4} textAnchor="end" fill={P.chaserText} fontSize="11" fontFamily={P.mono} letterSpacing="0.1em" opacity={labelFade}>
          ORA / CHASER
        </text>
      </g>
    </svg>
  );
};

// --- Capture scene -----------------------------------------------------------
// Articulated wireframe arm closing on a drawn o-ring grapple fixture. Joint
// angles come from 2-link IK solved every frame as the wrist follows an
// approach path, so the arm bends at shoulder/elbow/wrist instead of sliding
// in as a rigid image. Labeled RENDER — never presented as footage.
const RING = { x: 330, y: 140, r: 38 };
// Stage progress at which the grasp locks — 0.72 within the capture stage is
// overall progress 0.93, the same instant the telemetry rail logs HARD CAPTURE
// CONFIRMED and the range readout flips to MATED. Keep the three in sync.
const LOCK_AT = 0.72;
// The arm is the actual ORA-Astrosfera render, sliced into three sprites at
// its joint caps (caps are rotationally symmetric, so the cuts stay invisible):
// static base+shoulder+lower link, the top lattice link pivoting at the right
// cap, and the end link pivoting at the left cap. The service vehicle carries
// the whole arm along the approach while the two joints unfold, and the open
// end-effector face inserts into the o-ring aperture like a grapple probe.
// All coordinates below are 1024×1024 image pixels; SPRITE.s scales to scene.
const SPRITE = { s: 0.45, ox: 433, oy: 156 };
const J2 = { x: 788, y: 155 }; // right cap: top lattice link pivot
const J3 = { x: 365, y: 104 }; // left cap: end-link pivot
const EE0 = { x: 80, y: 115 }; // open end-effector face center
const POSE_START = { t2: 6, t3: -12 }; // degrees; both unfold to 0 at capture
// End-effector approach in scene coords: drift in from lower right, arrive
// horizontally so the probe axis lines up with the ring axis.
const EE_START = { x: 620, y: 330 };
const EE_CTRL = { x: 520, y: 140 };
const EE_END = { x: RING.x + 22, y: RING.y };

const rotAbout = (p, c, deg) => {
  const a = (deg * Math.PI) / 180;
  const dx = p.x - c.x;
  const dy = p.y - c.y;
  return { x: c.x + dx * Math.cos(a) - dy * Math.sin(a), y: c.y + dx * Math.sin(a) + dy * Math.cos(a) };
};

// `capture` retints the two accent colours the scene draws with, so the
// redesign can render the same geometry without the ember the new palette
// does not contain. Defaults keep the legacy look for the original page.
export const CAPTURE_PALETTE = { locked: '#E0701A', tracking: '#2E8BE6', lockFill: 'rgba(224,112,26,0.16)' };

const CaptureScene = ({ sp, range, palette }) => {
  const P = { ...CAPTURE_PALETTE, ...(palette || {}) };
  const t = Math.min(1, sp / LOCK_AT);
  const glide = 1 - (1 - t) * (1 - t);
  const locked = sp >= LOCK_AT;
  const t2 = POSE_START.t2 * (1 - glide);
  const t3 = POSE_START.t3 * (1 - glide);

  // Forward kinematics in image space, mapped to the scene, then the vehicle
  // translation is whatever keeps the end effector on its approach path.
  const eePx = rotAbout(rotAbout(EE0, J3, t3), J2, t2);
  const eeScene = { x: SPRITE.ox + eePx.x * SPRITE.s, y: SPRITE.oy + eePx.y * SPRITE.s };
  const a = 1 - glide;
  const eeGoal = {
    x: a * a * EE_START.x + 2 * a * glide * EE_CTRL.x + glide * glide * EE_END.x,
    y: a * a * EE_START.y + 2 * a * glide * EE_CTRL.y + glide * glide * EE_END.y,
  };
  const T = { x: eeGoal.x - eeScene.x, y: eeGoal.y - eeScene.y };
  const hud = locked ? P.locked : P.tracking;
  const box = { x1: RING.x - 60, y1: RING.y - 60, x2: RING.x + 60, y2: RING.y + 60 };

  return (
    <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {STARS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r="1" fill="#FFFFFF" opacity={s.o} />
      ))}

      {/* Target spacecraft edge + o-ring grapple fixture */}
      <g>
        <rect x="-60" y="30" width="250" height="230" fill="#10131A" stroke="rgba(255,255,255,0.12)" />
        <line x1="-60" y1="105" x2="190" y2="105" stroke="rgba(255,255,255,0.07)" />
        <line x1="-60" y1="185" x2="190" y2="185" stroke="rgba(255,255,255,0.07)" />
        <line x1="120" y1="30" x2="120" y2="260" stroke="rgba(255,255,255,0.07)" />
        <line x1="190" y1="120" x2={RING.x - RING.r + 4} y2={RING.y - 7} stroke="#5B616B" strokeWidth="3" />
        <line x1="190" y1="160" x2={RING.x - RING.r + 4} y2={RING.y + 7} stroke="#5B616B" strokeWidth="3" />
        <circle cx={RING.x} cy={RING.y} r={RING.r + 6.5} fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="1.5" />
        <circle cx={RING.x} cy={RING.y} r={RING.r} fill="none" stroke="#8E97A3" strokeWidth="13" />
        <circle
          cx={RING.x}
          cy={RING.y}
          r={RING.r}
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="3"
          strokeDasharray="34 210"
          transform={`rotate(-120 ${RING.x} ${RING.y})`}
        />
        {locked && <circle cx={RING.x} cy={RING.y} r={RING.r - 12} fill={P.lockFill} />}
      </g>

      {/* Sprite slices: the two moving links are clipped out of the render and
          the static pass masks those same regions so nothing draws twice. */}
      <defs>
        {/* The top link slopes ~15°, so its slice is a corridor along the link
            axis (axis-aligned rects either orphan link pixels or steal the
            lower lattice link that passes beneath it). */}
        <clipPath id="ms-link2">
          <polygon points="441,-2 409,118 744,208 776,88" />
          <circle cx={J2.x} cy={J2.y} r="66" />
        </clipPath>
        <clipPath id="ms-link3">
          <rect x="15" y="50" width="355" height="130" />
          <circle cx={J3.x} cy={J3.y} r="52" />
        </clipPath>
        <mask id="ms-static">
          <rect x="0" y="0" width="1024" height="1024" fill="white" />
          <polygon points="441,-2 409,118 744,208 776,88" fill="black" />
          <circle cx={J2.x} cy={J2.y} r="66" fill="black" />
          <rect x="15" y="50" width="355" height="130" fill="black" />
          <circle cx={J3.x} cy={J3.y} r="52" fill="black" />
        </mask>
      </defs>

      {/* Service vehicle + arm travel together; joints unfold as it closes */}
      <g transform={`translate(${T.x.toFixed(1)} ${T.y.toFixed(1)})`}>
        <rect x="560" y="440" width="520" height="180" fill="#10131A" stroke="rgba(255,255,255,0.12)" />
        <line x1="560" y1="520" x2="1080" y2="520" stroke="rgba(255,255,255,0.07)" />
        <line x1="760" y1="440" x2="760" y2="620" stroke="rgba(255,255,255,0.07)" />
        <text x="580" y="600" fill="rgba(255,255,255,0.35)" fontSize="11" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.1em">
          ORA / CHASER
        </text>
        <g transform={`translate(${SPRITE.ox} ${SPRITE.oy}) scale(${SPRITE.s})`}>
          <image href={OraArmImg} width="1024" height="1024" mask="url(#ms-static)" />
          <g transform={`rotate(${t2.toFixed(2)} ${J2.x} ${J2.y})`}>
            <image href={OraArmImg} width="1024" height="1024" clipPath="url(#ms-link2)" />
            <g transform={`rotate(${t3.toFixed(2)} ${J3.x} ${J3.y})`}>
              <image href={OraArmImg} width="1024" height="1024" clipPath="url(#ms-link3)" />
            </g>
          </g>
        </g>
      </g>

      {/* NavIQ HUD: corner brackets + fixture label + closing range */}
      <g stroke={hud} strokeWidth="1.5" fill="none">
        <path d={`M ${box.x1} ${box.y1 + 14} V ${box.y1} H ${box.x1 + 14}`} />
        <path d={`M ${box.x2 - 14} ${box.y1} H ${box.x2} V ${box.y1 + 14}`} />
        <path d={`M ${box.x2} ${box.y2 - 14} V ${box.y2} H ${box.x2 - 14}`} />
        <path d={`M ${box.x1 + 14} ${box.y2} H ${box.x1} V ${box.y2 - 14}`} />
      </g>
      <text x={box.x1} y={box.y1 - 10} fill={hud} fontSize="11" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.1em">
        {locked ? 'HARD CAPTURE' : 'GRASP FIXTURE — O-RING'}
      </text>
      <text x={box.x1} y={box.y2 + 22} fill="rgba(255,255,255,0.6)" fontSize="11" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.1em">
        {locked ? 'MATED — LOADS NOMINAL' : `CLOSING — ${fmtRange(range)}`}
      </text>
    </svg>
  );
};

// --- Telemetry rail ---------------------------------------------------------
const TelemetryRail = ({ progress, stage, range, relVel }) => {
  const t = progress * 1122; // mission clock: scroll maps onto a ~19-min profile
  const log = EVENTS.filter(([at]) => progress >= at).slice(-6);
  const captured = progress >= 0.93;

  return (
    <div className="h-full flex flex-col bg-surface font-mono text-[11px] leading-relaxed min-h-0">
      <div className="flex items-center justify-between border-b hairline px-4 py-2 shrink-0">
        <span className="type-mono-label text-text-secondary">ORBTOS — OPS TELEMETRY</span>
        <span className="type-mono-label text-text-faint tabular-nums">T+{pad(t / 60)}:{pad(t % 60)}</span>
      </div>

      <div className="p-4 flex flex-col gap-4 flex-1 min-h-0 overflow-hidden">
        <div>
          <div className="type-mono-label text-text-faint mb-2">MODE</div>
          <div className="flex flex-wrap gap-2">
            {STAGES.map((s, i) => (
              <span
                key={s}
                className={`px-2 py-0.5 border ${
                  i === stage
                    ? s === 'CAPTURE'
                      ? 'border-ember/50 text-ember'
                      : 'border-accent/50 text-accent'
                    : i < stage
                      ? 'border-white/[0.08] text-text-muted'
                      : 'border-white/[0.08] text-text-faint/50'
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3 tabular-nums">
          <div>
            <div className="type-mono-label text-text-faint mb-1">RANGE TO TARGET</div>
            <div className={`text-xl ${captured ? 'text-ember' : 'text-white'}`}>{captured ? 'MATED' : fmtRange(range)}</div>
          </div>
          <div>
            <div className="type-mono-label text-text-faint mb-1">REL VELOCITY</div>
            <div className="text-xl text-white">{relVel}</div>
          </div>
          <div>
            <div className="type-mono-label text-text-faint mb-1">GUIDANCE</div>
            <div className="text-text-secondary">{stage === 0 ? 'ASTRA-P — STANDBY' : 'ASTRA-P — ACTIVE'}</div>
          </div>
          <div>
            <div className="type-mono-label text-text-faint mb-1">PERCEPTION</div>
            <div className="text-text-secondary">{progress >= 0.52 ? 'NAVIQ — STEREO LOCK' : 'GPS / TLE'}</div>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <div className="type-mono-label text-text-faint mb-2">EVENT LOG</div>
          <div className="space-y-1 text-text-muted">
            {log.map(([at, line]) => (
              <div key={line} className={line === 'HARD CAPTURE CONFIRMED' ? 'text-ember' : ''}>
                » {line}
              </div>
            ))}
            <span className="inline-block w-2 h-3.5 bg-accent animate-cursor-blink motion-reduce:animate-none align-middle" />
          </div>
        </div>
      </div>

      <div className="border-t hairline px-4 py-2 shrink-0">
        <span className="type-mono-label text-text-faint">REPRESENTATIVE TELEMETRY — NOT FLIGHT DATA</span>
      </div>
    </div>
  );
};

// --- Section -----------------------------------------------------------------
const MissionSequence = () => {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => setProgress(v));

  const stage = Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length));
  const sp = progress * STAGES.length - stage;
  const endCard = progress > 0.94;

  // The capture visual owns PROX-OPS and CAPTURE: one continuous approach from
  // stand-off to hard capture, normalized so lock lands exactly when the
  // telemetry logs HARD CAPTURE CONFIRMED (overall progress 0.93).
  const captureT = Math.min(1, Math.max(0, (progress - 0.5) / 0.43));

  const range = useMemo(() => {
    if (stage === 0) return lerp(1842000, 412000, sp);
    if (stage === 1) return lerp(412000, 120, sp);
    if (stage === 2) return lerp(120, 2.4, sp);
    return lerp(2.4, 0, sp);
  }, [stage, sp]);

  const relVel =
    stage === 0 ? '7.66 KM/S' : `${(stage === 1 ? lerp(14.2, 1.8, sp) : stage === 2 ? lerp(1.8, 0.12, sp) : lerp(0.12, 0, sp)).toFixed(2)} M/S`;

  const view = stage <= 1 ? 'globe' : 'capture';

  return (
    <section id="mission" ref={ref} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen flex flex-col pt-[calc(var(--header-height)+0.75rem)] pb-6">
        <div className="container mx-auto px-6 flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <span className="type-mono-label text-text-muted inline-flex gap-3">
              <span className="text-text-faint">006</span>
              <span className="text-primary">ONE MISSION, END TO END</span>
              <span className="text-text-faint hidden sm:inline">/ SIMULATION</span>
            </span>
            <span className="type-mono-label text-text-faint hidden md:inline">
              {progress < 0.03 ? 'SCROLL TO FLY THE MISSION' : `MISSION ELAPSED — ${Math.round(progress * 100)}%`}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] grid-rows-[1fr_auto] lg:grid-rows-1 gap-px bg-white/[0.08] border hairline flex-1 min-h-0">
            {/* Mission view */}
            <div className="relative bg-black overflow-hidden min-h-0">
              <AnimatePresence initial={false}>
                <motion.div
                  key={view}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  className="absolute inset-0"
                >
                  {view === 'globe' ? (
                    <GlobeScene stage={stage} sp={sp} />
                  ) : RENDER3D && LiveCapture ? (
                    <LiveCapture sp={captureT} />
                  ) : (
                    <MissionCaptureFrames sp={captureT} fallback={<CaptureScene sp={captureT} range={range} />} />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* HUD */}
              <div className="absolute top-3 left-4 type-mono-label text-text-muted bg-black/50 px-2 py-1">
                MISSION VIEW — {STAGES[stage]}
              </div>
              <div className="absolute top-3 right-4 text-right bg-black/50 px-2 py-1">
                <div className="type-mono-label text-text-faint">RANGE</div>
                <div className="font-mono text-2xl text-white tabular-nums">{progress >= 0.93 ? 'MATED' : fmtRange(range)}</div>
              </div>
              <div className="absolute left-4 bottom-4 space-y-1.5">
                {STAGES.map((s, i) => (
                  <div
                    key={s}
                    className={`type-mono-label transition-colors duration-300 ${
                      i === stage
                        ? s === 'CAPTURE'
                          ? 'text-ember'
                          : 'text-accent'
                        : i < stage
                          ? 'text-text-muted'
                          : 'text-text-faint/50'
                    }`}
                  >
                    {pad(i + 1)} {s}
                    {i === stage && <span className="inline-block w-1.5 h-3 bg-current ml-2 animate-cursor-blink motion-reduce:animate-none align-middle" />}
                  </div>
                ))}
              </div>
              <div className="absolute right-4 bottom-4 type-mono-label text-text-faint bg-black/50 px-2 py-1 hidden sm:block">
                {view === 'capture'
                  ? 'ORA-T0 FLIGHT CAD — REPRESENTATIVE ANIMATION'
                  : 'SIMULATION — REPRESENTATIVE MISSION PROFILE'}
              </div>

              {/* End card */}
              <motion.div
                animate={{ opacity: endCard ? 1 : 0, y: endCard ? 0 : 16 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-x-0 bottom-1/4 text-center px-6 pointer-events-none"
              >
                <p className="type-display text-h3 text-white mb-3 [text-shadow:0_2px_28px_rgba(0,0,0,0.95),0_0_8px_rgba(0,0,0,0.8)]">
                  Every screen you just watched
                  <br />
                  runs on ORBtos.
                </p>
                <Link
                  to="/products/satellite-os"
                  className={`type-mono-label text-accent hover:text-white transition-colors ${endCard ? 'pointer-events-auto' : ''}`}
                >
                  OPEN THE ORBTOS DOSSIER →
                </Link>
              </motion.div>
            </div>

            {/* Ops screen */}
            <div className="max-lg:max-h-[38vh] min-h-0 overflow-hidden">
              <TelemetryRail progress={progress} stage={stage} range={range} relVel={relVel} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { GlobeScene, CaptureScene, chaserPointAt };
export default MissionSequence;
