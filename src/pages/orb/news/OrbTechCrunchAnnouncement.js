import React from 'react';
import OrbArticle, { A, H3, P, Ul, Li } from '../../../components/orb/OrbArticle';

// Ported verbatim from the pre-redesign src/pages/news/TechCrunchAnnouncement.js.
// The old page used an h3/h4 pair for "Participating Companies" and "Follow
// TechCrunch" (h4 one step smaller); this shell only exports one subhead scale
// (H3), so both use it — same weight, not a hierarchy the reader would notice
// missing on a page this short.

const TC_LINKS = [
  ['YouTube', 'https://tcrn.ch/youtube'],
  ['Instagram', 'http://tcrn.ch/instagram'],
  ['TikTok', 'https://tcrn.ch/tiktok'],
  ['X (Twitter)', 'https://tcrn.ch/x'],
  ['Threads', 'https://tcrn.ch/threads'],
  ['Facebook', 'https://tcrn.ch/facebook'],
  ['Bluesky', 'https://tcrn.ch/bluesky'],
  ['Mastodon', 'https://tcrn.ch/mstdn'],
];

const OrbTechCrunchAnnouncement = () => (
  <OrbArticle
    eyebrow="TechCrunch Disrupt"
    title="Orbital Robotics at TechCrunch Disrupt 2025"
    date="November 24, 2025"
    dateTime="2025-11-24"
  >
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      <iframe
        src="https://www.youtube.com/embed/B2yQrUy0n5s?si=kS0TDwIRv5lw6uSK&start=2146"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 h-full w-full rounded-sm border border-white/10"
      />
    </div>

    <P>
      AI is transforming countless industries, and space is no exception. The Aerospace Corporation is
      hosting a #sponsored pitch-off at TechCrunch Disrupt to showcase startups working on innovative AI
      solutions to the hardest problems in space exploration, orbital intelligence, and infrastructure.
    </P>

    <H3>Participating Companies</H3>
    <Ul>
      <Li>Magma Space</Li>
      <Li>Little Place Labs</Li>
      <Li>Orbital Robotics</Li>
      <Li>Scout Space</Li>
    </Ul>

    <P>
      <em>#TechCrunchDisrupt2025</em>
    </P>

    <H3>Follow TechCrunch</H3>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {TC_LINKS.map(([label, href]) => (
        <A key={label} href={href}>
          {label}
        </A>
      ))}
    </div>

    <P>
      Read more at <A href="https://techcrunch.com/">TechCrunch.com</A>
    </P>
  </OrbArticle>
);

export default OrbTechCrunchAnnouncement;
