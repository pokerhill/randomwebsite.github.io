import React, { useState } from 'react';
import { ARMS } from '../../../data/brand';
import OrbButton from '../OrbButton';
import Marquee from '../Marquee';
import RingA from '../../../assets/orb/ring-a.svg';
import RingB from '../../../assets/orb/ring-b.svg';

// "THE HARDWARE" — Figma 114:55 ("Frame 6"), pulled directly this time via
// get_design_context + get_metadata on the live page node (not the earlier
// disconnected "385:353 Wide Example" reference frame, which mixed coordinate
// spaces and was the source of most of the drift below).
//
// Frame 6 is 1434x1313 and every decorative/interactive piece below the
// heading — rings, arm render, spec list, glass card, switcher row, corner
// tick — has an exact px position and size within it. Previously each of
// those pieces was positioned against a DIFFERENT reference (the arm+rings
// against their own aspect-square wrapper sized by viewport width, the spec
// list/card/switcher against percentages of a `min-h-[560px]` flow container
// whose actual height was itself set by that same arm wrapper). Because the
// arm wrapper's height changed with viewport width but the stage height was
// derived FROM it, resizing the window changed the stage height, which moved
// every percentage-positioned sibling — the arm visibly drifting relative to
// the card/switcher/spec-list on every resize. It also meant the card and
// switcher never actually shared a coordinate system with the arm at all.
//
// Fixed by giving the whole stage one aspect-ratio-locked box and positioning
// every element in it — including the arm — as a percentage of that SAME
// box, computed from Figma's own numbers. All of them now scale together by
// construction; nothing can drift out of alignment with anything else.
//
// The stage's own box uses Figma's rings-top (y=273) to frame-bottom
// (y=1313) span as its 0%-100% vertical reference (990px over a 1434px
// width — aspect-[1434/1040]); horizontal 0-100% is the full frame width.
// Percentages below are each element's Figma position translated into that
// same box:
//   rings   left 31.87% top 0%      w 72.24%  h 99.61%  (1035.9px square)
//   arm     left 49.09% top 19.42%  w 42.82%  h 59.04%  (614px square)
//   specs   left  4.39% top 19.13%  w 21.34%
//   card    left  4.39% top 38.08%  w 34.73%  h 25.19%  (498x262 — the card
//                                                          was 300px wide
//                                                          before; Figma's
//                                                          "Frame 7" is 498)
//   switcher row              top 72.79%   (labels at left 4.05/20.78/30.82%)
//   corner tick                left 39.89% top 62.21%
//
// Below lg this whole percentage stage is hidden in favour of a plain
// stacked flow layout (same convention Pilots.js uses for its cascade) —
// scaling Figma's dense absolute layout straight down to a phone width
// would print the spec list and card as illegibly small slivers.
//
// The glass card's own style is exact from Figma's "Frame 7" (114:73), and
// is NOT the site's usual glass-card recipe (rgba(69,73,78,.33)) — this one
// is bluer and lighter, with sharp corners:
//   background     rgba(130, 143, 155, 0.25)
//   backdrop-blur  24.7px
//   no corner radius
//
// Each variant shows its own render, name, blurb, and link, keyed off the
// selected arm.

const SPECS = ['7 DOF', 'RADIATION-TOLERANT', 'MISSION-CUSTOMIZABLE'];

const Hardware = () => {
  const [active, setActive] = useState(ARMS[0].id);
  const activeArm = ARMS.find((a) => a.id === active) || ARMS[0];

  // Figma (84:19, 84:20): the same 2-ellipse lens as the CTA band and the
  // arm-detail renders — one shape (ring-a/ring-b share the identical
  // 615.292x849.757 path) rotated +45deg, the other -scale-y-100
  // rotate-135deg, both centred in a box 168.75% of their own container.
  // Each ellipse is sized to 82.03%/59.39% of that square wrapper (its own
  // native aspect, not h-full/w-full which would stretch it into a circle)
  // and then rotated. Two unrotated copies of the same ellipse stack
  // exactly on top of each other and read as one ring, not two.
  const rings = (
    <div className="pointer-events-none absolute left-1/2 top-1/2 flex aspect-square w-[168.75%] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
      <img src={RingA} alt="" aria-hidden className="absolute h-[82.03%] w-[59.39%] rotate-45 opacity-30" />
      <img
        src={RingB}
        alt=""
        aria-hidden
        className="absolute h-[82.03%] w-[59.39%] -scale-y-100 rotate-[135deg] opacity-30"
      />
    </div>
  );

  // Figma's own card ("Frame 7", 114:73) is a fixed 262px tall with
  // overflow-clip, not a box that grows with its content — Mini's blurb is
  // much longer than the other two, and without a cap the card grows tall
  // enough to collide with the switcher row below it. A flat clip risks
  // clipping the "SEE ARM" button itself for Mini's longer text, so the
  // button is pinned to the bottom of a flex column and the blurb is
  // line-clamped instead — the box still never exceeds its given height,
  // but the button is never the part that goes missing.
  const card = (
    <div
      className="flex h-full w-full flex-col overflow-hidden p-6"
      style={{ background: 'rgba(130,143,155,0.25)', backdropFilter: 'blur(24.7px)' }}
    >
      <p className="font-sohne text-[clamp(28px,3vw,48px)] font-semibold leading-[1.1] text-orb-text">
        {activeArm.name}
      </p>
      <p className="mt-4 line-clamp-3 font-sohne text-orb-caption text-orb-text-2">{activeArm.blurb}</p>
      <div className="mt-auto pt-6">
        <OrbButton to="/products/robotic-arms">SEE ARM</OrbButton>
      </div>
    </div>
  );

  const switcher = (
    <div className="flex flex-wrap justify-center gap-6 lg:justify-start">
      {ARMS.map((arm) => (
        <button
          key={arm.id}
          type="button"
          onClick={() => setActive(arm.id)}
          aria-pressed={active === arm.id}
          className={`font-plex text-orb-label uppercase transition-colors
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                      focus-visible:outline-orb-accent ${
                        active === arm.id ? 'text-orb-accent' : 'text-orb-text hover:text-orb-accent'
                      }`}
        >
          {arm.name}
        </button>
      ))}
    </div>
  );

  const specs = (
    <ul className="pointer-events-none flex flex-col gap-2 whitespace-nowrap font-plex text-orb-label uppercase tracking-[0.22em] text-orb-text-2">
      {SPECS.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );

  return (
    <section
      className="relative overflow-hidden bg-orb-black px-6 py-28 md:px-10 md:py-36"
      data-figma="114:55"
      data-figma-name="The hardware"
    >
      <div className="relative mx-auto max-w-[1362px]">
        <div className="mx-auto max-w-[784px] text-center">
          <p className="font-plex text-orb-eyebrow uppercase text-orb-accent">THE HARDWARE</p>
          <h2 className="mt-6 font-sohne font-normal text-orb-h2 text-orb-text">
            One architecture. Three arms.
          </h2>
          <p className="mx-auto mt-6 max-w-[550px] font-sohne text-orb-body text-orb-text opacity-70">
            Every ORA arm shares the same control software, perception stack, and joint architecture
            — sized for the mission.
          </p>
        </div>

        {/* lg+: one aspect-ratio-locked stage, every piece positioned as a
            percentage of it (see the file-level comment for the exact
            numbers). Because everything shares the same box, resizing the
            window scales the whole composition uniformly — nothing can
            drift out of alignment with anything else. */}
        <div className="relative mt-16 hidden aspect-[1434/1040] w-full lg:block">
          {/* Oversized wordmark. In Figma this is a single 4919px-wide text at
              x=-154 — a track, not static type — so it scrolls. It runs through
              the vertical centre and the arm occludes it. */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
            <Marquee className="w-full">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="px-10 font-sohne text-[17vw] font-bold uppercase leading-none tracking-[-0.01em] text-white opacity-[0.16]"
                >
                  {activeArm.name}
                </span>
              ))}
            </Marquee>
          </div>

          <div className="absolute left-[31.87%] top-0 z-10 h-[99.61%] w-[72.24%]">{rings}</div>

          <img
            src={activeArm.image}
            alt={activeArm.name}
            className="absolute left-[49.09%] top-[19.42%] z-10 h-[59.04%] w-[42.82%] object-contain"
          />

          <div className="absolute left-[4.39%] top-[19.13%] z-10">{specs}</div>

          <div className="absolute left-[4.39%] top-[38.08%] z-10 h-[25.19%] w-[34.73%]">{card}</div>

          <div className="absolute left-[4.05%] top-[72.79%] z-10">{switcher}</div>

          {/* Small corner tick the design places mid-stage. */}
          <span
            aria-hidden
            className="absolute left-[39.89%] top-[62.21%] z-10 h-3 w-3 border-b border-l border-white/40"
          />
        </div>

        {/* Below lg: Figma's dense absolute composition doesn't scale down to
            phone width without printing its spec list and card illegibly
            small, so this is a plain stacked flow instead — same content
            and relationships, simple layout rather than a scaled replica
            (the same approach Pilots.js takes for its founder cascade). */}
        <div className="mt-16 flex flex-col items-center gap-10 lg:hidden">
          <div className="relative aspect-square w-full max-w-[360px]">
            {rings}
            <img
              src={activeArm.image}
              alt={activeArm.name}
              className="relative h-full w-full object-contain p-[12%]"
            />
          </div>
          <div className="text-center">{specs}</div>
          <div className="h-[262px] w-full max-w-[380px]">{card}</div>
          {switcher}
        </div>
      </div>
    </section>
  );
};

export default Hardware;
