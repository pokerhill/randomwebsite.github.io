import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { SmartVideo } from '../ui';
import HubbleCapture from '../../assets/video/hubble_capture_compressed.mp4';

const PHASES = ['ACQUIRE', 'TRACK', 'APPROACH', 'HARD CAPTURE'];

// Pinned sequence: the Hubble capture sim plays under sticky mono mission-log
// captions that advance with scroll. Never scrubs video currentTime.
const HubbleSequence = () => {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => setProgress(v));

  const phase = Math.min(PHASES.length - 1, Math.floor(progress * PHASES.length));
  const endCard = progress > 0.82;

  return (
    <section ref={ref} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden">
        <SmartVideo
          src={HubbleCapture}
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />

        {/* Section tag */}
        <div className="absolute left-6 top-[calc(var(--header-height)+1rem)]">
          <span className="type-mono-label text-text-muted bg-black/50 px-3 py-2 inline-flex gap-3">
            <span className="text-text-faint">006</span>
            <span className="text-primary">TARGET: HUBBLE</span>
            <span className="text-text-faint">/ SIMULATION</span>
          </span>
        </div>

        {/* Phase captions */}
        <div className="absolute left-6 bottom-12 space-y-2">
          {PHASES.map((p, i) => (
            <div
              key={p}
              className={`type-mono-label transition-colors duration-300 ${
                i === phase
                  ? p === 'HARD CAPTURE'
                    ? 'text-ember'
                    : 'text-accent'
                  : i < phase
                    ? 'text-text-muted'
                    : 'text-text-faint/50'
              }`}
            >
              {String(i + 1).padStart(2, '0')} {p}
              {i === phase && <span className="inline-block w-1.5 h-3 bg-current ml-2 animate-cursor-blink align-middle" />}
            </div>
          ))}
        </div>

        {/* End card */}
        <motion.div
          animate={{ opacity: endCard ? 1 : 0, y: endCard ? 0 : 16 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-x-0 bottom-1/3 text-center px-6 pointer-events-none"
        >
          <p className="type-display text-h2 text-white mb-4">
            Hubble has no docking fixture.
            <br />
            That's the point.
          </p>
          <Link
            to="/news/save-hubble"
            className={`type-mono-label text-accent hover:text-white transition-colors ${endCard ? 'pointer-events-auto' : ''}`}
          >
            THE SAVE HUBBLE COALITION →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HubbleSequence;
