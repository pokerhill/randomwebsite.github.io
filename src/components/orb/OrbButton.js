import React from 'react';
import { Link } from 'react-router-dom';

// The design's only button. Hairlines on the left and right edges only — no top
// or bottom border — and on hover the whole face fills solid white with the
// label flipping to the page background. Both states come from the Figma
// "Hover States" frame (385:394).
//
// `variant="solid"` renders the hover state as the resting state, for use on
// top of imagery where a hairline would disappear.

const BASE =
  'inline-flex items-center justify-center px-6 py-3 font-sohne font-medium text-orb-btn ' +
  'uppercase whitespace-nowrap transition-colors duration-200 ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orb-accent';

const VARIANTS = {
  hairline:
    'border-x border-orb-btn-border text-orb-text hover:bg-white hover:text-orb-bg hover:border-white',
  solid: 'bg-white text-orb-bg hover:bg-orb-text-2',
};

const OrbButton = ({
  children,
  href,
  to,
  variant = 'hairline',
  className = '',
  ...rest
}) => {
  const classes = `${BASE} ${VARIANTS[variant] || VARIANTS.hairline} ${className}`;

  // Internal route, external link, or plain button — the caller picks by prop.
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    const external = /^https?:|^mailto:/.test(href);
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
};

export default OrbButton;
