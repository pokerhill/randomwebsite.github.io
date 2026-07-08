import React from 'react';
import CornerBrackets from './CornerBrackets';

// Engineering-document media frame. Every piece of media on the site sits in
// one of these, and the caption ALWAYS carries provenance. Allowed provenance
// values: SIMULATION · SIMULATION — FLIGHT SOFTWARE IN THE LOOP ·
// GROUND TEST — REAL FOOTAGE (future) · FLIGHT (future).
const FigureFrame = ({
  index,
  title,
  provenance = 'SIMULATION',
  meta,
  brackets = true,
  className = '',
  frameClassName = '',
  children,
}) => (
  <figure className={className}>
    <div className={`relative overflow-hidden border hairline bg-black ${frameClassName}`}>
      {children}
      {brackets && <CornerBrackets />}
    </div>
    <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pt-2 border-b hairline pb-2">
      <span className="type-mono-label text-text-muted">
        {index && <span className="text-text-faint">FIG. {index} — </span>}
        {title}
      </span>
      <span className="type-mono-label text-text-faint">
        {provenance}
        {meta && <span> / {meta}</span>}
      </span>
    </figcaption>
  </figure>
);

export default FigureFrame;
