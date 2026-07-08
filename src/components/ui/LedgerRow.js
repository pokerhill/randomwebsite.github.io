import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Manifest/ledger row: mono id/date column, main label, trailing status or
// arrow. Rows, not cards — the instrument register for lists.
const Inner = ({ id, label, sublabel, trailing }) => (
  <>
    <span className="type-mono-label text-text-faint w-32 shrink-0">{id}</span>
    <span className="flex-1 min-w-0">
      <span className="block text-white font-medium truncate group-hover:text-accent transition-colors">{label}</span>
      {sublabel && <span className="block text-text-muted text-sm mt-0.5">{sublabel}</span>}
    </span>
    {trailing && <span className="shrink-0 ml-4">{trailing}</span>}
  </>
);

const rowClass =
  'group flex items-center gap-4 py-4 border-b hairline hover:border-white/[0.16] transition-colors';

const LedgerRow = ({ id, label, sublabel, trailing, to, href, className = '' }) => {
  const content = <Inner id={id} label={label} sublabel={sublabel} trailing={trailing} />;
  const cls = `${rowClass} ${className}`;
  if (to) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <Link to={to} className={cls}>{content}</Link>
      </motion.div>
    );
  }
  if (href) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{content}</a>
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cls}
    >
      {content}
    </motion.div>
  );
};

export default LedgerRow;
