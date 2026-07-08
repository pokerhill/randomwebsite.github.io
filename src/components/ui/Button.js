import React from 'react';
import { Link } from 'react-router-dom';

// Polymorphic button: renders a router <Link> (to), an <a> (href), or a <button>.
// Instrument register: rectangular (2px radius), mono uppercase label, hover
// BRIGHTENS (instruments brighten, they don't darken).
const base =
  'inline-flex items-center justify-center gap-2 font-mono uppercase tracking-[0.12em] rounded-instrument transition-colors duration-200 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4C9DF0] ' +
  'disabled:opacity-60 disabled:cursor-not-allowed';

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'bg-white/[0.06] text-white border hairline hover:border-white/[0.16] hover:bg-white/[0.1]',
  outline: 'border border-primary/50 text-primary hover:border-primary hover:text-accent',
  ghost: 'text-text-secondary hover:text-accent',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-sm',
};

const Spinner = () => (
  <span
    aria-hidden
    className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
  />
);

const Button = ({
  as,
  to,
  href,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const classes = `${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`;
  const content = loading ? (
    <>
      <Spinner />
      <span>Working…</span>
    </>
  ) : (
    children
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }
  const Tag = as || 'button';
  return (
    <Tag className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {content}
    </Tag>
  );
};

export default Button;
