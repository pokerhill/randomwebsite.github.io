import React from 'react';
import OrbButton from './OrbButton';
import { CTA } from '../../data/brand';

// Closing band — Figma 135:340 (Frame 24), 1436x1328.
//
// Rebuilt from node coordinates after the first version was guessed and read
// nothing like the design. Every position is the node's own coordinate as a
// percentage of the band:
//
//   ring A   135:344  left 13.65%  top 33.52%  w 72.14%   (1035.95 square)
//   ring B   135:345  left 13.65%  top 46.00%  w 72.14%   (1035.95 square)
//   content  135:351  left 24.23%  top 22.67%  w 50.21%
//   dot 30   135:352  left 73.68%  top 23.80%  w  2.09%
//   dot 18   146:157  left 31.34%  top 52.33%  w  1.25%
//
// Two corrections account for most of the difference:
//   - The rings are two IDENTICAL circles offset vertically by ~166px, forming a
//     lens. The first pass used counter-rotated squashed ellipses — a different
//     shape entirely.
//   - The band is 1328px tall (aspect 1.081). The first pass was ~721px, so the
//     rings had no room and the section read as a short strip.

const OrbCtaBand = ({
  eyebrow = CTA.eyebrow,
  headline = CTA.headline,
  button = CTA.button,
  to = CTA.href,
}) => (
  <section
    className="relative overflow-hidden bg-orb-cta lg:aspect-[1436/1328]"
    data-figma="135:340"
    data-figma-name="CTA band"
  >
    {/* The lens is two ellipses rotated +/-45 degrees, not two circles. The
        1035.946 square in the metadata is the ROTATED bounding box; the shape
        itself is 615.292 x 849.757 (59.39% x 82.03% of that square), one rotated
        -45 and one mirrored, exactly as the design context spells out. Reading the
        square bbox as a circle flattened the petal into a plain ring. */}
    <div
      aria-hidden
      className="pointer-events-none absolute left-[13.65%] top-[-1%] aspect-square w-[72.14%]"
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-[82.03%] w-[59.39%] -rotate-45 rounded-[50%] border border-white/[0.10]" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[82.03%] w-[59.39%] rotate-45 rounded-[50%] border border-white/[0.10]" />
      </div>
    </div>

    {/* Accent dots, off-axis. */}
    <span
      aria-hidden
      className="pointer-events-none absolute left-[73.68%] top-[9.5%] aspect-square w-[2.09%] rounded-full bg-white"
    />
    <span
      aria-hidden
      className="pointer-events-none absolute left-[31.34%] top-[37%] aspect-square w-[1.25%] rounded-full bg-white"
    />

    <div
      className="relative mx-auto flex max-w-[721px] flex-col items-center px-6 py-28 text-center
                 lg:absolute lg:left-[24.23%] lg:top-[9%] lg:mx-0 lg:w-[50.21%] lg:max-w-none lg:p-0"
    >
      <p className="font-plex text-orb-eyebrow uppercase text-orb-accent">{eyebrow}</p>

      {/* 693px wide over 222px tall in the design — two lines at display scale. */}
      <h2 className="mt-8 font-sohne font-normal text-orb-display leading-[0.975] tracking-[-0.044em] text-orb-text">
        {headline}
      </h2>

      <div className="mt-10">
        <OrbButton to={to}>{button}</OrbButton>
      </div>
    </div>
  </section>
);

export default OrbCtaBand;
