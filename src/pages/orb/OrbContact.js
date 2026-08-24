import React, { useState } from 'react';
import { FaLinkedinIn } from 'react-icons/fa';
import OrbPage from '../../components/orb/OrbPage';
import OrbButton from '../../components/orb/OrbButton';
import DividerGlow from '../../components/orb/DividerGlow';
import RingA from '../../assets/orb/ring-a.svg';
import { COMPANY, CTA } from '../../data/brand';

// Contact has no frame in the Figma file — only Landing, Navigation, Arm Detail,
// Team, Careers, and Software exist. But its headline is not a guess: CTA.headline
// ("Have a target in orbit?") is the exact line the design repeats as the closing
// band on every other page, and the nav's own contact link reads "FIRST CONTACT".
// This page is what that band promises — so it reuses CTA's copy for its hero
// and is the one page in the redesign that does NOT end on OrbCtaBand (cta={null}
// below): stacking the same headline twice on the page it belongs to would read
// as a mistake, not a design.
//
// The form itself — fields, the no-cors POST to the existing Apps Script
// endpoint, the audience values the backend already expects — is unchanged from
// the pre-redesign Contact page. Only the chrome changes: the glass-card recipe
// used for the hero's flagship card and the footer's link card (backdrop-blur,
// glass-border, 24px radius) replaces the old bordered-panel-on-surface look.

const FORM_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbzhFEpM8vBZvHhfyjgKBpfg0dPh8e6AXxdLDd2gteKkJUecdh7Ec6S-6754kumDietN/exec';

// Audience chips pre-fill the existing Apps Script `subject` payload field —
// values are load-bearing, not just labels.
const AUDIENCES = [
  { value: 'Sales', label: 'SATELLITE OPERATOR' },
  { value: 'Government', label: 'GOVERNMENT & DEFENSE' },
  { value: 'Investors', label: 'INVESTOR' },
  { value: 'Careers', label: 'CAREERS' },
];

const PANEL = 'rounded-2xl border border-orb-glass-border bg-orb-glass backdrop-blur-orb-glass';

const Field = ({ id, label, children }) => (
  <div>
    <label htmlFor={id} className="mb-2 block font-plex text-orb-label uppercase text-orb-text-2">
      {label}
    </label>
    {children}
  </div>
);

const inputClass =
  'w-full border-0 border-b border-white/15 bg-transparent px-0 py-3 font-sohne text-orb-body text-orb-text ' +
  'placeholder:text-orb-text-4 focus:border-orb-accent focus:outline-none transition-colors';

const OrbContact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      // no-cors: the Apps Script endpoint can't return CORS headers, so the
      // response is opaque — a resolved fetch means the request was delivered.
      await fetch(FORM_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(formData),
      });
      setStatus('sent');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <OrbPage cta={null}>
      <section className="px-6 pb-16 pt-44 md:px-10 md:pt-52">
        <div className="mx-auto max-w-[1362px]">
          <p className="font-plex text-orb-eyebrow uppercase text-orb-accent">{CTA.eyebrow}</p>
          <h1 className="mt-6 font-sohne font-normal text-orb-display text-orb-text">
            {CTA.headline}
          </h1>
          <p className="mt-9 max-w-[640px] font-sohne text-orb-lead text-orb-text">
            Tell us about your mission. We respond to every transmission.
          </p>
        </div>
      </section>

      <DividerGlow />

      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto flex max-w-[1362px] flex-col gap-10 lg:flex-row">
          {/* Comms panel. A stacked list of short lines left this box reading
              empty against the form's density, so it is a proper spec sheet
              instead: full-width label/value rows with hairlines between them,
              plus a faint orbit ring bleeding off the corner — the same motif
              every arm render and the CTA band use, so the panel isn't just
              flat dark space. */}
          <div className={`${PANEL} relative overflow-hidden p-8 lg:w-1/3`}>
            <img
              src={RingA}
              alt=""
              aria-hidden
              className="pointer-events-none absolute -right-1/3 -top-1/3 w-[90%] max-w-none opacity-20"
            />

            <div className="relative">
              <h3 className="font-plex text-orb-label uppercase text-orb-text-4">Comms panel</h3>

              <div className="mt-8 border-t border-white/10">
                <div className="flex items-baseline justify-between gap-4 border-b border-white/10 py-5">
                  <span className="font-plex text-orb-label uppercase text-orb-text-4">Location</span>
                  <span className="text-right font-sohne text-orb-body text-orb-text">
                    {COMPANY.hq}
                    <span className="block text-orb-caption text-orb-text-2">{COMPANY.hqCoords}</span>
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-4 border-b border-white/10 py-5">
                  <span className="font-plex text-orb-label uppercase text-orb-text-4">Email</span>
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="font-sohne text-orb-body text-orb-text transition-colors hover:text-orb-accent"
                  >
                    {COMPANY.email}
                  </a>
                </div>

                <div className="flex items-center justify-between py-5">
                  <span className="font-plex text-orb-label uppercase text-orb-text-4">Downlink</span>
                  <a
                    href={COMPANY.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${COMPANY.name} on LinkedIn`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-orb-btn-border
                               text-orb-text transition-colors hover:bg-white hover:text-orb-bg"
                  >
                    <FaLinkedinIn />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Transmission form */}
          <form onSubmit={handleSubmit} className={`${PANEL} flex-1 p-8 md:p-10`}>
            <div className="mb-8">
              <span className="mb-3 block font-plex text-orb-label uppercase text-orb-text-4">
                You are a
              </span>
              <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Inquiry type">
                {AUDIENCES.map((a) => (
                  <button
                    key={a.value}
                    type="button"
                    role="radio"
                    aria-checked={formData.subject === a.value}
                    onClick={() => setFormData({ ...formData, subject: a.value })}
                    className={`rounded-full border px-4 py-2 font-plex text-orb-label uppercase transition-colors ${
                      formData.subject === a.value
                        ? 'border-orb-accent bg-orb-accent/15 text-orb-text'
                        : 'border-white/15 text-orb-text-2 hover:border-white/30 hover:text-orb-text'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              <Field id="name" label="Name">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="Your name"
                />
              </Field>
              <Field id="email" label="Email">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="your@email.com"
                />
              </Field>
            </div>

            <div className="mb-10">
              <Field id="message" label="Transmission">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className={`${inputClass} resize-none`}
                  placeholder="Tell us about your mission."
                />
              </Field>
            </div>

            <OrbButton
              type="submit"
              variant="solid"
              disabled={status === 'sending'}
              className="w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'sending' ? 'Transmitting…' : 'Transmit'}
            </OrbButton>

            {status === 'sent' && (
              <p className="mt-4 font-plex text-orb-label uppercase text-orb-accent" role="status">
                Transmission received — we&rsquo;ll get back to you soon.
              </p>
            )}
            {status === 'error' && (
              <p className="mt-4 font-plex text-orb-label uppercase text-red-400" role="alert">
                Link fault — email us directly at{' '}
                <a href={`mailto:${COMPANY.email}`} className="underline normal-case">
                  {COMPANY.email}
                </a>
                .
              </p>
            )}
          </form>
        </div>
      </section>
    </OrbPage>
  );
};

export default OrbContact;
