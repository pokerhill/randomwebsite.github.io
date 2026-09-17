import React, { useEffect } from 'react';
import { OrbNav, OrbFooter, OrbCtaBand, DividerGlow } from '../components/orb';
import Hero from '../components/orb/landing/Hero';
import PartnerStrip from '../components/orb/landing/PartnerStrip';
import StatStrip from '../components/orb/landing/StatStrip';
import OrbitDiagram from '../components/orb/landing/OrbitDiagram';
import RobotsInSpace from '../components/orb/landing/RobotsInSpace';
import NextFrontier from '../components/orb/landing/NextFrontier';
import Pilots from '../components/orb/landing/Pilots';
import Hardware from '../components/orb/landing/Hardware';
import SoftwareEcosystem from '../components/orb/landing/SoftwareEcosystem';
import MissionLogs from '../components/orb/landing/MissionLogs';
import prefetchNextPageHeroes from '../utils/prefetchNextPageHeroes';

// The redesigned landing page. Section order is taken from the Figma frame 54:3
// by node y-coordinate, not by eye: hero 0, partners 962,
// ROBOTS IN SPACE 1248, orbit diagram 1435, THE PILOTS 2437, founders 2831,
// stats 3792, THE NEXT FRONTIER 4241, hardware 5285, software 6675, articles 7974.
// Visuals from the design; every name and headline string from brand.js, which
// tracks the live site.

const OrbLanding = () => {
  useEffect(prefetchNextPageHeroes, []);

  return (
    <div className="min-h-screen bg-orb-bg">
      <OrbNav />
      <Hero />
      <DividerGlow />
      <PartnerStrip />
      <RobotsInSpace />
      <OrbitDiagram />
      <Pilots />
      <StatStrip />
      <NextFrontier />
      <Hardware />
      <SoftwareEcosystem />
      <MissionLogs />
      <OrbCtaBand />
      <OrbFooter />
    </div>
  );
};

export default OrbLanding;
