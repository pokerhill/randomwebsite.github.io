import React from 'react';
import OrbButton from '../OrbButton';
import { MISSION_LOG } from '../../../data/brand';

// "ARTICLES — The latest mission logs". Numbered rows separated by hairlines,
// each with the outlet in mono on the right. Titles are the live site's, so the
// design's "Al" (for AI) and "100(2026)" typos do not carry over.
//
// ALL ARTICLES is NOT a closing button under the list — the canonical node
// (header "Frame 18" 133:301 at y=7974 h=124, button "Frame 2" 135:314 at
// y=8051 h=46, list "Frame 22" 135:323 at y=8161) puts it inline, flush right
// against the same 1372px column the list uses, bottom-aligned with the
// headline: button spans y 8051..8097, the headline text spans y 8024..8098 —
// within a pixel of each other. So it is items-end in a row against the
// eyebrow+headline block, not below everything.

const MissionLogs = () => (
  <section className="bg-orb-bg px-6 py-28 md:px-10 md:py-36"
      data-figma="135:323"
      data-figma-name="Mission logs"
    >
    <div className="mx-auto max-w-[1362px]">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-plex text-orb-eyebrow uppercase text-orb-accent">ARTICLES</p>
          <h2 className="mt-8 font-sohne font-normal text-orb-h2 text-orb-text">
            The latest mission logs
          </h2>
        </div>

        <OrbButton to="/news">ALL ARTICLES</OrbButton>
      </div>

      <ul className="mt-16">
        {MISSION_LOG.map((item) => (
          <li key={item.index} className="border-t border-white/10 last:border-b">
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-4 py-10 transition-colors md:flex-row md:items-center md:gap-12"
            >
              <span className="font-plex text-orb-label text-orb-text-4">{item.index}</span>

              <span className="flex-1 font-sohne text-orb-lg text-orb-text transition-colors group-hover:text-orb-accent">
                {item.title}
              </span>

              <span className="font-plex text-orb-label uppercase text-orb-text-2">
                {item.source}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default MissionLogs;
