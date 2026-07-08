import React from 'react';
import ArticleLayout from '../../components/ArticleLayout';

const StarcloudAnnouncement = () => (
  <ArticleLayout
    title="Orbital Robotics Partners with Starcloud on Space-Based AI"
    description="Orbital Robotics signs an LOI with Starcloud to partner on space-based AI and robotic infrastructure."
    source="Orbital Robotics Blog"
    date="November 24, 2025"
    dateTime="2025-11-24"
  >
    <p className="lead">
      I'm thrilled to announce Orbital Robotics has signed an LOI with Starcloud to partner on space-based AI.
    </p>

    <p>
      Orbital Robotics aims to provide AI-controlled robotic arms to aid with assembling, docking, maintaining and
      upgrading datacenter modules.
    </p>

    <p>
      Orbital Robotics and Starcloud's partnership solves a major problem for AI space robots: training. While Orbital
      Robotics uses simulation to train AI for their robots, data needs to be collected on-orbit to improve simulation
      and computer vision accuracy. There is not enough bandwidth for Orbital Robotics to downlink this data and train on
      terrestrial datacenters. Starcloud datacenters enable simulating and training directly in orbit without downlinking
      data.
    </p>

    <p>
      One problem with the large-scale 4 km x 4 km solar arrays Starcloud intends to deploy in space is end-of-life
      disposal. While Orbital Robotics is developing de-orbit-as-a-service capability, we see recycling the datacenters
      as a gold mine, literally! Starcloud's datacenters contain many metals and materials which could be recycled and
      manufactured into new spacecraft. Since the material is already in orbit, new satellites could be manufactured
      without a launch cost while providing salvage value for Starcloud. This is a long-term goal Orbital Robotics
      intends to work towards turning into a reality.
    </p>

    <p>Orbital Robotics is looking forward to building the future of AI in space with Starcloud.</p>

    <h3>About Starcloud</h3>
    <p>
      Starcloud is building data centers in space to address energy constraints for AI data centers on Earth. Starcloud
      recently launched the first high-powered GPU to space — 100x more powerful AI compute than has been in space
      before.
    </p>

    <h3>About Orbital Robotics</h3>
    <p>
      Orbital Robotics develops robotic systems with mission-critical AI for on-orbit servicing, assembly, and
      manufacturing. Orbital Robotics' patent-pending technologies enable autonomous spacecraft GNC and robotic
      manipulation with a verification approach enabling the safe use of AI in space for mission-critical tasks. Orbital
      Robotics was founded by former Blue Origin leaders with expertise in AI for aerospace, flight software, space
      robotics, and reusable spacecraft.
    </p>

    <hr />
    <p>
      <strong>Philip Johnston</strong>
      <br />
      <span className="text-primary">#datacentersinspace #spaceAI #spacerobotics #orbitalrobotics</span>
    </p>
    <p>
      <a
        href="https://www.linkedin.com/posts/activity-7394083181618118656-9X1K?utm_source=share&utm_medium=member_desktop&rcm=ACoAACCiqBABdq5qelsYHClxZvg-WDGUuEGP31E"
        target="_blank"
        rel="noopener noreferrer"
      >
        View on LinkedIn →
      </a>
    </p>
  </ArticleLayout>
);

export default StarcloudAnnouncement;
