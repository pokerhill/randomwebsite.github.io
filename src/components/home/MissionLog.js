import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader, LedgerRow } from '../ui';

// Three latest entries from the news page, as a ledger. Keep in sync with
// src/pages/News.js ordering.
const entries = [
  {
    id: 'BLACK FLAG',
    label: 'Orbital Robotics named to the Black Flag 100 (2026)',
    href: 'https://www.blackflag.vc/100-2#company-orbital-robotics',
  },
  {
    id: 'SOPHIA SPACE',
    label: 'Exploratory collaboration on on-orbit AI compute and robotic manufacturing',
    href: 'https://sophia.space/news/sophia-space-and-orbital-robotics-announce-exploratory-collaboration-on-on-orbit-ai-compute-and-robotic-manufacturing-concepts',
  },
  {
    id: 'GEEKWIRE',
    label: 'Orbital Robotics reaches out with a plan for robotic arms that use AI',
    href: 'https://www.geekwire.com/2026/orbital-robotics-space-robotic-arms-ai/',
  },
];

const MissionLog = () => (
  <section className="py-24 bg-surface border-y hairline">
    <div className="container mx-auto px-6">
      <SectionHeader index="007" label="MISSION LOG" className="mb-8" />
      <div className="max-w-4xl">
        {entries.map((e) => (
          <LedgerRow
            key={e.id}
            id={e.id}
            label={e.label}
            href={e.href}
            trailing={<span className="type-mono-label text-text-faint group-hover:text-accent transition-colors">↗</span>}
          />
        ))}
        <div className="pt-6">
          <Link to="/news" className="type-mono-label text-accent hover:text-white transition-colors">
            FULL LOG →
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default MissionLog;
