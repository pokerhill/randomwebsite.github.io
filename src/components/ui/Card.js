import React from 'react';

// Unified surface card. `glass` = translucent + blur (over imagery / mesh),
// `solid` = opaque surface tier. Default radius is the tighter rounded-xl.
const variants = {
  solid: 'bg-surface border border-white/[0.08]',
  glass: 'bg-background/50 backdrop-blur-sm border border-white/[0.08]',
};

const Card = ({ variant = 'solid', hover = true, className = '', children, ...props }) => (
  <div
    className={`rounded-xl ${variants[variant] || variants.solid} ${
      hover ? 'transition-all duration-300 hover:border-primary/40' : ''
    } ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
