import React, { useCallback } from 'react';
import SEO from '../components/SEO';
import HeroCapture from '../components/home/HeroCapture';
import HeritageStrip from '../components/home/HeritageStrip';
import CatchComparator from '../components/home/CatchComparator';
import SystemRows from '../components/home/SystemRows';
import FamilyExplorer from '../components/home/FamilyExplorer';
import MissionsManifest from '../components/home/MissionsManifest';
import HubbleSequence from '../components/home/HubbleSequence';
import MissionLog from '../components/home/MissionLog';
import FirstContact from '../components/home/FirstContact';

// Numbered engineering-doc sections:
// 000 HERO · 001 HERITAGE · 002 THE CATCH · 003 THE FAMILY · 004 THE SYSTEM ·
// 005 MISSIONS MANIFEST · 006 TARGET: HUBBLE · 007 MISSION LOG · 008 FIRST CONTACT
const Home = () => {
  const scrollToSystem = useCallback(() => {
    document.getElementById('system')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="flex flex-col -mt-[var(--header-height)]">
      <SEO
        title="Home"
        description="Orbital Robotics builds autonomous robotic arms that rendezvous with, capture, and service spacecraft in orbit — with NavIQ perception, ASTRA-P guidance, and the ORBtos flight OS."
      />
      <HeroCapture onSeeSystem={scrollToSystem} />
      <HeritageStrip />
      <CatchComparator />
      <FamilyExplorer />
      <SystemRows />
      <MissionsManifest />
      <HubbleSequence />
      <MissionLog />
      <FirstContact />
    </div>
  );
};

export default Home;
