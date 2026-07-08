import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader, CornerBrackets } from '../ui';
import { ease } from '../../utils/motionTokens';
import { hardwareProducts } from '../../data/productsData';

// Qualitative spec chips only — no figures until the founder supplies real
// numbers (copy rule: never invent specs).
const VARIANT_CHIPS = {
  'ORA-Astrosfera': ['7 DOF', 'RADIATION-TOLERANT', 'MISSION-CUSTOMIZABLE'],
  'ORA-Mini': ['7 DOF', 'FITS 24U / 27U CUBESAT', 'SINGLE OR DUAL ARM'],
  'ORA-Giga': ['7 DOF', 'HEAVY-LIFT', 'STATION SERVICING'],
};

const FamilyExplorer = () => {
  const arms = hardwareProducts.find((p) => p.id === 'robotic-arms');
  const variants = arms?.variants || [];
  const [active, setActive] = useState(0);
  const variant = variants[active];

  if (!variant) return null;

  return (
    <section className="py-24 bg-surface border-y hairline">
      <div className="container mx-auto px-6">
        <SectionHeader
          index="003"
          label="THE FAMILY"
          title="One architecture. Three arms."
          lede="Every ORA arm shares the same control software, perception stack, and joint architecture — sized for the mission."
          className="mb-12"
        />

        {/* Tabs */}
        <div role="tablist" aria-label="ORA variants" className="inline-flex border hairline mb-10">
          {variants.map((v, i) => (
            <button
              key={v.name}
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`relative type-mono-label px-5 py-3 transition-colors ${
                active === i ? 'text-white' : 'text-text-muted hover:text-white'
              }`}
            >
              {active === i && (
                <motion.div
                  layoutId="family-tab"
                  className="absolute inset-0 bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{v.name}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          {/* Render plate */}
          <div className="relative border hairline bg-[#010101] min-h-[320px] flex items-center justify-center p-10">
            <AnimatePresence mode="wait">
              <motion.img
                key={variant.name}
                src={variant.image}
                alt={variant.name}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.35, ease: ease.standard }}
                className="max-h-72 w-auto object-contain"
              />
            </AnimatePresence>
            <CornerBrackets />
            <span className="absolute bottom-3 left-3 type-mono-label text-text-faint">
              {variant.name.toUpperCase()} — RENDER
            </span>
          </div>

          {/* Dossier */}
          <div className="flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={variant.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: ease.standard }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="type-display text-h3 text-white">{variant.name}</h3>
                  <span className="type-mono-label text-ember border border-ember/40 bg-ember-subtle px-2 py-1">
                    {variant.badge.toUpperCase()}
                  </span>
                </div>
                <p className="text-text-secondary leading-relaxed mb-6 max-w-xl">{variant.description}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {(VARIANT_CHIPS[variant.name] || []).map((chip) => (
                    <span key={chip} className="type-mono-label text-text-secondary border hairline px-3 py-1.5">
                      {chip}
                    </span>
                  ))}
                </div>
                <Link to="/products/robotic-arms" className="type-mono-label text-accent hover:text-white transition-colors">
                  OPEN DOSSIER →
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FamilyExplorer;
