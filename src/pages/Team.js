import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedinIn, FaEnvelope } from 'react-icons/fa';
import SEO from '../components/SEO';
import AnimatedSection from '../components/motion/AnimatedSection';
import StaggerContainer, { itemVariants } from '../components/motion/StaggerContainer';
import { Eyebrow, Badge } from '../components/ui';

// Import images
import AaronImg from '../assets/images/headshots/aaron.png';
import SohilImg from '../assets/images/headshots/sohil.png';
import RileyImg from '../assets/images/headshots/riley.jpg';
import DougImg from '../assets/images/headshots/Doug.jpg';
import GordonImg from '../assets/images/headshots/Gordon-dp.jpg';
import EricFeltImg from '../assets/images/headshots/EricFelt.jpg';
import ChrisImg from '../assets/images/headshots/Christopher_Sembroski.jpg';
import TolgaImg from '../assets/images/headshots/Tolga_Ors.jpeg';
import TaylorImg from '../assets/images/headshots/TaylorBanks.jpeg';
import WillImg from '../assets/images/headshots/will.jpg';

const SocialLinks = ({ name, linkedin, email }) => (
  <div className="flex gap-3">
    <a
      href={linkedin}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name} on LinkedIn`}
      className="inline-flex items-center justify-center w-9 h-9 border hairline hover:border-white/[0.16] hover:text-white text-text-secondary transition-all"
    >
      <FaLinkedinIn />
    </a>
    {email && (
      <a
        href={`mailto:${email}`}
        aria-label={`Email ${name}`}
        className="inline-flex items-center justify-center w-9 h-9 border hairline hover:border-white/[0.16] hover:text-white text-text-secondary transition-all"
      >
        <FaEnvelope />
      </a>
    )}
  </div>
);

// Consistent CSS treatment unifies the mixed-source headshots (varied
// backgrounds/lighting): consistent crop + grayscale that resolves to color on
// hover. (Re-shooting/duotone-processing the source files is deferred media work.)
const CredentialChips = ({ items }) =>
  items && items.length ? (
    <div className="flex flex-wrap gap-1.5 mb-4">
      {items.map((c) => (
        <Badge key={c} variant="ember">
          {c}
        </Badge>
      ))}
    </div>
  ) : null;

const FounderCard = ({ name, role, image, bio, credentials, linkedin, email }) => (
  <motion.div
    variants={itemVariants}
    className="group bg-surface rounded-panel border hairline hover:border-white/[0.16] transition-all overflow-hidden flex flex-col sm:flex-row"
  >
    <div className="sm:w-44 shrink-0 aspect-[4/5] sm:aspect-auto bg-neutral-900 overflow-hidden">
      <img
        src={image}
        alt={`${name}, ${role}`}
        loading="lazy"
        className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
      />
    </div>
    <div className="p-6 flex flex-col flex-1">
      <h3 className="text-xl font-bold text-white">{name}</h3>
      <p className="type-mono-label text-primary mt-1 mb-3">{role}</p>
      <CredentialChips items={credentials} />
      <p className="text-text-secondary text-sm leading-relaxed mb-5 flex-1">{bio}</p>
      <SocialLinks name={name} linkedin={linkedin} email={email} />
    </div>
  </motion.div>
);

const AdvisorCard = ({ name, role, image, bio, credentials, linkedin, email }) => (
  <motion.div
    variants={itemVariants}
    className="group bg-surface rounded-panel border hairline hover:border-white/[0.16] transition-all p-6 flex flex-col"
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="w-16 h-16 shrink-0 rounded-instrument overflow-hidden bg-neutral-900">
        <img
          src={image}
          alt={`${name}, ${role}`}
          loading="lazy"
          className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
        />
      </div>
      <div>
        <h3 className="text-base font-bold text-white leading-tight">{name}</h3>
        <p className="type-mono-label text-primary mt-1">{role}</p>
      </div>
    </div>
    <CredentialChips items={credentials} />
    <p className="text-text-secondary text-sm leading-relaxed mb-5 flex-1">{bio}</p>
    <SocialLinks name={name} linkedin={linkedin} email={email} />
  </motion.div>
);

const Team = () => {
  const team = [
    {
      name: 'Aaron (Cyborg) Borger',
      role: 'Co-Founder & CEO',
      image: AaronImg,
      credentials: ['Ex–Blue Origin', 'BE-7 Lead', 'PhD', 'Patent Pending'],
      bio: "Leads AI and robotics for autonomous satellite servicing. Formerly lead software engineer for Blue Origin's BE-7 lunar lander engine, where he managed 25 engineers. PhD researcher in aerospace dynamics & controls for the Space Force's SSTI-2 satellite servicing program, with a provisional patent in autonomous satellite servicing.",
      linkedin: 'https://www.linkedin.com/in/aaron-borger/',
      email: 'aborger@orbital-robots.com',
    },
    {
      name: 'Riley Mark',
      role: 'Co-Founder & Lead Hardware Engineer',
      image: RileyImg,
      credentials: ['Secret Clearance', 'NASA Payloads', 'MDA'],
      bio: 'Leads hardware across robotic arms, flight electronics, and sensor payloads for on-orbit servicing. Previously led electrical integration and flight software of a flight-qualified optical sensor payload for Missile Defense Agency missions. Has flown multiple NASA sub-orbital payloads demonstrating robotic capture with dual 7-axis arms; holds an active U.S. Secret Clearance.',
      linkedin: 'https://www.linkedin.com/in/riley-mark/',
      email: 'rmark@orbital-robots.com',
    },
    {
      name: 'Sohil Pokharna',
      role: 'Co-Founder & Lead Software Engineer',
      image: SohilImg,
      credentials: ['Ex–Blue Origin', 'AI Lead'],
      bio: "Leads flight software, robotic arm control, and the AI/ML systems behind Orbital Robotics' autonomous in-space operations. Previously the single-threaded leader for AI within Engine Avionics Software at Blue Origin, building diagnostics, test automation, and data analysis across rocket engine programs.",
      linkedin: 'https://www.linkedin.com/in/sohil-pokharna/',
      email: 'spokharna@orbital-robots.com',
    },
    {
      name: 'William Liu',
      role: 'Chief of Staff',
      image: WillImg,
      credentials: ['Operations', 'Strategy'],
      bio: 'Experienced in operations and strategy across fintech and small-team startups. William has launched multiple products and automated workflows with a data-heavy, people-first approach.',
      linkedin: 'https://www.linkedin.com/in/liu-william/',
      email: 'wliu@orbital-robots.com',
    },
  ];

  const advisors = [
    {
      name: 'Dr. Gordon Roesler',
      role: 'Advisor',
      image: GordonImg,
      credentials: ['Ex–DARPA', 'RSGS PM'],
      bio: 'Former DARPA Program Manager for the Robotic Servicing of Geosynchronous Satellites (RSGS) program and founder of Robots in Space LLC. Two decades advancing in-orbit servicing and autonomy across government, academia, and industry.',
      linkedin: 'https://www.linkedin.com/in/gordon-roesler-8b0a646/',
    },
    {
      name: 'Doug Kohl',
      role: 'Advisor',
      image: DougImg,
      credentials: ['NASA', 'Blue Origin', '40+ yrs'],
      bio: 'Aerospace operations veteran with 40+ years of experience (Space Shuttle to lunar systems). Led mission-critical operations for NASA and Blue Origin, specializing in human-rated spacecraft recovery and readiness.',
      linkedin: 'https://www.linkedin.com/in/doug-kohl-865553b/',
    },
    {
      name: 'Eric Felt',
      role: 'Advisor',
      image: EricFeltImg,
      credentials: ['Ex–AFRL Director'],
      bio: 'Former Director of the U.S. Air Force Research Laboratory (AFRL), where he led R&D advancing national security and space technology into mission-ready capabilities.',
      linkedin: 'https://www.linkedin.com/in/eric-felt/',
    },
    {
      name: 'Christopher Sembroski',
      role: 'Advisor',
      image: ChrisImg,
      credentials: ['Astronaut', 'Inspiration4'],
      bio: "Commercial astronaut and mission specialist on SpaceX's Inspiration4, the first all-civilian orbital mission. Former Blue Origin avionics engineer and adjunct faculty at Embry-Riddle Aeronautical University.",
      linkedin: 'https://www.linkedin.com/in/chris-sembroski/',
    },
    {
      name: 'Tolga Ors',
      role: 'Advisor',
      image: TolgaImg,
      credentials: ['Satcom', 'PhD'],
      bio: 'Space systems strategist with 25+ years in satellite communications, AI, and robotics across Intelsat, Inmarsat, OneWeb, and AST SpaceMobile. PhD in Satellite Communications, University of Surrey.',
      linkedin: 'https://www.linkedin.com/in/tolgaors/',
    },
    {
      name: 'Taylor Banks',
      role: 'Advisor',
      image: TaylorImg,
      credentials: ['Ex–Blue Origin', 'CFO'],
      bio: 'Aerospace finance and accounting executive. Former CFO of Systima, leading its acquisition by Karman Space & Defense. Former Blue Origin finance and financial advisor for Relativity Space.',
      linkedin: 'https://www.linkedin.com/in/taylor-banks/',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <SEO
        title="Crew"
        description="Meet the Orbital Robotics team — engineers from Blue Origin and SpaceX building the future of autonomous in-space servicing, alongside an advisory board of astronauts and space-systems leaders."
      />
      <div className="container mx-auto px-6">
        <AnimatedSection className="max-w-3xl mb-16 pt-10">
          <Eyebrow className="mb-4">CREW</Eyebrow>
          <h1 className="type-display text-h1 text-white mb-5">Built by people who've flown hardware.</h1>
          <p className="text-xl text-text-secondary">
            Founded by Blue Origin and SpaceX engineers who have flown robotic-capture payloads and built flight
            software for lunar landers — advised by astronauts and space-systems leaders.
          </p>
        </AnimatedSection>

        {/* Founders & Leadership */}
        <div className="mb-24">
          <AnimatedSection>
            <h2 className="type-display text-h3 text-white mb-8 pb-4 border-b hairline">Founders &amp; Leadership</h2>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {team.map((member, index) => (
              <FounderCard key={index} {...member} />
            ))}
          </StaggerContainer>
        </div>

        {/* Advisors & Board */}
        <div>
          <AnimatedSection>
            <h2 className="type-display text-h3 text-white mb-8 pb-4 border-b hairline">Advisors &amp; Board</h2>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advisors.map((advisor, index) => (
              <AdvisorCard key={index} {...advisor} />
            ))}
          </StaggerContainer>
        </div>
      </div>
    </div>
  );
};

export default Team;
