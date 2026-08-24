import React from 'react';
import LogoWhite from '../../assets/images/logo_white.png';

// The only logo asset available is the full wordmark (2085x564, white on
// transparent), but the design pairs a *mark* with live text. Figma solves this
// by cropping: a 53x41 window with the wordmark scaled to 477.42% x 166.81% and
// pinned left, which lands exactly on the circular mark and clips the lettering.
// Reproduced here as percentages so it holds at any size.
//
// Replace with a mark-only export and this whole crop can collapse to one <img>.

const LogoMark = ({ className = '' }) => (
  <span
    aria-hidden
    className={`relative block h-[41px] w-[53px] shrink-0 overflow-hidden ${className}`}
  >
    <img
      src={LogoWhite}
      alt=""
      className="absolute left-0 top-0 h-[166.81%] w-[477.42%] max-w-none object-contain object-left"
    />
  </span>
);

export default LogoMark;
