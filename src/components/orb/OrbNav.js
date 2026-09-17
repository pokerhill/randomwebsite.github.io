import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import OrbButton from './OrbButton';
import { COMPANY, NAV_COLUMNS } from '../../data/brand';
import LogoMark from './LogoMark';
import ToggleRing from '../../assets/orb/nav-toggle-ring.svg';

// Nav bar + mega-menu from the Figma (bar 297:601, panel styling from the
// "Hover States" frame, scrolled treatment from "Navigation Scrolled" 387:510's
// nested "Overlay Navigation" component, 387:490).
//
// Two things were actually wrong here, not just stylistic:
//
//   1. The header was `absolute`, not `fixed`. With no positioned ancestor,
//      `absolute` anchors to the top of the DOCUMENT rather than the viewport,
//      so it scrolled away with the page like any other content — past the
//      hero, there was no nav at all on any page. It is `fixed` now, so it
//      survives scroll everywhere.
//   2. There was no scrolled state to speak of. The design's reference collapses
//      the full-width bar into a small centered glass pill (Overlay Navigation):
//      logo+wordmark, then FIRST CONTACT and the toggle grouped tightly, on the
//      same bg-orb-glass/border-orb-glass-border/backdrop-blur-orb-glass recipe
//      used everywhere else on the site (footer's link card, the hero's flagship
//      card). That swap now happens past a small scroll threshold.
//
// This is also a new information architecture from the live site's flat nav
// (Products / Team / Careers / News): the design groups everything into
// SOFTWARE / HARDWARE / COMPANY. NAV_COLUMNS holds that mapping and points at
// the routes that exist in App.js today, so the menu navigates rather than
// dead-ends. The open panel itself is left at the page's full 1362px column
// regardless of scroll state — there is no reference showing a scrolled bar
// with the panel open at once, and shrinking a mega-menu to 790px would crowd
// three columns that do not need it.

const SCROLL_THRESHOLD = 24;

// The toggle glyph is traced from Figma's own vectors (Overlay Navigation,
// nodes 385:478/481/487) rather than approximated: a 40%-opacity ring built
// from four separate arcs with gaps at N/S/E/W (exported as
// nav-toggle-ring.svg), a solid white 20px disc, and a small black X drawn at
// 7.78px. The X is the glyph's own geometry — Figma wraps it in rotate(45deg)
// to show the CLOSED state, which turns an X into a +. Open drops that rotation
// back to 0, showing the X plainly. Same idea as a two-bar hamburger-to-close
// toggle, but one glyph rotating as a unit, matching what the file draws.
const ToggleIcon = ({ open }) => (
  <span aria-hidden className="relative flex h-[38px] w-[38px] shrink-0 items-center justify-center">
    <img src={ToggleRing} alt="" className="absolute inset-0 h-full w-full" />
    <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-white">
      <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        className={`transition-transform duration-300 ${open ? 'rotate-0' : 'rotate-45'}`}
      >
        <path d="M7.24 0.54 0.52 7.25" stroke="#161616" strokeWidth="0.9" strokeLinecap="round" />
        <path d="M7.42 7.42 0.35 0.35" stroke="#161616" strokeWidth="0.9" strokeLinecap="round" />
      </svg>
    </span>
  </span>
);

const OrbNav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape closes the panel, matching the close affordance in the design.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-6 pt-8 md:px-10">
      <div
        className={`mx-auto flex items-center justify-between border transition-[max-width,padding,border-radius,background-color,border-color] duration-300 ease-out ${
          scrolled
            ? 'max-w-[790px] rounded-2xl border-orb-glass-border bg-orb-glass px-5 py-[18px] backdrop-blur-orb-glass'
            : 'max-w-[1362px] border-transparent bg-transparent px-0 py-0'
        }`}
      >
        <Link to="/" className="flex items-center gap-3" aria-label={`${COMPANY.name} home`}>
          <LogoMark />
          <span className="font-sohne text-lg font-semibold uppercase tracking-[0.139em] text-orb-text md:text-[28.838px]">
            {COMPANY.name}
          </span>
        </Link>

        <div className="flex items-center gap-[25px]">
          <OrbButton to="/contact" className="hidden sm:inline-flex">
            FIRST CONTACT
          </OrbButton>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="orb-mega-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="text-orb-text transition-colors hover:text-orb-accent
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                       focus-visible:outline-orb-accent"
          >
            <ToggleIcon open={open} />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1362px]">
        <AnimatePresence>
          {open && (
            <motion.nav
              id="orb-mega-menu"
              aria-label="Main"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mt-6 grid gap-10 rounded-2xl border border-orb-glass-border bg-orb-glass
                         p-8 backdrop-blur-orb-nav md:grid-cols-3 md:gap-0 md:p-10"
            >
              {NAV_COLUMNS.map((col, i) => (
                <div
                  key={col.heading}
                  className={`flex flex-col gap-6 md:px-10 ${
                    i > 0 ? 'md:border-l md:border-white/15' : ''
                  }`}
                >
                  <p className="font-plex text-orb-label uppercase text-orb-text-4">{col.heading}</p>

                  {/* HARDWARE only: ORA is the parent link (top of the arm page),
                      each variant below it is a smaller, indented in-page anchor
                      rather than a sibling link — SOFTWARE/COMPANY are unaffected. */}
                  {col.parent ? (
                    <div className="flex flex-col gap-3">
                      <Link
                        to={col.parent.href}
                        onClick={() => setOpen(false)}
                        className="font-sohne text-orb-lg text-orb-text transition-colors hover:text-orb-accent"
                      >
                        {col.parent.label}
                      </Link>
                      {col.items.map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          onClick={() => setOpen(false)}
                          className="font-sohne text-orb-body text-orb-text-2 transition-colors hover:text-orb-accent"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <ul className="flex flex-col gap-5">
                      {col.items.map((item) => (
                        <li key={item.label}>
                          <Link
                            to={item.href}
                            onClick={() => setOpen(false)}
                            className="font-sohne text-orb-lg text-orb-text transition-colors hover:text-orb-accent"
                          >
                            {item.label}
                          </Link>
                          {item.blurb && (
                            <p className="mt-2 max-w-[292px] font-sohne text-orb-caption text-orb-text-2">
                              {item.blurb}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default OrbNav;
