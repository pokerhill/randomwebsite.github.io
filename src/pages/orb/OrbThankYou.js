import React from 'react';
import { Link } from 'react-router-dom';
import OrbPage from '../../components/orb/OrbPage';

// Reached only via the Tally postMessage listener in OrbJobDetail — not part
// of the "View Role" click path itself, but the completion of the flow it
// starts. Ported from the pre-redesign repo's ThankYou.js.
//
// cta={null}: every other rebuilt page ends on "Have a target in orbit? Book a
// capture demo" — pitching a sales demo immediately after someone submits a
// job application reads as a mismatch, the same reasoning OrbContact uses for
// dropping it.

const OrbThankYou = () => (
  <OrbPage cta={null}>
    <section className="flex min-h-[70vh] items-center px-6 pb-20 pt-44 md:px-10 md:pt-52">
      <div className="mx-auto max-w-[640px]">
        <p className="font-plex text-orb-eyebrow uppercase text-orb-accent">Application Received</p>
        <h1 className="mt-6 font-sohne font-normal text-orb-display text-orb-text">
          Thank you for applying!
        </h1>
        <p className="mt-9 font-sohne text-orb-lead text-orb-text">
          We&rsquo;ve received your application and will review it as soon as possible. If your
          background is a strong fit, someone from our team will be in touch.
        </p>
        <Link
          to="/careers"
          className="mt-10 inline-flex items-center gap-2 font-plex text-orb-label uppercase text-orb-text-2 transition-colors hover:text-orb-accent"
        >
          &larr; Back to Careers
        </Link>
      </div>
    </section>
  </OrbPage>
);

export default OrbThankYou;
