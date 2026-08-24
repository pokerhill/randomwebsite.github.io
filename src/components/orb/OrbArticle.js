import React from 'react';
import { Link } from 'react-router-dom';
import OrbPage from './OrbPage';
import DividerGlow from './DividerGlow';

// Shared shell for the three ported article write-ups (Starcloud, TechCrunch,
// Save Hubble) — no Figma frame exists for these; the design never got past
// the "ARTICLES" teaser list. Built from the site's own established primitives
// (the OrbPage shell, DividerGlow, the eyebrow/display/body scale used on every
// other rebuilt page) rather than the old ArticleLayout's Tailwind Typography
// (`prose prose-invert`) classes, which this repo doesn't depend on anywhere
// else — hand-styling each element keeps this consistent with how every other
// page here is built rather than adding a plugin for three pages.
//
// The back link sits at the BOTTOM, after the content, not above the headline.
// The same question came up on the job-detail page: putting "leave this page"
// before the reader knows what they're reading reads backwards. News' own nav
// entry is always one click away in the mega menu regardless.

export const P = ({ children }) => (
  <p className="font-sohne text-orb-body leading-[1.6] text-orb-text opacity-70">{children}</p>
);

export const Lead = ({ children }) => (
  <p className="font-sohne text-orb-lead leading-[1.4] text-orb-text">{children}</p>
);

export const H2 = ({ children }) => (
  <h2 className="font-sohne font-normal text-orb-h2 text-orb-text">{children}</h2>
);

export const H3 = ({ children }) => (
  <h3 className="font-sohne text-orb-lg text-orb-text">{children}</h3>
);

export const Ul = ({ children }) => <ul className="flex flex-col gap-3">{children}</ul>;

export const Li = ({ children }) => (
  <li className="flex items-start gap-3 font-sohne text-orb-body leading-[1.6] text-orb-text opacity-70">
    <span aria-hidden className="mt-0.5 shrink-0 text-orb-accent">
      &mdash;
    </span>
    <span>{children}</span>
  </li>
);

export const A = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-orb-text underline decoration-white/30 underline-offset-2 transition-colors hover:text-orb-accent hover:decoration-orb-accent"
  >
    {children}
  </a>
);

export const Hr = () => <hr className="border-white/10" />;

const OrbArticle = ({ eyebrow, title, date, dateTime, heroImage, children }) => (
  <OrbPage>
    <section className="px-6 pb-16 pt-44 md:px-10 md:pt-52">
      <div className="mx-auto max-w-[762px]">
        {eyebrow && <p className="font-plex text-orb-eyebrow uppercase text-orb-accent">{eyebrow}</p>}
        <h1 className="mt-6 font-sohne font-normal text-orb-display text-orb-text">{title}</h1>
        {date && (
          <time dateTime={dateTime} className="mt-6 block font-plex text-orb-label uppercase text-orb-text-2">
            {date}
          </time>
        )}
      </div>
    </section>

    <DividerGlow />

    {heroImage && (
      <section className="px-6 pt-16 md:px-10">
        <div className="mx-auto max-w-[1362px]">
          <img src={heroImage} alt={title} className="w-full rounded-sm object-cover" />
        </div>
      </section>
    )}

    <section className="px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto flex max-w-[762px] flex-col gap-8">
        {children}

        <Link
          to="/news"
          className="mt-8 inline-flex items-center gap-2 font-plex text-orb-label uppercase text-orb-text-2 transition-colors hover:text-orb-accent"
        >
          &larr; Back to Mission Log
        </Link>
      </div>
    </section>
  </OrbPage>
);

export default OrbArticle;
