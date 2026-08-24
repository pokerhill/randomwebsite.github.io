import React from 'react';
import Noise from '../../assets/orb/dither-noise.png';

// Breaks up banding in the page's long dark gradients.
//
// orb-band ramps #161616 to #000 — 22 luminance levels — over 684px, and
// orb-cta does something similar. At 8 bits that quantises into ~22 flat
// horizontal bands, measured at 31 device px each on a 1x display. macOS and
// retina hide it; a 1x monitor renders it as visible grey blotching, which is
// what it looked like around the arm renders.
//
// A tiled 2-level noise texture at very low opacity jitters pixels across each
// quantisation boundary, so the steps dissolve. Amplitude is far below the
// threshold where grain itself is visible — the tile is 64px, well under the
// band height it is dissolving.
const Dither = ({ className = '' }) => (
  <div
    aria-hidden
    className={`pointer-events-none absolute inset-0 opacity-[0.035] ${className}`}
    style={{ backgroundImage: `url(${Noise})`, backgroundRepeat: 'repeat', backgroundSize: '64px 64px' }}
  />
);

export default Dither;
