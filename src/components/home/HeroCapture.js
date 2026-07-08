import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui';
import { ease, duration } from '../../utils/motionTokens';
import SimCatch from '../../assets/video/ar3_catch.mp4';
import NavIQCatch from '../../assets/video/ai_view_ar3_catch.mp4';

// Timecode (seconds) where the arm secures the object in ar3_catch.mp4.
// Tune to the exact catch frame.
const CATCH_TIME = 5.0;

const specStrip = [
  '7 DOF',
  'LYAPUNOV-VERIFIED CONTROL',
  '1000s OF MONTE CARLO RUNS',
  'FIRST COMMERCIAL CONTRACT SIGNED',
  'RPOC Q4 2026',
];

// Instruments power on: flicker, then hold.
const flickerIn = {
  hidden: { opacity: 0 },
  visible: (i) => ({
    opacity: [0, 1, 0.35, 1],
    transition: { delay: 0.9 + i * 0.12, duration: 0.5, times: [0, 0.3, 0.6, 1] },
  }),
};

const HeroCapture = ({ onSeeSystem }) => {
  const [view, setView] = useState('sim');
  const [captured, setCaptured] = useState(false);
  const simRef = useRef(null);
  const navRef = useRef(null);

  const handleTime = (e) => setCaptured(e.target.currentTime >= CATCH_TIME);

  const handleToggle = (next) => {
    if (next === view) return;
    setView(next);
    const from = next === 'sim' ? navRef.current : simRef.current;
    const to = next === 'sim' ? simRef.current : navRef.current;
    if (from && to) {
      to.currentTime = from.currentTime;
      to.play().catch(() => {});
    }
  };

  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden bg-black">
      {/* Feeds */}
      <motion.video
        ref={simRef}
        src={SimCatch}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        onTimeUpdate={view === 'sim' ? handleTime : undefined}
        animate={{ opacity: view === 'sim' ? 1 : 0 }}
        transition={{ duration: 0.5, ease: ease.smooth }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <motion.video
        ref={navRef}
        src={NavIQCatch}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        onTimeUpdate={view === 'naviq' ? handleTime : undefined}
        animate={{ opacity: view === 'naviq' ? 1 : 0 }}
        transition={{ duration: 0.5, ease: ease.smooth }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-black/40 pointer-events-none" />

      {/* HUD status — flips at the catch frame, every loop */}
      <div className="absolute left-6 top-[calc(var(--header-height)+1rem)] z-10">
        <span
          className={`type-mono-label inline-flex items-center gap-2 border px-3 py-2 transition-colors duration-200 ${
            captured
              ? 'text-ember border-ember/60 bg-ember-subtle'
              : 'text-accent border-accent/40 bg-black/40'
          }`}
        >
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full ${captured ? 'bg-ember' : 'bg-accent'}`}
          />
          {captured ? 'CAPTURE CONFIRMED' : 'TRACKING'}
        </span>
      </div>

      {/* SIM | NAVIQ feed toggle */}
      <div className="absolute right-6 top-[calc(var(--header-height)+1rem)] z-10">
        <div
          role="tablist"
          aria-label="Video feed"
          className="inline-flex border hairline bg-black/50 backdrop-blur-sm"
        >
          {[
            { key: 'sim', label: 'SIM' },
            { key: 'naviq', label: 'NAVIQ' },
          ].map((opt) => (
            <button
              key={opt.key}
              role="tab"
              aria-selected={view === opt.key}
              onClick={() => handleToggle(opt.key)}
              className={`type-mono-label px-4 py-2 transition-colors ${
                view === opt.key ? 'bg-primary text-white' : 'text-text-secondary hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Copy block — lower-left third, never centered */}
      <div className="absolute inset-x-0 bottom-24 md:bottom-28 z-10">
        <div className="container mx-auto px-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration.base, delay: 0.2 }}
            className="type-mono-label text-accent mb-5"
          >
            AR-3 FREE-FLY CAPTURE — PHYSICS SIMULATION — ASTRA-P + NAVIQ IN THE LOOP
          </motion.p>
          <h1 className="type-display text-display text-white max-w-5xl mb-6 overflow-hidden">
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: ease.standard }}
              className="block"
            >
              Built to catch spacecraft.
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, delay: 0.6, ease: ease.standard }}
            className="text-lg md:text-xl text-text-secondary max-w-2xl mb-8"
          >
            Autonomous robotic arms that rendezvous with, capture, and service spacecraft in
            orbit. Every maneuver you're watching was computed by our flight software.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, delay: 0.75, ease: ease.standard }}
            className="flex flex-wrap items-center gap-4"
          >
            <Button to="/contact" size="md">
              Book a capture demo
            </Button>
            <Button as="button" variant="secondary" size="md" onClick={onSeeSystem}>
              See the system
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Spec strip */}
      <div className="absolute inset-x-0 bottom-0 z-10 border-t hairline bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex flex-wrap gap-x-8 gap-y-2">
          {specStrip.map((item, i) => (
            <motion.span
              key={item}
              custom={i}
              variants={flickerIn}
              initial="hidden"
              animate="visible"
              className="type-mono-label text-text-muted"
            >
              {item}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCapture;
