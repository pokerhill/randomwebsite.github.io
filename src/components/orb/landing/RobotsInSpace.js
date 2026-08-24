import React from 'react';

// Figma 114:42 (682x314), at y=2437 — "ROBOTS IN SPACE".
//
// Corrected on two counts after finally rendering the reference: the block is
// CENTRED, not left-aligned, and it carries a body paragraph that was missing
// entirely. (The node id was also swapped with THE PILOTS in my first tagging —
// 121:182 is that one, not this.)

// No background on the section: the orbit diagram below is pulled up 271px and
// tucks 127px under this copy, and an opaque section background painted a plate
// straight over the top of the globe. z-10 alone keeps the type above the orbits,
// which is the only thing that needs to win here. The page wrapper carries the
// background colour.
const RobotsInSpace = () => (
  <section className="relative z-10 px-6 py-28 md:px-10 md:py-36">
    <div className="mx-auto flex max-w-[682px] flex-col items-center text-center" data-figma="114:42" data-figma-name="Robots in space">
      <p className="font-plex text-orb-eyebrow uppercase text-orb-accent">ROBOTS IN SPACE</p>

      <h2 className="mt-6 font-sohne font-normal text-orb-h2 text-orb-text">
        Built by people who have flown hardware
      </h2>

      <p className="mt-6 font-sohne text-orb-body text-orb-text opacity-70">
        Autonomous robotic arms that rendezvous with, capture, and service spacecraft in orbit. Every
        maneuver you&rsquo;re watching was computed by our flight software.
      </p>
    </div>
  </section>
);

export default RobotsInSpace;
