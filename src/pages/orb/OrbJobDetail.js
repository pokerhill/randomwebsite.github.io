import React, { useEffect } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import OrbPage from '../../components/orb/OrbPage';
import DividerGlow from '../../components/orb/DividerGlow';
import { OPEN_ROLES } from '../../data/brand';

// Role detail page — has no Figma frame (the design never got past the Open
// Roles list), so this is a straight port of the pre-redesign repo's
// src/pages/careers/JobDetail.js: same sections in the same order (Overview,
// Responsibilities, Requirements, Preferred Qualifications, Compensation,
// ITAR), the same Tally.so embed as the actual apply mechanism — not a link
// to an external ATS, not mailto — and the same postMessage listener that
// routes to /careers/thankyou on submit. Restyled with this site's orb-*
// tokens; there is no Eyebrow/Badge component here the way the old repo had,
// so this reuses OrbCareers' own department-chip and mono-label patterns.

const TALLY_SCRIPT = 'https://tally.so/widgets/embed.js';

// Fixed copy the old page appended after every role's own content — not
// per-role data, so it lives here rather than on OPEN_ROLES.
const COMPENSATION_NOTE =
  'Compensation includes equity in the form of company stock / stock options, benefits, and paid time off.';
const ITAR_NOTICE =
  'To conform to U.S. Government export regulations, applicant must be a (i) U.S. citizen or national, (ii) U.S. lawful, permanent resident (aka green card holder), (iii) Refugee under 8 U.S.C. § 1157, or (iv) Asylee under 8 U.S.C. § 1158, or be eligible to obtain the required authorizations from the U.S. Department of State.';

const SectionHeading = ({ children }) => (
  <h2 className="border-b border-white/10 pb-4 font-sohne font-normal text-orb-h2 text-orb-text">
    {children}
  </h2>
);

const Dash = () => (
  <span aria-hidden className="mt-0.5 shrink-0 text-orb-accent">
    &mdash;
  </span>
);

const OrbJobDetail = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const job = OPEN_ROLES.find((r) => r.id === role);

  // Tally posts this message on a successful submission — the same completion
  // signal the old JobDetail.js listened for.
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.event === 'Tally.FormSubmitted') {
        navigate('/careers/thankyou');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  // Tally's embed script scans the DOM for data-tally-src iframes on load;
  // loading it lazily here (rather than in public/index.html) keeps it off
  // every page that isn't showing a form.
  useEffect(() => {
    if (!job) return undefined;
    const loadEmbeds = () => {
      if (typeof window.Tally !== 'undefined') {
        window.Tally.loadEmbeds();
      } else {
        document.querySelectorAll('iframe[data-tally-src]:not([src])').forEach((el) => {
          el.src = el.dataset.tallySrc;
        });
      }
    };
    if (typeof window.Tally !== 'undefined') {
      loadEmbeds();
    } else if (!document.querySelector(`script[src="${TALLY_SCRIPT}"]`)) {
      const s = document.createElement('script');
      s.src = TALLY_SCRIPT;
      s.onload = loadEmbeds;
      s.onerror = loadEmbeds;
      document.body.appendChild(s);
    } else {
      loadEmbeds();
    }
    return undefined;
  }, [job]);

  if (!job) return <Navigate to="/careers" replace />;

  const { title, department, location, type, salary, overview, responsibilities, requirements, preferredQualifications, tallyEmbedSrc } = job;

  return (
    <OrbPage>
      <section className="px-6 pb-16 pt-44 md:px-10 md:pt-52">
        <div className="mx-auto max-w-[762px]">
          <p className="font-plex text-orb-eyebrow uppercase text-orb-accent">{department}</p>
          <h1 className="mt-6 font-sohne font-normal text-orb-display text-orb-text">{title}</h1>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="bg-orb-accent p-2.5 font-sohne text-orb-caption text-orb-text">{type}</span>
            <p className="font-sohne text-orb-caption text-orb-text-2">{location}</p>
          </div>
        </div>
      </section>

      <DividerGlow />

      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto flex max-w-[762px] flex-col gap-14">
          <div className="flex flex-col gap-5">
            <SectionHeading>Overview</SectionHeading>
            <p className="font-sohne text-orb-body leading-[1.6] text-orb-text opacity-70">{overview}</p>
          </div>

          <div className="flex flex-col gap-5">
            <SectionHeading>Responsibilities</SectionHeading>
            <ul className="flex flex-col gap-3">
              {responsibilities.map((item) => (
                <li key={item} className="flex items-start gap-3 font-sohne text-orb-body leading-[1.6] text-orb-text opacity-70">
                  <Dash />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5">
            <SectionHeading>Requirements</SectionHeading>
            <ul className="flex flex-col gap-3">
              {requirements.map((item) => (
                <li key={item} className="flex items-start gap-3 font-sohne text-orb-body leading-[1.6] text-orb-text opacity-70">
                  <Dash />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {preferredQualifications && (
            <div className="flex flex-col gap-5">
              <SectionHeading>Preferred Qualifications</SectionHeading>
              <p className="font-sohne text-orb-body leading-[1.6] text-orb-text opacity-70">
                We are looking for candidates who have deep experience in one or more of the following areas:
              </p>
              <div className="flex flex-col gap-8">
                {preferredQualifications.map((group) => (
                  <div key={group.category}>
                    <h3 className="font-sohne text-orb-lg text-orb-text">{group.category}</h3>
                    <ul className="mt-4 flex flex-col gap-3">
                      {group.items.map((item) => (
                        <li
                          key={item.title}
                          className="flex items-start gap-3 font-sohne text-orb-body leading-[1.6] text-orb-text opacity-70"
                        >
                          <Dash />
                          <span>
                            <span className="font-medium text-orb-text opacity-100">{item.title}:</span>{' '}
                            {item.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-5">
            <SectionHeading>Compensation</SectionHeading>
            {salary && <p className="font-sohne text-orb-body leading-[1.6] text-orb-text opacity-70">{salary}</p>}
            <p className="font-sohne text-orb-body leading-[1.6] text-orb-text opacity-70">{COMPENSATION_NOTE}</p>
          </div>

          <div className="flex flex-col gap-5">
            <SectionHeading>ITAR Requirements</SectionHeading>
            <p className="font-sohne text-orb-body leading-[1.6] text-orb-text opacity-70">{ITAR_NOTICE}</p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 md:px-10">
        <div className="mx-auto max-w-[762px]">
          <SectionHeading>Apply for this role</SectionHeading>
          <iframe
            data-tally-src={tallyEmbedSrc}
            loading="lazy"
            width="100%"
            height="1175"
            frameBorder="0"
            title={title}
            style={{ display: 'block', overflow: 'auto', marginTop: '2rem' }}
          />

          {/* A closing action, not an opening one — this used to sit above the
              job title, which put "leave this page" before the reader even knew
              what page they were on. */}
          <Link
            to="/careers"
            className="mt-14 inline-flex items-center gap-2 font-plex text-orb-label uppercase text-orb-text-2 transition-colors hover:text-orb-accent"
          >
            &larr; Back to Careers
          </Link>
        </div>
      </section>
    </OrbPage>
  );
};

export default OrbJobDetail;
