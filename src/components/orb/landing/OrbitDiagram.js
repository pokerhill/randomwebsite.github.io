import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { CaptureScene, GlobeScene, chaserPointAt } from '../../home/MissionSequence';
import MissionCaptureFrames from '../../home/MissionCaptureFrames';

// Figma 201:160 "Group 5" — x=191 y=1435, 1115.006 x 911.391 on the landing frame.
// Wireframe Earth on dotted orbit rings, with the chaser and the unprepared
// target called out. EARTH — LEO / ORA / CHASER / TGT — UNPREPARED RSO are labels
// on this diagram (they were briefly, wrongly, loose text in the hero).
//
// The diagram is flown by scroll rather than looping on a timer, which is what
// this repo's original mission sequence did: the chaser advances along its
// phasing orbit, commits the transfer burn, and once it closes on the target the
// view hands off to the capture scene — the arm unfolding and taking the launch
// adapter ring.
//
// The capture stage is the URDF one: scripts/build-ora-model.js bakes the real
// ORA joint chain and link meshes, MissionCapture3D drives them in WebGL, and
// scripts/render-capture-frames.js renders that offline to the JPEG sequence in
// src/assets/capture/. Scroll scrubs those frames, so the arm articulates on its
// actual kinematics rather than the SVG sprite fallback, and no CAD ships. That
// fallback is still passed through for the case where the sequence is missing.
//
// Earth colours are sampled straight off the Figma render: #1E2387 at the lit
// centre falling to #101450 at the limb. The old ember target marker is gone —
// the design has no orange anywhere.
//
// The inherited scene also paints a bright flown trajectory and a planned-transfer
// arc. The Figma has neither — only faint dotted orbits — and at full strength they
// read as a solid accent ellipse that dominates the whole section, so they are
// dialled down to near-invisible. The markers still move, so the animation reads.

const ORB_GLOBE_PALETTE = {
  earthFrom: '#1E2387',
  earthTo: '#101450',
  sphere: 'rgba(255,255,255,0.22)',
  graticule: 'rgba(255,255,255,0.12)',
  label: 'rgba(255,255,255,0.55)',
  chaserOrbit: 'rgba(255,255,255,0.18)',
  targetOrbit: 'rgba(59,69,245,0.35)',
  plan: 'rgba(59,69,245,0.10)',
  planRing: 'rgba(59,69,245,0.18)',
  planText: 'rgba(59,69,245,0)',
  traceGlow: 'rgba(59,69,245,0.06)',
  trace: 'rgba(59,69,245,0.30)',
  targetTrail: 'rgba(59,69,245,0.30)',
  target: '#3B45F5',
  star: '#FFFFFF',
  chaserBody: '#FFFFFF',
  chaserText: 'rgba(255,255,255,0.6)',
  mono: "'IBM Plex Mono', monospace",
};

// No ember in the redesign, so the capture HUD locks to the accent instead.
const ORB_CAPTURE_PALETTE = {
  locked: '#3B45F5',
  tracking: 'rgba(255,255,255,0.55)',
  lockFill: 'rgba(59,69,245,0.16)',
};

const STAGES = ['ORBIT', 'TRANSFER', 'PROX-OPS', 'CAPTURE'];

// The globe owns ORBIT and TRANSFER; the capture scene owns PROX-OPS and CAPTURE
// as one continuous approach, normalised so the arm mates at the very end.
const CAPTURE_FROM = 0.5;
const CAPTURE_SPAN = 0.43;

const ZOOM_MAX = 1.7;
const smoothstep = (u) => u * u * (3 - 2 * u);

// The globe->capture cut used to be a framer AnimatePresence crossfade on a
// fixed 0.7s timer — triggered once scroll crossed CAPTURE_FROM, then playing
// out on its own regardless of further scroll input (stop scrolling mid-fade
// and it kept animating). Everything else in this component is a direct
// function of scroll position, so this was the one part that wasn't actually
// scrubbable. CROSS_SPAN instead makes the crossfade a plain function of `p`:
// a window of overall progress centred on CAPTURE_FROM, over which the globe
// fades/scales out and the capture view fades/scales in together, driven by
// wherever the user's scroll position actually is — scroll partway into the
// window and it holds partway through the fade, scroll backward and it un-fades.
const CROSS_SPAN = 0.06;
const CROSS_HALF = CROSS_SPAN / 2;

// Converts a point in the shared 800x600 viewBox to a %-of-box transform-origin,
// using the same fit-by-width letterboxing the Earth-nudge comment above
// derives (this box's aspect-[1115/911] is narrower than the viewBox's 4:3, so
// xMidYMid meet fits by width and letterboxes top/bottom). The globe and
// capture motion.divs below are both plain `absolute inset-0` boxes of
// identical size/position, so a %-of-box origin lines up between them without
// needing to know anything about the capture scene's own internal composition.
const BOX_ASPECT = 1115 / 911;
const BOX_HEIGHT_IN_W = 1 / BOX_ASPECT; // box height, in units of box width
const RENDERED_HEIGHT_IN_W = 600 / 800; // svg render height at fit-by-width scale, same units
const LETTERBOX_TOP_IN_W = (BOX_HEIGHT_IN_W - RENDERED_HEIGHT_IN_W) / 2;
const originFor = (vx, vy) => {
  const fx = (vx / 800) * 100;
  const fy = ((LETTERBOX_TOP_IN_W + vy / 800) / BOX_HEIGHT_IN_W) * 100;
  return `${fx.toFixed(2)}% ${fy.toFixed(2)}%`;
};

// chaserPointAt(1, 1) is TRANSFER's own last sample — the exact point the
// chaser (and, by construction, the target) sit at when TRANSFER ends, i.e.
// the instant the view cuts to capture. The live zoom below tracks the moving
// chaser and converges on this same point right as the cut happens, so using
// it as the capture scene's own expand-from origin makes the two read as one
// continuous push through the cut, not a scale-in from an unrelated spot.
const CUT_POINT = chaserPointAt(1, 1);
const CUT_ORIGIN = originFor(CUT_POINT.x, CUT_POINT.y);

const OrbitDiagram = () => {
  const ref = useRef(null);
  const boxRef = useRef(null);
  // Sticky offset that centres the diagram in the viewport once it locks. It
  // cannot be a constant: the box is an aspect ratio of its width, so its height
  // changes with the window. top-0 pinned it flush to the top of the screen, and
  // the obvious fix — an h-screen flex wrapper with items-center — also recentres
  // it at REST, which is what threw the resting position off twice before. This
  // leaves the resting position alone and only changes where it sticks.
  const [stickyTop, setStickyTop] = useState(0);

  const measure = useCallback(() => {
    const el = boxRef.current;
    if (!el) return;
    setStickyTop(Math.round((window.innerHeight - el.offsetHeight) / 2));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', setProgress);

  // Reduced motion: hold the completed intercept rather than flying it.
  const p = reduce ? 1 : progress;
  const stage = Math.min(STAGES.length - 1, Math.floor(p * STAGES.length));
  const sp = Math.min(1, p * STAGES.length - stage);
  const captureT = Math.min(1, Math.max(0, (p - CAPTURE_FROM) / CAPTURE_SPAN));
  // Both render simultaneously while p sits inside the crossfade window; only
  // one at a time outside it. Bounds exactly match the window crossT is
  // computed over below, so opacity reaches a clean 0/1 right where each
  // stops/starts being mounted — no pop.
  const showGlobe = p < CAPTURE_FROM + CROSS_HALF;
  const showCapture = p > CAPTURE_FROM - CROSS_HALF;
  const crossT = Math.min(1, Math.max(0, (p - (CAPTURE_FROM - CROSS_HALF)) / CROSS_SPAN));
  // Ramps 0->1 across the back 85% of TRANSFER (stage 1), reaching full zoom at
  // sp=1 — the exact instant the burn's approach completes and the crossfade
  // window opens. Held at 1 (not reset to 0) for stage 2+ rather than only
  // stage===1, since the globe stays mounted a little past the stage boundary
  // while the crossfade window is still open — resetting to 0 there would snap
  // the zoom back out from under the fade instead of holding it.
  const zoomT = stage === 0 ? 0 : stage === 1 ? smoothstep(Math.max(0, Math.min(1, (sp - 0.15) / 0.85))) : 1;
  const baseGlobeScale = 1 + zoomT * (ZOOM_MAX - 1);
  // Tracks the chaser's own live position (not a fixed point), so the white
  // dot itself stays visually pinned on screen as the world scales up around
  // it — reads as the camera locking onto the chaser as it closes in, rather
  // than scaling toward wherever it happens to end up.
  const chaserNow = chaserPointAt(stage, sp);
  const zoomOrigin = originFor(chaserNow.x, chaserNow.y);

  return (
    // In flow, NOT pinned. Figma does not stack this below the heading — the two
    // overlap: 114:42 (ROBOTS IN SPACE) runs y=1248..1562 and this group starts at
    // y=1435, so its orbits tuck 127px up behind the paragraph and Earth's top
    // edge lands 92.5px under it. A sticky 320vh pin centres the diagram in the
    // viewport instead, which is what pushed it far below the words.
    //
    // RobotsInSpace above carries md:py-36 (144px), so clearing that and then
    // rising the design's 127px is a -271px pull at lg.
    // No background of its own: the -271px pull puts this box over the paragraph
    // above, and an opaque bg-orb-bg painted straight over those words. z-0 against
    // the heading's z-10 keeps the text on top where the two overlap, which is what
    // the design shows — only faint orbits cross the copy, never the type.
    //
    // Pinned. The sticky wrapper is the diagram's own height, NOT h-screen with
    // items-center — that centred it in the viewport and was what threw it low and
    // off-centre. At its own height it rests exactly where the margin puts it, then
    // locks centred in the viewport while scroll advances the stages, so the copy
    // scrolls away and the capture never has to sit behind type.
    //
    // -211px rather than the design's -271px: the design's full 127px tuck ran the
    // outer orbit into the "flight software" line, so this sits 60px lower and
    // overlaps by 67px.
    <section ref={ref} className="relative z-0 lg:-mt-[211px] lg:h-[300vh]">
      <div className="lg:sticky" style={{ top: stickyTop }}>
        {/* Group 5 is NOT centred in the design: x=191 of 1440 (13.26%), width
            1115 (77.43%). Centring it in the content column put it at x=162.5,
            which dragged Earth 28px left of where the file has it and left it
            56px off the copy's centre against the design's 13px. */}
        <div className="mx-auto w-full max-w-[1440px] px-6 py-20 md:px-10 lg:px-0 lg:py-0">
          <div
            ref={boxRef}
            className="relative mx-auto aspect-[1115/911] w-full max-w-[1115px]
                       lg:ml-[13.26%] lg:mr-0 lg:w-[77.43%] lg:max-w-none"
            data-figma="201:160"
            data-figma-name="Orbit diagram"
          >
            {/* The globe->capture cut used to be a flat opacity crossfade between
                two very differently-composed scenes (a wide orbit diagram vs. a
                close-up capture render) — reading as a hard cut rather than the
                camera closing in as the chaser reaches the target. Matching
                backgrounds (see scene.background in MissionCapture3D.js) fixed
                half of that; the other half is this scale ramp: the globe grows
                slightly as it fades out (as if flown past/through) and the
                capture view grows in FROM smaller-than-normal (as if the camera
                is pushing into it), rather than both just appearing/disappearing
                in place. Both divs are plain scroll-driven elements (see
                CROSS_SPAN above) rather than a framer AnimatePresence/motion.div
                pair, so the whole fade — including the extra push below — is
                scrubbable: it holds wherever scroll stops instead of finishing
                itself on a timer. */}
            {showGlobe && (
              <div
                className="absolute inset-0"
                style={{ opacity: 1 - crossT, transform: `scale(${1 + crossT * 0.1})`, transformOrigin: CUT_ORIGIN }}
              >
                {/* Live scroll-driven push that tracks the chaser (zoomOrigin),
                    separate from the div above it: that one only carries the
                    crossfade's own extra 1->1.1 push (pivoting on the fixed
                    CUT_ORIGIN the chaser converges to), while this plain div's
                    transform-origin follows the chaser's own moving position, so
                    the dot stays visually pinned as the world scales up around it
                    rather than the zoom scaling toward wherever it ends up. The
                    two compose multiplicatively, so the push keeps accelerating
                    through the fade instead of resetting. */}
                <div
                  className="h-full w-full"
                  style={{ transform: `scale(${baseGlobeScale})`, transformOrigin: zoomOrigin }}
                >
                  {/* GlobeScene draws into a fixed 800x600 viewBox with Earth at
                      (310, 310) — 38.75% across, not centred — and that viewBox is
                      1.333:1 against this box's 1.2235:1, so xMidYMid meet fits it
                      by width and letterboxes 37px top and bottom. Earth therefore
                      lands at (432, 469) of 1115x911 where Figma 114:123 puts it at
                      (502, 456). This nudge is that difference: +6.26% / -1.53%.
                      The scene moves as a whole, so its orbits and callouts keep
                      their relationship to Earth. The x is 8.73% rather than the
                      6.26% that reproduced Figma: the file puts Earth 27px left of
                      the heading's centre, and centring it on the words is worth
                      more here than copying that offset. */}
                  <div className="h-full w-full translate-x-[8.73%] -translate-y-[1.53%]">
                    <GlobeScene stage={stage} sp={sp} palette={ORB_GLOBE_PALETTE} />
                  </div>
                </div>
              </div>
            )}
            {showCapture && (
              <div
                className="absolute inset-0"
                style={{ opacity: crossT, transform: `scale(${0.6 + crossT * 0.4})`, transformOrigin: CUT_ORIGIN }}
              >
                <MissionCaptureFrames
                  sp={captureT}
                  fallback={<CaptureScene sp={captureT} range={0} palette={ORB_CAPTURE_PALETTE} />}
                />
              </div>
            )}

            <p className="pointer-events-none absolute bottom-0 left-0 font-plex text-orb-label uppercase text-orb-text-2">
              {STAGES[stage]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrbitDiagram;
