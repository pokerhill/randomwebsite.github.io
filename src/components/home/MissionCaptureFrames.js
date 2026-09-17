import React, { useEffect, useRef } from 'react';

// Pre-rendered capture stage: a JPEG sequence baked from the live ORA CAD by
// scripts/render-capture-frames.js. Only pixels ship — no kinematics, no meshes.
// Scroll position (`sp`, 0→1) scrubs the sequence; frame index lines up 1:1 with
// the render steps, so no interpolation is needed.
//
// require.context pulls every frame at build time without manual imports. Until
// the frames exist (first run before the render pipeline), the list is empty and
// we render `fallback` so the app still builds and runs.
const ctx = require.context('../../assets/capture', false, /\.jpe?g$/);
const FRAMES = ctx
  .keys()
  .sort()
  .map((k) => {
    const m = ctx(k);
    return m && m.default ? m.default : m;
  });

// The sequence is ~9MB, so WHEN it is fetched decides the page's weight for most
// visitors. Two obvious options are both wrong: fetching on mount leaves the arm
// blank while 80 files download, and fetching at module load bills every visitor
// 9MB even if they never scroll that far.
//
// So warming is explicit and idempotent. The section that owns the sequence calls
// warmCaptureFrames() once it is within a screen or two of the viewport, which is
// far enough ahead that the frames are decoded before the handoff and late enough
// that someone who bounces off the hero never pays for them. Frames stay at low
// priority so they always yield to above-the-fold content.
const PRELOADED_FRAMES = [];

export const warmCaptureFrames = () => {
  if (PRELOADED_FRAMES.length || !FRAMES.length) return PRELOADED_FRAMES;
  FRAMES.forEach((src) => {
    const img = new Image();
    img.decoding = 'async';
    // Set before src, which is what actually starts the fetch.
    img.fetchPriority = 'low';
    img.src = src;
    PRELOADED_FRAMES.push(img);
  });
  return PRELOADED_FRAMES;
};

const MissionCaptureFrames = ({ sp, fallback = null }) => {
  const canvasRef = useRef(null);
  const imgsRef = useRef([]);
  const drawRef = useRef(null);
  const spRef = useRef(sp);
  spRef.current = sp;

  useEffect(() => {
    if (!FRAMES.length) return undefined;
    const canvas = canvasRef.current;
    // Mounting is itself proof the frames are needed now.
    imgsRef.current = warmCaptureFrames();

    const idxFor = (s) => {
      const i = Math.round((Number.isFinite(s) ? s : 0) * (FRAMES.length - 1));
      return Math.max(0, Math.min(FRAMES.length - 1, i));
    };

    const draw = () => {
      const c = canvasRef.current;
      if (!c) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = c.clientWidth;
      const h = c.clientHeight;
      if (!w || !h) return;
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      const gtx = c.getContext('2d');
      const img = imgsRef.current[idxFor(spRef.current)];
      // Matches the baked frames' own background (see scene.background in
      // MissionCapture3D.js) so any cover-fit letterbox/pillarbox strip blends
      // into the page instead of flashing pure black.
      gtx.fillStyle = '#161616';
      gtx.fillRect(0, 0, c.width, c.height);
      if (!img || !img.complete || !img.naturalWidth) return;
      // Cover-fit the frame into the canvas.
      const scale = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      gtx.drawImage(img, (c.width - dw) / 2, (c.height - dh) / 2, dw, dh);
    };

    drawRef.current = draw;
    // Redraw once each frame decodes so early scroll positions fill in.
    imgsRef.current.forEach((img) => img.addEventListener('load', draw, { once: true }));
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    draw();
    return () => {
      ro.disconnect();
      drawRef.current = null;
    };
  }, []);

  useEffect(() => {
    drawRef.current?.();
  }, [sp]);

  if (!FRAMES.length) return fallback;
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
};

export default MissionCaptureFrames;
