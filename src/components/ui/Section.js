import React from 'react';

// Standardized section: consistent vertical rhythm, background tier, optional
// mesh overlay, and an id for in-page anchor navigation.
const backgrounds = {
  background: 'bg-background',
  surface: 'bg-surface',
  none: '',
};

const Section = ({
  id,
  bg = 'background',
  mesh = false,
  container = true,
  className = '',
  innerClassName = '',
  children,
}) => (
  <section id={id} className={`relative py-20 ${backgrounds[bg] ?? ''} ${className}`}>
    {mesh && <div className="absolute inset-0 bg-mesh-gradient opacity-40 pointer-events-none" />}
    {container ? (
      <div className={`container mx-auto px-6 relative z-10 ${innerClassName}`}>{children}</div>
    ) : (
      children
    )}
  </section>
);

export default Section;
