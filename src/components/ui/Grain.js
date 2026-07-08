import React from 'react';

// Subtle fixed grain overlay for tactile, machined-material depth. Sits below
// the header (z-50) and is pointer-events-none so it never blocks interaction.
// SVG fractal-noise data URI keeps it dependency-free and crisp at any DPR.
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const Grain = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 z-30 opacity-[0.035] mix-blend-soft-light"
    style={{ backgroundImage: NOISE, backgroundSize: '140px 140px' }}
  />
);

export default Grain;
