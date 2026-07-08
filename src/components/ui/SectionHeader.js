import React from 'react';
import { motion } from 'framer-motion';
import { ease, duration } from '../../utils/motionTokens';

// Numbered engineering-doc section header: hairline rule carrying a mono
// index (`003 / THE SYSTEM`), then optional display title + lede.
const SectionHeader = ({ index, label, title, lede, className = '' }) => (
  <div className={className}>
    <div className="flex items-center gap-4 mb-8">
      <span className="type-mono-label text-text-faint shrink-0">{index}</span>
      <span className="type-mono-label text-primary shrink-0">{label}</span>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: duration.slow, ease: ease.standard }}
        className="h-px flex-1 bg-white/[0.08] origin-left"
      />
    </div>
    {title && (
      <h2 className="type-display text-h2 text-white mb-4">{title}</h2>
    )}
    {lede && <p className="text-text-secondary text-lg max-w-3xl leading-relaxed">{lede}</p>}
  </div>
);

export default SectionHeader;
