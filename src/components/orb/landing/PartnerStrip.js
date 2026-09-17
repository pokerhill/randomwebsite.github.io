import React from 'react';
import Marquee from '../Marquee';

import Starcloud from '../../../assets/images/partners/StarCloud_White.png';
import WilsonSonsini from '../../../assets/images/partners/Wilson Sonsini.png';
import Matrix from '../../../assets/images/partners/Matrix.avif';
import SpaceOcean from '../../../assets/images/partners/Space_Ocean.jpeg';
import Nvidia from '../../../assets/images/partners/nvidia.jpg';
import OrbitFab from '../../../assets/images/partners/OrbitFab_logo.png';
import OrbitalComposites from '../../../assets/images/partners/orbitalcomposites.png';
import SpaceCopy from '../../../assets/images/partners/space_copy_white.png';
import Enduralock from '../../../assets/images/partners/Enduralock.png';
import SophiaSpace from '../../../assets/images/partners/Sophia_Space.png';

// The design runs a "WORKING WITH" logo row immediately under the hero's accent
// divider. Logos come from the repo's existing partner assets rather than the
// Figma, since the design's row is a flattened screenshot.

const PARTNERS = [
  { src: Starcloud, name: 'Starcloud' },
  { src: WilsonSonsini, name: 'Wilson Sonsini' },
  { src: Matrix, name: 'Matrix' },
  { src: SpaceOcean, name: 'Space Ocean' },
  { src: Nvidia, name: 'NVIDIA Inception' },
  { src: OrbitFab, name: 'Orbit Fab' },
  { src: OrbitalComposites, name: 'Orbital Composites' },
  { src: SpaceCopy, name: 'Space Copy' },
  { src: Enduralock, name: 'Enduralock' },
  { src: SophiaSpace, name: 'Sophia Space' },
];

const PartnerStrip = () => (
  <section className="bg-orb-bg px-6 py-16 md:px-10"
      data-figma="145:47"
      data-figma-name="Partner strip"
    >
    <div className="mx-auto max-w-[1362px]">
      <p className="font-plex text-orb-label uppercase tracking-[0.22em] text-orb-text-4">
        WORKING WITH
      </p>

      <Marquee className="mt-10" pauseOnHover>
        {PARTNERS.map((p) => (
          <img
            key={p.name}
            src={p.src}
            alt={p.name}
            // Mixed-provenance logos: grayscale + reduced opacity keeps the row
            // even without hand-matching each asset's background.
            className="mx-8 h-8 w-auto max-w-[150px] shrink-0 object-contain opacity-60 grayscale"
            loading="lazy"
          />
        ))}
      </Marquee>
    </div>
  </section>
);

export default PartnerStrip;
