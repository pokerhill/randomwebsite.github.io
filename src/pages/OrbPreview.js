import React from 'react';
import { OrbNav, OrbFooter, OrbCtaBand, OrbButton, DividerGlow } from '../components/orb';
import { STATS, CREW, ADVISORS, ARMS, OPEN_ROLES } from '../data/brand';

// Review surface for the redesign chrome and tokens before the real pages are
// built on them. Not linked from the nav — reachable at /#/orb-preview.

const Swatch = ({ name, className }) => (
  <div className="flex flex-col gap-2">
    <div className={`h-16 w-full rounded border border-white/10 ${className}`} />
    <span className="font-plex text-orb-label uppercase text-orb-text-4">{name}</span>
  </div>
);

const OrbPreview = () => (
  <div className="min-h-screen bg-orb-bg">
    <OrbNav />

    {/* Hero register — display type at the design's tracking and leading. */}
    <section className="px-6 pb-24 pt-48 md:px-10">
      <div className="mx-auto max-w-[1362px]">
        <h1 className="max-w-[620px] font-sohne text-orb-display text-orb-text">
          Built to catch spacecraft
        </h1>
        <p className="mt-8 max-w-[520px] font-sohne text-orb-lg text-orb-text">
          Enabling the next generation of space operations with autonomous robotics
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-9">
          <OrbButton to="/contact">BOOK DEMO</OrbButton>
          <OrbButton to="/products/satellite-os">SEE SYSTEM</OrbButton>
        </div>
      </div>
    </section>

    <DividerGlow />

    {/* Stats — canonical values, not the design's placeholder labels. */}
    <section className="px-6 py-20 md:px-10">
      <div className="mx-auto grid max-w-[1362px] gap-10 sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label}>
            <p className="font-sohne text-orb-h1 text-orb-text">
              {s.value}
              {s.suffix || ''}
            </p>
            <p className="mt-2 font-plex text-orb-label uppercase text-orb-text-2">{s.label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Token check */}
    <section className="px-6 py-20 md:px-10">
      <div className="mx-auto max-w-[1362px]">
        <p className="font-plex text-orb-eyebrow uppercase text-orb-accent">TOKENS</p>
        <h2 className="mt-6 font-sohne text-orb-h2 text-orb-text">Palette and type</h2>

        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
          <Swatch name="bg #161616" className="bg-orb-bg" />
          <Swatch name="black" className="bg-orb-black" />
          <Swatch name="navy #040632" className="bg-orb-navy" />
          <Swatch name="card #202020" className="bg-orb-card" />
          <Swatch name="accent #3B45F5" className="bg-orb-accent" />
          <Swatch name="glass" className="bg-orb-glass backdrop-blur-orb-glass" />
        </div>

        <div className="mt-14 flex flex-col gap-4">
          <p className="font-sohne text-orb-display text-orb-text">Display 113.9</p>
          <p className="font-sohne text-orb-h1 text-orb-text">Heading 80</p>
          <p className="font-sohne text-orb-h2 text-orb-text">Heading 64</p>
          <p className="font-sohne text-orb-sub text-orb-text">Sub 48</p>
          <p className="font-sohne text-orb-lead text-orb-text">Lead 42</p>
          <p className="font-sohne text-orb-lg text-orb-text">Large 32</p>
          <p className="font-sohne text-orb-body text-orb-text opacity-70">Body 20 at 70% opacity</p>
          <p className="font-plex text-orb-eyebrow uppercase text-orb-accent">Mono eyebrow 22</p>
        </div>
      </div>
    </section>

    {/* Arms — correct spellings */}
    <section className="bg-orb-black px-6 py-20 md:px-10">
      <div className="mx-auto grid max-w-[1362px] gap-12 md:grid-cols-3">
        {ARMS.map((arm) => (
          <div key={arm.id}>
            <p className="font-plex text-orb-eyebrow uppercase text-orb-accent">{arm.eyebrow}</p>
            <h3 className="mt-4 font-sohne text-orb-h2 text-orb-text">{arm.name}</h3>
            <p className="mt-4 font-sohne text-orb-body text-orb-text opacity-70">{arm.blurb}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Crew + advisors — corrected names and credentials */}
    <section className="px-6 py-20 md:px-10">
      <div className="mx-auto max-w-[1362px]">
        <h2 className="font-sohne text-orb-h1 text-orb-text">Meet the crew</h2>

        <div className="mt-12 grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
          {CREW.map((m) => (
            <div key={m.name}>
              <img
                src={m.image}
                alt={m.name}
                className="h-[349px] w-full object-cover object-bottom"
              />
              <p className="mt-8 font-sohne text-orb-lg text-orb-text">{m.name}</p>
              <p className="mt-3 font-sohne text-orb-caption text-orb-text-2">{m.role}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-24 font-sohne text-orb-h1 text-orb-text">Advisors and Board</h3>

        <div className="mt-10 flex flex-col">
          {ADVISORS.map((a) => (
            <div
              key={a.name}
              className="flex flex-col gap-8 border-t border-white/10 py-10 lg:flex-row lg:items-center lg:gap-20"
            >
              <img
                src={a.image}
                alt={a.name}
                className="h-[153px] w-[153px] shrink-0 rounded-full object-cover"
              />
              <div className="flex w-full max-w-[235px] flex-col gap-6">
                <div>
                  <p className="font-sohne text-orb-caption text-orb-text">{a.role}</p>
                  <p className="mt-3 font-sohne text-orb-lg text-orb-text">{a.name}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {a.credentials.map((c) => (
                    <span
                      key={c}
                      className="bg-orb-accent p-1 font-sohne text-orb-tag text-orb-text"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <p className="max-w-[762px] font-sohne text-orb-body text-orb-text opacity-70">{a.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Open roles — three distinct roles, with the salary the design drops */}
    <section className="px-6 py-20 md:px-10">
      <div className="mx-auto max-w-[1362px]">
        <h2 className="font-sohne text-orb-h2 text-orb-text">Open Roles</h2>
        <p className="mt-10 border-t border-white/10 pt-10 font-sohne text-orb-text">Engineering</p>

        <div className="mt-6 flex flex-col gap-4">
          {OPEN_ROLES.map((r) => (
            <div
              key={r.id}
              className="flex flex-col gap-6 bg-orb-card px-6 py-10 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-4">
                <p className="font-sohne text-orb-lg text-orb-text">{r.title}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="bg-orb-accent p-2.5 font-sohne text-orb-caption text-orb-text">
                    {r.department}
                  </span>
                  <p className="font-sohne text-orb-caption text-orb-text">
                    {r.location} &nbsp;•&nbsp; {r.type}
                  </p>
                  <p className="font-sohne text-orb-caption text-orb-text-2">{r.salary}</p>
                </div>
              </div>
              <p className="font-sohne text-orb-caption text-orb-text">View Role →</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <OrbCtaBand />
    <OrbFooter />
  </div>
);

export default OrbPreview;
