import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import AnimatedSection from '../components/motion/AnimatedSection';
import StaggerContainer, { itemVariants } from '../components/motion/StaggerContainer';
import { Eyebrow } from '../components/ui';
import GeekWirePreview from '../assets/images/news/geekwire_preview.png';
import GeekWire2026Preview from '../assets/images/news/geekwire_2026_preview.png';
import SpaceOceanPreview from '../assets/images/news/space_ocean_preview.png';
import YoutubePreview from '../assets/images/news/youtube_preview.png';
import UWTalkPreview from '../assets/images/news/uw_talk_preview.png';
import SpaceDirtPreview from '../assets/images/news/space_dirt_preview.png';
import StarcloudPreview from '../assets/images/partners/StarCloud_White.png';
import TechCrunchPreview from '../assets/images/news/techcrunch_original.jpg';
import AerospaceCorpPreview from '../assets/images/news/aerospace_corp_preview.png';
import CompanyLaunchTrackerPreview from '../assets/images/news/company_launch_tracker_preview.png';
import SaveHubblePreview from '../assets/images/news/save_hubble_preview.png';
import SophiaSpacePreview from '../assets/images/news/sophia_orbital_robotics_announcement.png';
import BlackFlag100Preview from '../assets/images/news/blackflag_100_preview.jpg';

// Internal hash routes ("/#/news/...") become router Links; everything else is
// an external link opened in a new tab.
const isInternal = (link) => !/^https?:\/\//.test(link);
const toInternalPath = (link) => link.replace(/^\/#/, '');

const CardShell = ({ link, className, children }) =>
  isInternal(link) ? (
    <Link to={toInternalPath(link)} className={className}>
      {children}
    </Link>
  ) : (
    <a href={link} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );

const FeaturedCard = ({ item }) => (
  <AnimatedSection className="mb-12">
    <CardShell
      link={item.link}
      className="group grid grid-cols-1 md:grid-cols-2 rounded-panel overflow-hidden border hairline bg-surface hover:border-white/[0.16] hover:shadow-elev-2 transition-all"
    >
      <div className="relative h-64 md:h-full min-h-[18rem] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-surface/80 via-transparent to-transparent" />
      </div>
      <div className="p-8 md:p-10 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-3">
          <Eyebrow tone="ember">Featured</Eyebrow>
          <span className="type-mono-label text-text-muted">{item.source}</span>
        </div>
        <h2 className="text-h3 font-heading text-white mb-4 group-hover:text-accent transition-colors">{item.title}</h2>
        <p className="text-text-secondary mb-6 line-clamp-4">{item.summary}</p>
        <span className="text-white font-medium group-hover:text-primary transition-colors inline-flex items-center gap-2">
          Read article <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </CardShell>
  </AnimatedSection>
);

const NewsCard = ({ item }) => (
  <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="h-full">
    <CardShell
      link={item.link}
      className="group h-full bg-surface rounded-panel overflow-hidden border hairline hover:border-white/[0.16] hover:shadow-elev-2 transition-all flex flex-col"
    >
      <div className="h-44 overflow-hidden relative">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <Eyebrow className="mb-2">{item.source}</Eyebrow>
        <h2 className="text-lg font-heading font-bold text-white mb-3 group-hover:text-accent transition-colors line-clamp-3">
          {item.title}
        </h2>
        <p className="text-text-secondary text-sm mb-5 flex-1 line-clamp-3">{item.summary}</p>
        <span className="text-white text-sm font-medium group-hover:text-primary transition-colors inline-flex items-center gap-2">
          Read article <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </CardShell>
  </motion.div>
);

const News = () => {
  const newsItems = [
    {
      title: 'Orbital Robotics named to the Black Flag 100 (2026)',
      summary:
        'Black Flag\'s annual ranking of the 100 early-stage deep tech companies founders are most excited about: "Orbital Robotics builds AI-powered robotic arms that autonomously capture and service spacecraft in orbit. Its deep reinforcement learning engine solves the dynamic coupling problem, positioning it at the intersection of commercial satellite growth and rising government demand for autonomous on-orbit servicing." Compiled from over 500 founder nominations across 1,500+ companies.',
      link: 'https://www.blackflag.vc/100-2#company-orbital-robotics',
      source: 'Black Flag VC',
      image: BlackFlag100Preview,
    },
    {
      title:
        'Sophia Space and Orbital Robotics Announce Exploratory Collaboration on On-Orbit AI Compute and Robotic Manufacturing Concepts',
      summary:
        'Sophia Space and Orbital Robotics announce an exploratory collaboration to combine on-orbit AI compute capabilities with robotic manufacturing, advancing the future of autonomous space infrastructure.',
      link: 'https://sophia.space/news/sophia-space-and-orbital-robotics-announce-exploratory-collaboration-on-on-orbit-ai-compute-and-robotic-manufacturing-concepts',
      source: 'Sophia Space',
      image: SophiaSpacePreview,
    },
    {
      title: '2026 Winter Robotics Colloquium: Aaron Borger (Orbital Robotics)',
      summary:
        "Aaron Borger presents 'Orbital Robotics: AI, Robotics, and Autonomy for Orbital Logistics' at the UW Paul G. Allen School of Computer Science & Engineering's Winter 2026 Robotics Colloquium.",
      link: 'https://www.youtube.com/watch?v=6QD3XKtB4xE',
      source: 'UW Paul G. Allen School (YouTube)',
      image: UWTalkPreview,
    },
    {
      title: 'Save Hubble Coalition',
      summary:
        "Join the Save Hubble Coalition - A collaborative effort to preserve one of humanity's greatest scientific achievements through innovative on-orbit servicing technology.",
      link: '/#/news/save-hubble',
      source: 'Orbital Robotics',
      image: SaveHubblePreview,
    },
    {
      title: 'Orbital Robotics reaches out with a plan for robotic arms that use AI',
      summary:
        "GeekWire covers Orbital Robotics' mission to develop AI-powered robotic arms for space. CEO Aaron Borger discusses partnerships with the U.S. Space Force and plans to service the Hubble Space Telescope.",
      link: 'https://www.geekwire.com/2026/orbital-robotics-space-robotic-arms-ai/',
      source: 'GeekWire',
      image: GeekWire2026Preview,
    },
    {
      title: 'Startup Showcase: Orbital Robotics',
      summary:
        "The Aerospace Corporation features Orbital Robotics in their startup showcase, highlighting the company's autonomous robotic arm and perception system for on-orbit refueling and repair, powered by their deep reinforcement learning algorithm.",
      link: 'https://aerospace.org/kickstage/startup-showcase-orbital-robotics',
      source: 'The Aerospace Corporation',
      image: AerospaceCorpPreview,
    },
    {
      title: 'Company Launch Tracker: Orbital Robotics',
      summary:
        'Company Launch Tracker profiles Orbital Robotics, featuring CEO Aaron Borger and our mission to build AI-controlled space robots for national security, space construction, and off-world resource gathering.',
      link: 'https://companylaunchtracker.substack.com/p/company-launch-tracker-37',
      source: 'Company Launch Tracker',
      image: CompanyLaunchTrackerPreview,
    },
    {
      title: 'Orbital Robotics Partners with Starcloud on Space-Based AI',
      summary:
        'Orbital Robotics signs an LOI with Starcloud to partner on space-based AI. The partnership aims to provide AI controlled robotic arms to aid with assembling, docking, maintaining and upgrading datacenter modules.',
      link: '/#/news/starcloud-partnership',
      source: 'Orbital Robotics Blog',
      image: StarcloudPreview,
    },
    {
      title: 'Orbital Robotics at TechCrunch Disrupt 2025',
      summary:
        'Orbital Robotics pitches at TechCrunch Disrupt 2025, showcasing AI solutions for space infrastructure. Watch the full pitch and learn more about our vision for the future of space.',
      link: '/#/news/techcrunch-disrupt',
      source: 'TechCrunch Disrupt',
      image: TechCrunchPreview,
    },
    {
      title: "Startup Radar: It's all about AI for early-stage Seattle companies",
      summary:
        "GeekWire highlights our work in AI for space robotics and how we're shaping the future of autonomous servicing in orbit.",
      link: 'https://www.geekwire.com/2025/startup-radar-its-all-about-ai-for-early-stage-seattle-companies-in-space-storytelling-supply-chain/',
      source: 'GeekWire',
      image: GeekWirePreview,
    },
    {
      title: 'Space Ocean and Orbital Robotics team up on in-space robotics',
      summary:
        'Space Ocean signs an LOI with Orbital Robotics to explore integration of robotic arms and autonomous docking systems for future orbital servicing and infrastructure missions.',
      link: 'https://spaceoceancorp.com/news/space-ocean-orbital-robotics-loi-robotic-integration',
      source: 'Space Ocean',
      image: SpaceOceanPreview,
    },
    {
      title: 'Beyond Max Q: AI and Space Robotics with Orbital Robotics',
      summary:
        'In this episode of Beyond Max Q, host Mollie Jahner and co-host Anne Bly interview Aaron Borger, CEO of Orbital Robotics. They discuss AI in space robotics, safety challenges, startup funding strategies, and the importance of demonstrating technology in orbit before securing customer contracts.',
      link: 'https://www.youtube.com/watch?v=G3wcdS66wgU',
      source: 'Beyond Max Q (YouTube)',
      image: YoutubePreview,
    },
    {
      title: 'Space Dirt: Orbital Robotics builds the next generation of autonomous rendezvous tech',
      summary:
        "Space Dirt highlights Orbital Robotics for its work in developing autonomous rendezvous, proximity operations, and capture (RPOC) systems, key for on-orbit servicing, refueling, relocation, and debris removal. CEO Aaron Borger notes the company's mission to enable high mobility and sustainable orbital operations.",
      link: 'https://spacedirt.beehiiv.com/p/october-s-space-dirt-month-end',
      source: 'Space Dirt Newsletter',
      image: SpaceDirtPreview,
    },
  ];

  const [featured, ...rest] = newsItems;

  return (
    <div className="min-h-screen bg-background pb-20">
      <SEO title="Mission Log" description="Latest updates, press releases, and media coverage for Orbital Robotics." />
      <div className="container mx-auto px-6">
        <AnimatedSection className="max-w-3xl mb-12 pt-10">
          <Eyebrow className="mb-4">MISSION LOG</Eyebrow>
          <h1 className="type-display text-h1 text-white mb-5">Mission log</h1>
          <p className="text-xl text-text-secondary">
            Milestones, partnerships, and media coverage — dated and on the record.
          </p>
        </AnimatedSection>

        <FeaturedCard item={featured} />

        <StaggerContainer
          amount={0.05}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {rest.map((item, index) => (
            <NewsCard key={index} item={item} />
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
};

export default News;
