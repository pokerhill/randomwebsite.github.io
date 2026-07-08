import React from 'react';
import { Link } from 'react-router-dom';

// items: [{ label, to? }] — the last item is the current page (no link).
const Breadcrumb = ({ items = [], className = '' }) => (
  <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
    <ol className="flex items-center gap-2 flex-wrap text-text-muted">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <li key={i} className="flex items-center gap-2">
            {item.to && !isLast ? (
              <Link to={item.to} state={item.state} className="hover:text-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-text-secondary' : ''} aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            )}
            {!isLast && <span className="text-text-faint">/</span>}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default Breadcrumb;
