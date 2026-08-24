import React from 'react';
import OrbButton from './OrbButton';
import { CTA } from '../../data/brand';
import Dither from './Dither';

// Closing band — Figma 135:340 (Frame 24), 1436x1328. Every offset below is the
// node's own coordinate as a percentage of that frame:
//
//   lens     135:344 + 135:345  left 13.788%  top 0.753%   w 72.141%
//   content  135:351            left 24.373%  top 22.666%  w 50.209%
//   dot 30   135:352            left 73.816%  top 23.795%
//   dot 18   146:157            left 31.476%  top 52.334%

const OrbCtaBand = ({
  eyebrow = CTA.eyebrow,
  headline = CTA.headline,
  button = CTA.button,
  to = CTA.href,
}) => (
  <section
    className="relative overflow-hidden bg-orb-cta"
    data-figma="135:340"
    data-figma-name="CTA band"
  >
    <Dither />
    {/* The design's 1436px frame, capped and centred: the percentage offsets
        below only compose correctly against that width, while the gradient
        itself still bleeds edge to edge. */}
    <div className="relative mx-auto w-full max-w-[1436px] lg:aspect-[1436/1328]">
      {/* The lens is ONE 615.292 x 849.757 ellipse drawn twice, co-centred and
          counter-rotated 45 degrees. The 1035.946 square Figma reports for each
          is the AABB of the rotated rect — (615.292 + 849.757) / sqrt(2) — not a
          diameter, so reading it as a circle draws the shape oversized.

          Each stroke is a gradient down the ellipse's OWN axis, which the 45
          degree rotation turns into a diagonal: bright at the upper tip, fading
          into the band's own #161616 at the lower one. A flat low-alpha border
          loses both the brightness and the fade. */}
      <svg
        aria-hidden
        viewBox="0 0 1035.946 1035.946"
        fill="none"
        className="pointer-events-none absolute hidden left-[13.788%] top-[0.753%] aspect-square w-[72.141%] lg:block"
      >
        <defs>
          <linearGradient id="orb-cta-lens" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop stopColor="#D9D9D9" />
            <stop offset="1" stopColor="#161616" />
          </linearGradient>
        </defs>
        <ellipse
          cx="517.973"
          cy="517.973"
          rx="307.646"
          ry="424.879"
          stroke="url(#orb-cta-lens)"
          vectorEffect="non-scaling-stroke"
          transform="rotate(-45 517.973 517.973)"
        />
        <ellipse
          cx="517.973"
          cy="517.973"
          rx="307.646"
          ry="424.879"
          stroke="url(#orb-cta-lens)"
          vectorEffect="non-scaling-stroke"
          transform="rotate(45 517.973 517.973)"
        />
      </svg>

      {/* Accent dots, off-axis. */}
      <span
        aria-hidden
        className="pointer-events-none absolute hidden left-[73.816%] top-[23.795%] aspect-square w-[2.089%] rounded-full bg-white lg:block"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute hidden left-[31.476%] top-[52.334%] aspect-square w-[1.253%] rounded-full bg-white lg:block"
      />

      <div
        className="relative mx-auto flex max-w-[721px] flex-col items-center gap-[41px] px-6 py-28 text-center
                   lg:absolute lg:left-[24.373%] lg:top-[22.666%] lg:mx-0 lg:w-[50.209%] lg:max-w-none lg:p-0"
      >
        <p className="font-plex text-orb-eyebrow uppercase text-orb-accent">{eyebrow}</p>

        {/* 693px wide over 222px tall in the design — two lines at display scale. */}
        <h2 className="font-sohne font-normal text-orb-display leading-[0.975] tracking-[-0.044em] text-orb-text">
          {headline}
        </h2>

        <OrbButton to={to}>{button}</OrbButton>
      </div>
    </div>
  </section>
);

export default OrbCtaBand;
