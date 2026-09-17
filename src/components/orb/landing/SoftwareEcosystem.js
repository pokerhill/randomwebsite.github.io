import React from 'react';
import OrbButton from '../OrbButton';
import { SOFTWARE } from '../../../data/brand';
import LoopDiagram from '../../../assets/orb/loop-diagram.webp';

// Figma 335:372 (Frame 85). Two stacked blocks:
//
//   1. A bracket-framed row: "SOFTWARE SYSTEM" + the ORBtos lockup on the left,
//      "Control the dexterity layer in space" + LEARN on the right.
//   2. Below: "ORBtos + NavIQ + ASTRA-P" in accent mono over a large statement,
//      with the closed-loop diamond diagram on the right.
//
// The diagram (VISION → ORBTOS → MOTION diamonds over a circular particle field)
// is exported flat: in Figma its backdrop is itself a pasted screenshot, so there
// is nothing cleaner to rebuild from. Labels are covered by `alt`.

const [orbtos, naviq, astrap] = SOFTWARE;

// The design frames this block with hairline corner brackets.
const Bracket = ({ className }) => (
  <span
    aria-hidden
    className={`pointer-events-none absolute h-5 w-5 border-white/40 ${className}`}
  />
);

const SoftwareEcosystem = () => (
  <section className="bg-orb-bg px-6 py-28 md:px-10 md:py-36"
      data-figma="335:372"
      data-figma-name="Software ecosystem"
    >
    <div className="mx-auto max-w-[1362px]">
      {/* Block 1 — bracket-framed lockup row */}
      <div className="relative px-6 py-14 md:px-11">
        <Bracket className="left-0 top-0 border-l border-t" />
        <Bracket className="right-0 top-0 border-r border-t" />
        <Bracket className="bottom-0 left-0 border-b border-l" />
        <Bracket className="bottom-0 right-0 border-b border-r" />

        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="font-plex text-orb-label uppercase tracking-[0.14em] text-orb-text">
              SOFTWARE SYSTEM
            </p>
            {/* Mono bold, near-display scale — the design's ORBtos lockup. */}
            <p className="mt-4 font-plex text-[clamp(3.5rem,9vw,8.3rem)] font-bold uppercase leading-none tracking-[0.01em] text-orb-text">
              {orbtos.name}
            </p>
          </div>

          <div>
            <h2 className="max-w-[580px] font-sohne font-normal text-orb-h2 text-orb-text">
              Control the dexterity layer in space
            </h2>
            <div className="mt-10">
              <OrbButton to="/products/satellite-os">LEARN</OrbButton>
            </div>
          </div>
        </div>
      </div>

      {/* Block 2 — statement + closed-loop diagram */}
      <div className="mt-24 grid items-center gap-16 lg:grid-cols-2">
        <div>
          <p className="font-plex text-orb-label uppercase tracking-[0.09em] text-orb-accent">
            {orbtos.name} + {naviq.name} + {astrap.name}
          </p>
          <p className="mt-8 max-w-[591px] font-sohne text-orb-h2 text-orb-text">
            Closes the loop between sight and motion enabling autonomous capture
          </p>
        </div>

        <img
          src={LoopDiagram}
          alt={`Closed loop: ${naviq.name} provides vision, ${orbtos.name} hosts the stack, ${astrap.name} drives motion.`}
          className="mx-auto w-full max-w-[763px]"
        />
      </div>
    </div>
  </section>
);

export default SoftwareEcosystem;
