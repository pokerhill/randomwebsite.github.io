import React, { useRef, useState, useEffect } from 'react';
import useInView from './motion/useInView';
import { CornerBrackets } from './ui';

// ORBtos as a real DOM instrument panel: boots on scroll, then runs live
// telemetry. Representative values only — clearly labeled, never presented
// as flight data.
const BOOT_LINES = [
  'ORBTOS v2.4 — BOOT SEQUENCE INITIATED',
  'NAVIQ PERCEPTION MODULE ........ LOADED',
  'ASTRA-P GNC MODULE ............. LOADED',
  'ARM JOINTS 1–7 ................. NOMINAL',
  'THERMAL ........................ NOMINAL',
  'COMMS LINK ..................... ACQUIRED',
  'SYSTEM READY',
];

const EVENT_LOG = [
  'TARGET ACQUIRED — STEREO LOCK',
  'STATE ESTIMATE CONVERGED',
  'APPROACH TRAJECTORY PLANNED',
  'GUIDANCE LOOP CLOSED',
  'JOINT TORQUES WITHIN LIMITS',
  'END-EFFECTOR ALIGNED',
  'GRASP ENVELOPE REACHED',
  'CAPTURE SEQUENCE ARMED',
];

const pad = (n, w = 2) => String(Math.floor(Math.abs(n))).padStart(w, '0');

const OrbtosConsole = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [bootCount, setBootCount] = useState(0);
  const [tick, setTick] = useState(0);
  const bootedAt = useRef(null);

  // Boot lines type on one by one once scrolled into view.
  useEffect(() => {
    if (!inView) return undefined;
    if (bootCount >= BOOT_LINES.length) return undefined;
    const id = setTimeout(() => setBootCount((c) => c + 1), bootCount === 0 ? 200 : 320);
    return () => clearTimeout(id);
  }, [inView, bootCount]);

  const booted = bootCount >= BOOT_LINES.length;

  useEffect(() => {
    if (!booted) return undefined;
    if (bootedAt.current === null) bootedAt.current = Date.now();
    const id = setInterval(() => setTick(Date.now()), 120);
    return () => clearInterval(id);
  }, [booted]);

  const t = booted && bootedAt.current ? (tick - bootedAt.current) / 1000 : 0;
  const joints = Array.from({ length: 7 }, (_, i) =>
    (Math.sin(t * 0.35 + i * 1.3) * 38 + (i % 3) * 21).toFixed(1)
  );
  // Slowly precessing attitude quaternion (normalized).
  const q = [
    Math.cos(t * 0.05),
    Math.sin(t * 0.05) * 0.42,
    Math.sin(t * 0.03) * 0.31,
    Math.sin(t * 0.04) * 0.18,
  ];
  const qn = Math.sqrt(q.reduce((s, v) => s + v * v, 0)) || 1;
  const quat = q.map((v) => (v / qn).toFixed(3));
  const logCount = Math.min(EVENT_LOG.length, Math.floor(t / 2.5) + 1);
  const visibleLog = EVENT_LOG.slice(0, logCount).slice(-5);

  return (
    <div ref={ref} className="relative border hairline bg-surface font-mono text-[11px] leading-relaxed">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b hairline px-4 py-2">
        <span className="type-mono-label text-text-secondary">ORBTOS — FLIGHT CONSOLE</span>
        <span className="type-mono-label text-text-faint">
          {booted ? `T+${pad(t / 60)}:${pad(t % 60)}` : 'STANDBY'}
        </span>
      </div>

      <div className="p-4 min-h-[260px]">
        {/* Boot log */}
        {!booted && (
          <div className="space-y-1.5 text-text-secondary">
            {BOOT_LINES.slice(0, bootCount).map((line) => (
              <div key={line}>{line}</div>
            ))}
            <span className="inline-block w-2 h-3.5 bg-accent animate-cursor-blink align-middle" />
          </div>
        )}

        {/* Live panel */}
        {booted && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <div className="type-mono-label text-text-faint mb-2">JOINT ANGLES — DEG</div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-text-secondary tabular-nums">
                {joints.map((v, i) => (
                  <div key={i} className="flex justify-between gap-3">
                    <span className="text-text-faint">θ{i + 1}</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="type-mono-label text-text-faint mb-2">ATTITUDE — QUATERNION</div>
                <div className="text-text-secondary tabular-nums">
                  [{quat.join(', ')}]
                </div>
              </div>
              <div>
                <div className="type-mono-label text-text-faint mb-2">SUBSYSTEMS</div>
                <div className="flex flex-wrap gap-2">
                  {['NAVIQ', 'ASTRA-P', 'ARM', 'THERMAL', 'COMMS'].map((s) => (
                    <span key={s} className="border border-success/30 text-success px-2 py-0.5">
                      {s} NOMINAL
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="type-mono-label text-text-faint mb-2">EVENT LOG</div>
                <div className="space-y-1 text-text-muted">
                  {visibleLog.map((line) => (
                    <div key={line}>» {line}</div>
                  ))}
                  <span className="inline-block w-2 h-3.5 bg-accent animate-cursor-blink align-middle" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t hairline px-4 py-2">
        <span className="type-mono-label text-text-faint">REPRESENTATIVE TELEMETRY — NOT FLIGHT DATA</span>
      </div>
      <CornerBrackets inset="inset-1" />
    </div>
  );
};

export default OrbtosConsole;
