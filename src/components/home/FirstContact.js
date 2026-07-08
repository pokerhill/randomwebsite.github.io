import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui';
import { daysToRpoc } from './MissionsManifest';
import { ease, duration } from '../../utils/motionTokens';

const FirstContact = () => (
  <section className="py-32 bg-background relative overflow-hidden">
    <div className="absolute inset-0 bg-hero-pattern pointer-events-none" />
    <div className="container mx-auto px-6 relative z-10">
      <div className="flex items-center gap-4 mb-10">
        <span className="type-mono-label text-text-faint">008</span>
        <span className="type-mono-label text-primary">FIRST CONTACT</span>
        <div className="h-px flex-1 bg-white/[0.08]" />
      </div>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: duration.base, ease: ease.standard }}
        className="type-display text-h1 text-white mb-8 max-w-4xl"
      >
        Have a target in orbit?
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: duration.base, delay: 0.15, ease: ease.standard }}
        className="flex flex-wrap items-center gap-4 mb-10"
      >
        <Button to="/contact" size="lg">
          Book a capture demo
        </Button>
        <Button to="/contact" variant="secondary" size="lg">
          Mission inquiries
        </Button>
        <Button to="/contact" variant="ghost" size="lg">
          Join the crew
        </Button>
      </motion.div>
      <span className="type-mono-label text-text-muted">
        T−{daysToRpoc()} DAYS TO RPOC SERVICE
      </span>
    </div>
  </section>
);

export default FirstContact;
