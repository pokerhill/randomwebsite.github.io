import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SectionHeader, FigureFrame, SmartVideo } from '../ui';
import { ease, duration } from '../../utils/motionTokens';
import OrbtosConsole from '../OrbtosConsole';
import DualArmVideo from '../../assets/video/dual_arm_ik_obj_grasp.mp4';
import SegmentationVideo from '../../assets/video/in_space_segmentation_compressed.mp4';
import MonteCarloGif from '../../assets/video/monte_carlo_satellite_control.gif';

// The Figure-AI arc mapped to our stack: hardware that captures → perception
// that sees → control that decides → the OS that operates.
const rows = [
  {
    index: '01',
    verb: 'ACTUATE',
    name: 'ORA ARM FAMILY',
    to: '/products/robotic-arms',
    sentence:
      'Three 7-DOF flight arms — Astrosfera, Mini, and Giga — sharing one architecture and one control stack, sized from CubeSat to station-class missions.',
    outcome: '7 DOF × 2 ARMS — COORDINATED GRASP',
    media: { type: 'video', src: DualArmVideo, fig: '03', title: 'DUAL-ARM IK OBJECT GRASP' },
  },
  {
    index: '02',
    verb: 'PERCEIVE',
    name: 'NAVIQ',
    to: '/products/naviq',
    sentence:
      'Real-time position, orientation, and motion estimates of non-cooperative objects from stereo vision alone.',
    outcome: 'NO CAD MODELS · NO MARKERS · STEREO ONLY',
    media: { type: 'video', src: SegmentationVideo, fig: '04', title: 'NAVIQ SEGMENTATION', meta: 'SIMULATED ORBITAL IMAGERY' },
  },
  {
    index: '03',
    verb: 'DECIDE',
    name: 'ASTRA-P',
    to: '/products/astrap',
    sentence:
      'Takes NavIQ’s state estimate and plans the approach and capture maneuver, validated across thousands of randomized scenarios.',
    outcome: 'STABILITY: LYAPUNOV-VERIFIED',
    media: { type: 'image', src: MonteCarloGif, fig: '05', title: 'MONTE CARLO CONTROL RUNS' },
  },
  {
    index: '04',
    verb: 'OPERATE',
    name: 'ORBTOS',
    to: '/products/satellite-os',
    sentence:
      'The flight operating system that hosts NavIQ and ASTRA-P as native modules on any spacecraft bus.',
    outcome: 'BUS-AGNOSTIC · MODULAR · STACK-NATIVE',
    media: { type: 'console' },
  },
];

const SystemRow = ({ row, flip }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: duration.base, ease: ease.standard }}
    className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-14 border-b hairline"
  >
    <div className={flip ? 'lg:order-2' : ''}>
      <div className="flex items-baseline gap-4 mb-4">
        <span className="type-mono-label text-text-faint">{row.index}</span>
        <span className="type-mono-label text-primary">{row.verb}</span>
      </div>
      <h3 className="type-display text-h3 text-white mb-4">{row.name}</h3>
      <p className="text-text-secondary leading-relaxed max-w-xl mb-5">{row.sentence}</p>
      <div className="type-mono-label text-ember mb-7">{row.outcome}</div>
      <Link to={row.to} className="type-mono-label text-accent hover:text-white transition-colors">
        OPEN DOSSIER →
      </Link>
    </div>
    <div className={flip ? 'lg:order-1' : ''}>
      {row.media.type === 'console' ? (
        <OrbtosConsole />
      ) : (
        <FigureFrame
          index={row.media.fig}
          title={row.media.title}
          provenance="SIMULATION"
          meta={row.media.meta}
          frameClassName="aspect-video"
        >
          {row.media.type === 'video' ? (
            <SmartVideo src={row.media.src} preload="none" className="w-full h-full object-cover" />
          ) : (
            <img src={row.media.src} alt={row.media.title} loading="lazy" className="w-full h-full object-cover" />
          )}
        </FigureFrame>
      )}
    </div>
  </motion.div>
);

const SystemRows = () => (
  <section id="system" className="py-24 bg-background">
    <div className="container mx-auto px-6">
      <SectionHeader
        index="004"
        label="THE SYSTEM"
        title="One closed loop."
        lede="Capture is a system problem. Each layer of the stack is a product; together they close the loop from photons to grasp."
        className="mb-4"
      />
      {rows.map((row, i) => (
        <SystemRow key={row.index} row={row} flip={i % 2 === 1} />
      ))}
    </div>
  </section>
);

export default SystemRows;
