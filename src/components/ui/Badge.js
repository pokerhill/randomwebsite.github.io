import React from 'react';

// Status / metadata chip. `ember` is reserved for flight-heritage & status,
// `signal` for category/product tags, `success`/`warning` for availability.
const variants = {
  neutral: 'bg-white/5 text-text-secondary border-white/10',
  signal: 'bg-primary/10 text-primary border-primary/25',
  ember: 'bg-ember-subtle text-ember border-ember/30',
  success: 'bg-success/10 text-success border-success/30',
  warning: 'bg-warning/10 text-warning border-warning/30',
};

const Badge = ({ variant = 'neutral', className = '', children }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-instrument border font-mono text-micro uppercase ${
      variants[variant] || variants.neutral
    } ${className}`}
  >
    {children}
  </span>
);

export default Badge;
