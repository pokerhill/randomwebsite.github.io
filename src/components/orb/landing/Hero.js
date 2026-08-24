import React from 'react';
import { Link } from 'react-router-dom';
import OrbButton from '../OrbButton';
import { ARMS } from '../../../data/brand';
import HeroParticles from '../../../assets/orb/hero-particles.png';

// Landing hero (Figma 54:3, top band — a 1440x912 canvas).
//
// Geometry is taken from the design's node coordinates rather than eyeballed, and
// expressed as percentages of that canvas so it holds at any width:
//
//   particle arm   x=370  y=115  1072x797  -> 25.69% / 12.61% / 74.44%
//   copy block     x=38   y=413   626x426  ->  2.64% / 45.28% / 43.47%
//   flagship card  x=1009 y=682   401x162  -> 70.07% / 74.78% / 27.85%
//
// At lg and up the hero holds the design's 1440:912 aspect ratio (rather than a
// hard 912px height, which only composed correctly at exactly 1440px wide) so the
// percentage-placed blocks stay proportional at any viewport; below lg it collapses
// to normal flow.
//
// The arm is the design's particle treatment (node 114:24) exported flat rather
// than rebuilt from its ~27 individual triangle vectors, which are absolutely
// positioned on the 1440px canvas and would not survive a resize. Its backdrop was
// baked in as near-black — `mix-blend-screen` lifted that into a visible halo — so
// the asset now carries real alpha and composites directly.

const flagship = ARMS[0];

const Hero = () => (
  <section
    // Background is the design's "Rectangle 14" fill — the same two-stop gradient
    // the CTA band uses (bg-orb-cta: #161616 held flat to 60.966%, then to
    // #040632), not a plain 0%->100% interpolation. A hand-rolled `from-orb-bg
    // to-orb-navy` blends navy in from the very top instead of holding solid.
    className="relative isolate overflow-hidden bg-orb-cta"
    data-figma="54:3"
    data-figma-name="Hero"
  >
    {/* Faint starfield over the gradient. */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.35]"
      style={{
        backgroundImage:
          'radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,.5) 50%, transparent 50%),' +
          'radial-gradient(1px 1px at 70% 15%, rgba(255,255,255,.35) 50%, transparent 50%),' +
          'radial-gradient(1px 1px at 45% 70%, rgba(255,255,255,.3) 50%, transparent 50%),' +
          'radial-gradient(1px 1px at 85% 55%, rgba(255,255,255,.4) 50%, transparent 50%),' +
          'radial-gradient(1px 1px at 12% 85%, rgba(255,255,255,.3) 50%, transparent 50%)',
        backgroundSize: '260px 260px, 320px 320px, 200px 200px, 380px 380px, 240px 240px',
      }}
    />

    {/* The design's 1440px frame, capped and centred: the percentage offsets below
        only compose correctly against that width, while the gradient and starfield
        still bleed edge to edge. */}
    <div className="relative mx-auto w-full max-w-[1440px] overflow-hidden lg:aspect-[1440/912] lg:min-h-[760px]">
      <img
        src={HeroParticles}
        alt=""
        aria-hidden
        fetchpriority="high"
        className="pointer-events-none absolute left-[25.69%] top-[12.61%] w-[74.44%]"
      />

      {/* Copy block. Width is 47% (677px) rather than the design's 43.47% (626px):
          measured in-browser, Geist needs 670px to keep "Built to catch" on one line
          where Söhne needs 626px — 107% of the advance width. The wrap is visible and
          the block edge is not, so the width gives way rather than the type size.
          This 7% is the direct cost of the Söhne substitution. */}
      <div
        className="relative px-6 pb-32 pt-44 md:px-10 md:pt-52
                   lg:absolute lg:left-[2.64%] lg:top-[45.28%] lg:w-[47%] lg:px-0 lg:pb-0 lg:pt-0"
      >
        <h1 className="font-sohne font-normal text-orb-display text-orb-text">
          Built to catch spacecraft
        </h1>

        <p className="mt-8 max-w-[560px] font-sohne text-orb-lg text-orb-text">
          Enabling the next generation of space operations with autonomous robotics
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-9">
          <OrbButton to="/contact">BOOK DEMO</OrbButton>
          {/* Was "/products" — the old, pre-redesign product index page. "System"
              means the ORBtos system, so this points at its actual redesigned
              page rather than the generic old one. */}
          <OrbButton to="/products/satellite-os">SEE SYSTEM</OrbButton>
        </div>
      </div>

      {/* Flagship card. The design's link reads "SEE ORA-ASTRAFERA", a misspelling —
          the real name comes from brand.js. */}
      <div
        className="relative mx-6 mb-24 max-w-[390px] rounded-2xl border border-orb-glass-border
                   bg-orb-glass p-6 backdrop-blur-orb-glass md:mx-10
                   lg:absolute lg:left-[70.07%] lg:top-[74.78%] lg:mx-0 lg:mb-0
                   lg:w-[27.85%] lg:max-w-none"
      >
        <p className="font-sohne text-orb-body text-orb-text">{flagship.blurb}</p>
        <Link
          to="/products/robotic-arms"
          className="mt-4 inline-block font-plex text-orb-label uppercase text-orb-text
                     transition-colors hover:text-orb-accent"
        >
          See {flagship.name}
        </Link>
      </div>
    </div>
  </section>
);

export default Hero;
