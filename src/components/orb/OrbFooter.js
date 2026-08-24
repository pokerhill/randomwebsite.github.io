import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedinIn } from 'react-icons/fa';
import { COMPANY, FOOTER_COLUMNS } from '../../data/brand';
import LogoMark from './LogoMark';
import FooterMound from '../../assets/orb/footer-mound.png';

// Footer from the Figma component (305:1036) — a 1438x496 box, with two
// corrections:
//
//   1. The design's HARDWARE column lists ASTRA-P and NavIQ — software. Both the
//      master component and every page instance have this wrong. FOOTER_COLUMNS
//      puts the arms under HARDWARE and the stack under SOFTWARE.
//   2. The live site's Contact link and LinkedIn icon are absent from the design;
//      both are restored here.
//
// Every block is pinned, because the design does not stack them: it places each
// one on the box, and the vertical gaps that fall out of that are much larger
// than flow layout with gap utilities produced. The contact rail in particular
// sits at y=423 of 496 — pushed to the floor — where `mt-16` had it 140px high.
//
//   mound      335:404      w 71.14%  top 19.56%  (1023x489, centred)
//   lockup     305:1017     left 2.99%   top 13.71%
//   tagline    305:1016     left 2.99%   top 28.83%  w 37.97%
//   glass card 305:1020     left 55.42%  top  9.07%
//   email      305:1013     left 2.64%   top 85.28%
//   location   305:1015     left 71.21%  top 85.69%
//
// Card metrics were already right and are unchanged: 40/32 padding, 64 between
// columns, 16 within, 24 radius.

const OrbFooter = () => (
  <footer className="relative mx-auto max-w-[1438px] overflow-hidden bg-orb-bg px-6 pb-10 pt-16 md:px-10 lg:aspect-[1438/496] lg:p-0"
    data-figma="305:1036"
    data-figma-name="Footer"
  >
    <img
      src={FooterMound}
      alt=""
      aria-hidden
      className="pointer-events-none absolute left-[14.39%] top-[19.56%] w-[71.14%]"
    />

    {/* Below lg this is ordinary flow; at lg each block sits where the design
        puts it on the 1438x496 box. */}
    {/* lg:inset-0 matters: every child inside is absolutely positioned, so a
        plain block wrapper collapses to zero height and each percentage `top`
        resolves against nothing — piling the whole footer at y=0. Filling the
        1438x496 box gives those percentages the height the design measured from. */}
    <div className="relative mx-auto flex max-w-[1362px] flex-col gap-14 lg:absolute lg:inset-0 lg:max-w-none">
      {/* Identity + tagline */}
      <div className="lg:absolute lg:left-[2.99%] lg:top-[13.71%]">
        <div className="flex items-center gap-4">
          <LogoMark />
          <span className="whitespace-nowrap font-sohne text-2xl font-semibold uppercase leading-[34.813px] tracking-[0.0833em] text-orb-text md:text-[36px]">
            {COMPANY.name}
          </span>
        </div>
      </div>

      <p className="max-w-[546px] font-sohne text-orb-lg leading-[1.15] text-orb-text lg:absolute lg:left-[2.99%] lg:top-[28.83%] lg:w-[37.97%] lg:max-w-none">
        {COMPANY.tagline}
      </p>

      {/* Glass link card */}
      <nav
        aria-label="Footer"
        className="flex flex-wrap gap-10 rounded-[24px] border border-orb-glass-border
                   bg-orb-glass px-10 py-8 backdrop-blur-orb-glass sm:gap-16
                   lg:absolute lg:left-[55.42%] lg:top-[9.07%]"
      >
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading} className="flex flex-col gap-4">
            <p className="font-plex text-orb-label uppercase text-orb-text-4">{col.heading}</p>
            {/* HARDWARE only: ORA is the parent link (top of the arm page), each
                variant below it is a smaller, indented in-page anchor — mirrors
                OrbNav.js's mega-menu treatment of the same column. */}
            {col.parent ? (
              <div className="flex flex-col gap-2">
                <Link
                  to={col.parent.href}
                  className="font-plex text-orb-link uppercase text-orb-text transition-colors hover:text-orb-accent"
                >
                  {col.parent.label}
                </Link>
                {col.items.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="font-plex text-orb-caption uppercase text-orb-text-2 transition-colors hover:text-orb-accent"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : (
              col.items.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="font-plex text-orb-link uppercase text-orb-text transition-colors hover:text-orb-accent"
                >
                  {item.label}
                </Link>
              ))
            )}
          </div>
        ))}
      </nav>

      {/* Contact rail — two separately placed blocks in the design, not a
          space-between row. */}
      <a
        href={`mailto:${COMPANY.email}`}
        className="font-plex text-orb-link uppercase text-orb-text transition-colors hover:text-orb-accent lg:absolute lg:left-[2.64%] lg:top-[85.28%]"
      >
        {COMPANY.email}
      </a>

      <div className="flex items-center gap-6 lg:absolute lg:left-[66.76%] lg:top-[85.69%]">
        {/* Icon sits left of the coordinates, not right. The design has no icon
            here at all, and the location text runs to x=1410 of 1438 — appending
            anything after it pushes past the footer edge and gets clipped. */}
        <a
          href={COMPANY.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${COMPANY.name} on LinkedIn`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orb-btn-border
                     text-orb-text transition-colors hover:bg-white hover:text-orb-bg"
        >
          <FaLinkedinIn />
        </a>

        <p className="whitespace-nowrap font-plex text-orb-link uppercase text-orb-text">
          {COMPANY.hqShort} — <span className="text-orb-accent">{COMPANY.hqCoords}</span>
        </p>
      </div>
    </div>
  </footer>
);

export default OrbFooter;
