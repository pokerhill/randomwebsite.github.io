import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import useInView from '../../motion/useInView';
import { STATS } from '../../../data/brand';

// Figma 205:179 — three centred columns split by full-height vertical hairlines.
//
// Two corrections against my first pass: the labels are Söhne sentence-case, NOT
// uppercase mono, and the numerals sit around 40px rather than at display scale.
// The label wording still comes from brand.js (the live site's "Arms Launched to
// Space") rather than the design's "Arms Flight Tested" — copy follows the live
// site, styling follows Figma.

// Counts up once on entry. Gated on `armed` rather than `inView` alone because
// some renderers never deliver IntersectionObserver callbacks, and a stat stuck
// on 0 is worse than one that animates early.
const CountUp = ({ value, suffix = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (inView) {
      setArmed(true);
      return undefined;
    }
    const fallback = setTimeout(() => setArmed(true), 1500);
    return () => clearTimeout(fallback);
  }, [inView]);

  useEffect(() => {
    if (!armed) return undefined;
    if (reduce) {
      setDisplay(value);
      return undefined;
    }
    const start = performance.now();
    const duration = 1100;
    let frame;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      // Ease-out so the number settles rather than stopping dead.
      setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [armed, reduce, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
};

const StatStrip = () => (
  <section className="bg-orb-bg px-6 py-16 md:px-10 md:py-20">
    <div className="mx-auto grid min-h-[204px] max-w-[1248px] divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
          data-figma="205:179"
          data-figma-name="Stat strip"
        >
      {STATS.map((stat) => (
        <div key={stat.label} className="flex flex-col items-center justify-center px-6 py-10 text-center">
          <p className="font-sohne text-[40px] leading-none text-orb-text">
            <CountUp value={stat.value} suffix={stat.suffix || ''} />
          </p>
          <p className="mt-6 font-sohne text-orb-caption text-orb-text">{stat.label}</p>
        </div>
      ))}
    </div>
  </section>
);

export default StatStrip;
