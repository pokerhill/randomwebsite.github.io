import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '../ui';

// Partner logos (static row — no marquee).
import Enduralock from '../../assets/images/partners/Enduralock.png';
import Matrix from '../../assets/images/partners/Matrix.avif';
import OrbitFab from '../../assets/images/partners/OrbitFab_logo.png';
import SophiaSpace from '../../assets/images/partners/Sophia_Space.png';
import SpaceCopy from '../../assets/images/partners/space_copy_white.png';
import SpaceOcean from '../../assets/images/partners/Space_Ocean.jpeg';
import Starcloud from '../../assets/images/partners/StarCloud_White.png';
import WilsonSonsini from '../../assets/images/partners/Wilson Sonsini.png';
import Nvidia from '../../assets/images/partners/nvidia.jpg';
import OrbitalComposites from '../../assets/images/partners/orbitalcomposites.png';

// Heritage facts — every chip is a claim the team can defend today.
const chips = [
  '6 FLIGHT DEMOS — NASA & U.S. UNIVERSITIES',
  'BLUE ORIGIN / SPACEX / MDA ALUMNI',
  'TRL-4 — PATENT PENDING',
  'FIRST COMMERCIAL CONTRACT — SIGNED 2025',
];

const partners = [
  { name: 'Nvidia', logo: Nvidia },
  { name: 'Orbit Fab', logo: OrbitFab },
  { name: 'Orbital Composites', logo: OrbitalComposites },
  { name: 'Space Copy', logo: SpaceCopy },
  { name: 'Enduralock', logo: Enduralock },
  { name: 'Sophia Space', logo: SophiaSpace },
  { name: 'Starcloud', logo: Starcloud },
  { name: 'Wilson Sonsini', logo: WilsonSonsini },
  { name: 'Matrix', logo: Matrix },
  { name: 'Space Ocean', logo: SpaceOcean },
];

const HeritageStrip = () => (
  <section className="py-24 bg-background">
    <div className="container mx-auto px-6">
      <SectionHeader
        index="001"
        label="HERITAGE"
        title="Built by people who've flown hardware."
        lede="Founded by engineers from Blue Origin, SpaceX, and NASA-affiliated flight programs — with robotic-arm flight demonstrations already behind the team."
        className="mb-10"
      />

      <div className="flex flex-wrap gap-3 mb-16">
        {chips.map((chip, i) => (
          <motion.span
            key={chip}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="type-mono-label inline-flex items-center gap-2 border hairline px-4 py-2.5 text-text-secondary"
          >
            <span className="text-ember">▸</span>
            {chip}
          </motion.span>
        ))}
      </div>

      <div className="type-mono-label text-text-faint mb-6">WORKING WITH</div>
      <div className="flex flex-wrap items-center gap-x-12 gap-y-8">
        {partners.map((p) => (
          <img
            key={p.name}
            src={p.logo}
            alt={p.name}
            loading="lazy"
            className="h-8 w-auto max-w-[8rem] object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
          />
        ))}
      </div>
    </div>
  </section>
);

export default HeritageStrip;
