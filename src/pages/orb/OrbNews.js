import React from 'react';
import { Link } from 'react-router-dom';
import OrbPage from '../../components/orb/OrbPage';
import DividerGlow from '../../components/orb/DividerGlow';
import { ARTICLES } from '../../data/brand';

// News has no frame in the Figma file — only Landing, Navigation, Arm Detail,
// Team, Careers, and Software exist. So this page is not traced from a node; it
// is built from the pattern the design already committed to for exactly this
// content: MissionLogs.js on the landing page ("ARTICLES — The latest mission
// logs"), a numbered list separated by hairlines. This page is that same row,
// carrying the full list instead of a 3-item teaser, with the pre-redesign
// News page's summaries added under each title. No image cards — the redesign
// does not use them anywhere, and introducing them here would be a new visual
// language rather than the site's own.
//
// Hero follows the shell every other rebuilt detail page uses (OrbArmDetail,
// OrbSoftware): eyebrow, display headline, lead paragraph, divider glow.

// Three articles route to this site's own write-ups; an href without a scheme
// is one of those. Everything else is external coverage and opens in a new tab
// — the same distinction the page this replaces made.
const isInternal = (href) => !/^https?:\/\//.test(href);

const ArticleRow = ({ item }) => {
  const body = (
    <>
      <span className="font-plex text-orb-label text-orb-text-4 md:w-10 md:shrink-0">
        {item.index}
      </span>

      <span className="flex-1">
        <span className="block font-sohne text-orb-lg text-orb-text transition-colors group-hover:text-orb-accent">
          {item.title}
        </span>
        <span className="mt-3 block max-w-[820px] font-sohne text-orb-body text-orb-text opacity-70">
          {item.summary}
        </span>
      </span>

      <span className="font-plex text-orb-label uppercase text-orb-text-2 md:w-[220px] md:shrink-0 md:text-right">
        {item.source}
      </span>
    </>
  );

  const className =
    'group flex flex-col gap-4 py-10 md:flex-row md:items-start md:gap-12 transition-colors';

  return (
    <li className="border-t border-white/10 last:border-b">
      {isInternal(item.href) ? (
        <Link to={item.href} className={className}>
          {body}
        </Link>
      ) : (
        <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
          {body}
        </a>
      )}
    </li>
  );
};

const OrbNews = () => (
  <OrbPage>
    <section className="px-6 pb-16 pt-44 md:px-10 md:pt-52">
      <div className="mx-auto max-w-[1362px]">
        <p className="font-plex text-orb-eyebrow uppercase text-orb-accent">MISSION LOG</p>
        <h1 className="mt-6 font-sohne font-normal text-orb-display text-orb-text">Mission log</h1>
        <p className="mt-9 max-w-[720px] font-sohne text-orb-lead text-orb-text">
          Milestones, partnerships, and media coverage — dated and on the record.
        </p>
      </div>
    </section>

    <DividerGlow />

    <section className="px-6 py-20 md:px-10 md:py-28">
      <ul className="mx-auto max-w-[1362px]">
        {ARTICLES.map((item) => (
          <ArticleRow key={item.index} item={item} />
        ))}
      </ul>
    </section>
  </OrbPage>
);

export default OrbNews;
