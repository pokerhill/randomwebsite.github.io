import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import OrbButton from './OrbButton';
import BracketRule from '../../assets/orb/bracket-rule.svg';

// "Profiles" (369:1418/369:1419) — glass card on the site's usual recipe
// (bg-orb-glass / border-orb-glass-border / backdrop-blur-orb-glass, same as
// the footer's link card and the nav's mega-menu), portrait left, credential
// pill + name + role + bio + LINKEDIN right, with the same corner-bracket-rule
// asset OrbArmDetail.js already draws top and bottom (bottom copy rotated
// 180, exactly like Frame 77/78 there).
//
// Copy is CREW/ADVISORS from brand.js, never the Figma text — the design
// shortens roles ("Co-founder | Software") where brand.js has the live
// site's actual title ("Co-Founder & Lead Software Engineer"), same rule
// every other page on this redesign already follows. Portraits are each
// person's real color headshot (member.image — the same file the crew grid
// above already shows), not Pilots.js's separate black-and-white cascade
// crop on the landing page.
const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
    <path d="M10.9 1.1 1.1 10.9" stroke="#161616" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M10.9 10.9 1.1 1.1" stroke="#161616" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const ProfileModal = ({ member, onClose }) => {
  useEffect(() => {
    if (!member) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [member, onClose]);

  if (!member) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={member.name}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[1236px] rounded-[24px] border border-orb-glass-border
                   bg-orb-glass p-8 backdrop-blur-orb-glass sm:p-12"
      >
        <img
          src={BracketRule}
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-6 right-6 top-6 hidden w-[calc(100%-48px)] sm:block"
        />
        <img
          src={BracketRule}
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-6 left-6 right-6 hidden w-[calc(100%-48px)] rotate-180 sm:block"
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-6 top-6 flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                     bg-white transition-transform hover:scale-105
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orb-accent"
        >
          <CloseIcon />
        </button>

        <div className="flex flex-col gap-10 pt-8 sm:pt-6 lg:flex-row lg:items-start lg:gap-16 lg:pt-2">
          <img
            src={member.image}
            alt={member.name}
            className="aspect-[307/349] w-full max-w-[307px] shrink-0 rounded-sm object-cover object-top"
          />

          <div className="flex flex-col items-start gap-8">
            {member.credentials?.[0] && (
              <span className="bg-orb-accent p-[10px] font-sohne text-orb-caption text-orb-text">
                {member.credentials[0]}
              </span>
            )}

            <div className="flex flex-col gap-3">
              <p className="font-sohne text-orb-lg text-orb-text">{member.name}</p>
              <p className="font-sohne text-orb-caption text-orb-text">{member.role}</p>
            </div>

            <p className="max-w-[554px] font-sohne text-orb-caption leading-[1.6] text-orb-text">
              {member.bio}
            </p>

            {member.linkedin && <OrbButton href={member.linkedin}>LINKEDIN</OrbButton>}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProfileModal;
