import React from 'react';

// HUD corner brackets: four 12px L-corners, signal blue at 60%, 1.5px stroke.
// Overlay for media frames and key panels. pointer-events-none so it never
// intercepts interaction.
const corner = 'absolute w-3 h-3 border-accent/60';

const CornerBrackets = ({ className = '', inset = 'inset-2' }) => (
  <div className={`absolute ${inset} pointer-events-none ${className}`} aria-hidden>
    <span className={`${corner} top-0 left-0 border-t-[1.5px] border-l-[1.5px]`} />
    <span className={`${corner} top-0 right-0 border-t-[1.5px] border-r-[1.5px]`} />
    <span className={`${corner} bottom-0 left-0 border-b-[1.5px] border-l-[1.5px]`} />
    <span className={`${corner} bottom-0 right-0 border-b-[1.5px] border-r-[1.5px]`} />
  </div>
);

export default CornerBrackets;
