import React from 'react';
import ArticleLayout from '../../components/ArticleLayout';

const TechCrunchAnnouncement = () => (
  <ArticleLayout
    title="Orbital Robotics at TechCrunch Disrupt 2025"
    description="Orbital Robotics pitches at TechCrunch Disrupt 2025, showcasing AI solutions for space infrastructure."
    source="TechCrunch Disrupt"
    date="November 24, 2025"
    dateTime="2025-11-24"
  >
    <div className="not-prose relative w-full mb-10" style={{ paddingBottom: '56.25%' }}>
      <iframe
        src="https://www.youtube.com/embed/B2yQrUy0n5s?si=kS0TDwIRv5lw6uSK&amp;start=2146"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 w-full h-full rounded-xl border border-white/10 shadow-elev-2"
      />
    </div>

    <p className="lead">
      AI is transforming countless industries, and space is no exception. The Aerospace Corporation is hosting a
      #sponsored pitch-off at TechCrunch Disrupt to showcase startups working on innovative AI solutions to the hardest
      problems in space exploration, orbital intelligence, and infrastructure.
    </p>

    <h3>Participating Companies</h3>
    <ul>
      <li>Magma Space</li>
      <li>Little Place Labs</li>
      <li>Orbital Robotics</li>
      <li>Scout Space</li>
    </ul>

    <p>
      <em>#TechCrunchDisrupt2025</em>
    </p>

    <h4>Follow TechCrunch</h4>
    <div className="not-prose grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-6">
      {[
        ['YouTube', 'https://tcrn.ch/youtube'],
        ['Instagram', 'http://tcrn.ch/instagram'],
        ['TikTok', 'https://tcrn.ch/tiktok'],
        ['X (Twitter)', 'https://tcrn.ch/x'],
        ['Threads', 'https://tcrn.ch/threads'],
        ['Facebook', 'https://tcrn.ch/facebook'],
        ['Bluesky', 'https://tcrn.ch/bluesky'],
        ['Mastodon', 'https://tcrn.ch/mstdn'],
      ].map(([label, href]) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-hover">
          {label}
        </a>
      ))}
    </div>
    <p className="text-sm text-text-muted">
      Read more at{' '}
      <a href="https://techcrunch.com/" target="_blank" rel="noopener noreferrer">
        TechCrunch.com
      </a>
    </p>
  </ArticleLayout>
);

export default TechCrunchAnnouncement;
