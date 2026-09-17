import React from 'react';

// The 6px accent rule the design uses between major sections: transparent at
// both edges, full #3B45F5 at 48.6%. In Figma it is 1445px wide inside a 1440px
// frame, bleeding 5px past each edge — reproduced here by letting it span the
// full width with the gradient's own falloff doing the fade.

const DividerGlow = ({ className = '' }) => (
  <div
    aria-hidden
    className={`h-[6px] w-full shrink-0 bg-orb-divider ${className}`}
  />
);

export default DividerGlow;
