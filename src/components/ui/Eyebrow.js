import React from 'react';

// Section kicker: mono uppercase tracked label. Defaults to the signal accent.
const tones = {
  signal: 'text-primary',
  ember: 'text-ember',
  muted: 'text-text-muted',
};

const Eyebrow = ({ as: Tag = 'div', tone = 'signal', className = '', children }) => (
  <Tag className={`font-mono text-eyebrow uppercase ${tones[tone] || tones.signal} ${className}`}>
    {children}
  </Tag>
);

export default Eyebrow;
