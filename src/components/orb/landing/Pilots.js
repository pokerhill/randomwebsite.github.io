import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import OrbButton from '../OrbButton';
import { CREW, SOFTWARE } from '../../../data/brand';
import PilotsGlow from '../../../assets/orb/pilots-glow.svg';

// "THE PILOTS" — Figma 54:3, the band around y=2831..3690.
//
// Portraits paired to names by CREW order (Aaron, Riley, Sohil — the three
// Co-Founders), same source photos as the Team page rather than a separate
// design-sourced set.
//
// The cards are NOT a flat row: the design steps each one further down
// (y=2831.7 / 2995.7 / 3164.7), a ~164px cascade.
//
// Scrolling pulls that cascade straight. The offsets converge on their own mean
// rather than on zero, so the band keeps a constant height — animating toward
// zero would shrink the section under the reader mid-scroll and shove everything
// below it upward.

const founders = CREW.filter((m) => m.role.startsWith('Co-Founder'));

const CASCADE = [0, 164, 333];
const LEVEL = CASCADE.reduce((a, b) => a + b, 0) / CASCADE.length;

// Portraits are the same 2026 headshots used on the Team page (brand.js
// CREW[].image) rather than a separate design-sourced set, so this card's
// crop point mirrors the Team page's: object-cover (never stretched — the
// card's aspect-[363/413] is within a percent of the Team grid's
// aspect-[307/349], so the same "50% 10%" position — a little headroom above
// the hairline, cropping from the bottom — reads the same way in both places.
const PORTRAITS = founders.map(() => ({ position: 'object-[50%_10%]' }));

// The design's body copy names the stack; composed from brand.js so the names
// stay in sync with the rest of the site.
const stack = `${SOFTWARE[2].name}, ${SOFTWARE[1].name}, and ${SOFTWARE[0].name}`;

// The cascade only exists at lg and up; below that the cards are a single
// column, where nudging them vertically would just misalign the stack.
const useIsWide = () => {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return wide;
};

const PilotCard = ({ member, portrait, offset, progress, still }) => {
  // 1 at rest holds the design's cascade, 0 lands every card on the same line.
  const y = useTransform(progress, (p) => (still ? offset : offset + (LEVEL - offset) * p));

  return (
    <motion.figure style={still ? undefined : { y }} className="lg:will-change-transform">
      <img
        src={member.image}
        alt={member.name}
        className={`aspect-[363/413] w-full rounded-sm object-cover ${portrait.position}`}
      />
      <figcaption className="mt-7">
        <p className="font-sohne text-orb-lg text-orb-text">{member.name}</p>
        <p className="mt-3 font-sohne text-orb-caption text-orb-text-2">{member.role}</p>
      </figcaption>
    </motion.figure>
  );
};

const Pilots = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const wide = useIsWide();
  // Measured across the CARDS, not the section: tracking the section meant the
  // range completed while the heading was still on screen, so the portraits were
  // already level by the time you could see them.
  //
  // The range starts once the cards are properly in frame rather than as they
  // enter, so the design's full 0/164/333 cascade is what you first read. It
  // straightens from there. Starting at the fold spent most of the travel while
  // the cards were still half off screen, which showed a diagonal already partly
  // collapsed.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.4', 'end 0.9'] });

  return (
    <section className="overflow-hidden bg-orb-bg px-6 py-28 md:px-10 md:py-36">
      {/* isolate: without a real stacking context here, the glow's -z-10
          below doesn't stay "behind this section's own content" — it
          escapes to the page's root stacking context and an opaque sibling
          section painted over it, making it invisible however bright. */}
      <div className="relative isolate mx-auto max-w-[1362px]">
        {/* Ellipse 3 (121:185) — a soft ring sitting mostly behind Riley's
            card, just reaching Sohil's card's left edge. get_design_context's
            reference code rendered this as an unrotated size-full fill, but
            get_screenshot on the same node shows a clearly TILTED oval — same
            trap as the ring-a/ring-b lens elsewhere on this site, where the
            exported code silently drops a rotation.
            Figma's own reported bounding box (993.6/2705.2, 1248.4x1110)
            turned out to have the right SIZE and Y but the wrong X — a
            rotated-rectangle bounding-box fit against the SVG's true
            655.951x1062.28 viewBox does solve that box almost exactly at
            θ≈58.94° (confirming the size/rotation), but rendering it there
            put the ring off past Sohil's card, not behind Riley's — visibly
            wrong against the actual Figma render.
            Rather than trust that reported x a second time, this position is
            fit directly from the rendered page: sampled ~80 edge-crossing
            pixels of the visible ring in the gaps between/above/below the
            three cards (get_screenshot on the whole Landing Page, cropped to
            this section) and least-squares fit a conic through them. That
            fit's axes (652.9 x 1061.6) and angle (58.9° off vertical) land
            within a percent of the SVG's real size and the rotation above —
            strong confirmation the fit is right — and gives a true centre of
            (707.2, 3258.0), a full 910px left of where the reported box's
            centre would place it. Positioned here as the SVG's own native
            655.951x1062.28 box (aspect-locked, so it can't distort at other
            viewport widths), centred at that fitted point, then rotated —
            rotating about an element's own centre doesn't move that centre,
            so no further position correction is needed after that. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[49.06%] top-[65.7%] -z-10 hidden w-[48.16%] -translate-x-1/2 -translate-y-1/2 rotate-[58.94deg] lg:block"
          style={{ aspectRatio: '655.951 / 1062.28' }}
        >
          <img src={PilotsGlow} alt="" className="h-full w-full" />
        </div>

        {/* Text block is centred in the design, with the CTA centred beneath it. */}
        <div
          className="mx-auto flex max-w-[721px] flex-col items-center text-center"
          data-figma="121:182"
          data-figma-name="The pilots"
        >
          <p className="font-plex text-orb-eyebrow uppercase text-orb-accent">THE PILOTS</p>

          <h2 className="mt-6 font-sohne font-normal text-orb-h2 text-orb-text">
            We build what we fly.
          </h2>

          <p className="mt-6 font-sohne text-orb-body text-orb-text opacity-70">
            Three founders, one lab in Seattle. The hands on the hardware are the same hands behind{' '}
            {stack} — nothing between design and flight.
          </p>

          <div className="mt-8">
            <OrbButton to="/team">MEET THE FULL CREW</OrbButton>
          </div>
        </div>

        {/* Below lg the cards stack, so the cascade collapses and the transform is
            dropped rather than shifting a single column around. */}
        <div ref={ref} className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:items-start lg:pb-[333px]">
          {founders.map((m, i) => (
            <PilotCard
              key={m.name}
              member={m}
              portrait={PORTRAITS[i]}
              offset={CASCADE[i] || 0}
              progress={scrollYProgress}
              still={reduce || !wide}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pilots;
