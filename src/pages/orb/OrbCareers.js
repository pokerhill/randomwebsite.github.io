import React from 'react';
import { Link } from 'react-router-dom';
import OrbPage from '../../components/orb/OrbPage';
import OrbButton from '../../components/orb/OrbButton';
import DividerGlow from '../../components/orb/DividerGlow';
import { OPEN_ROLES } from '../../data/brand';
import HiringPhilosophy from '../../assets/orb/careers/hiring-philosophy.png';
import LifeAtOrbital from '../../assets/orb/careers/life-at-orbital.png';

// Figma "Careers" (369:1234). Display headline, accent divider, two alternating
// copy/circular-image blocks, then Open Roles as #202020 rows.
//
// The circular images are the design's own: node 369:1541 ("Ellipse 18", the
// mask sitting beside the "Our Hiring Philosophy" text frame 369:1297) and node
// 369:1542 ("Ellipse 19", beside "Life at Orbital Robotics" 369:1302) — a
// prior pass used generic Earth-limb/nebula stock photos here as stand-ins
// while the real assets were unconfirmed; these are the real ones.
//
// Two deliberate departures from the design, both because the design is wrong or
// incomplete rather than because this is easier:
//   - The design repeats one "Mechanical Engineer / Huntsville, AL" row three
//     times; OPEN_ROLES carries the three real roles.
//   - The design has no salary field, but the live site publishes a range on
//     every role, so dropping it would lose real information.
//
// "View Role" now goes somewhere: the pre-redesign site had a whole detail page
// per role (/careers/:role, Tally application form and all) that this repo
// never carried over — OrbJobDetail ports it. Each row is the Link, same as the
// old Careers.js card, not just the trailing label.

const CtaBlock = () => (
  <section className="relative overflow-hidden bg-orb-cta px-6 py-28 md:px-10 md:py-36">
    <div className="mx-auto flex max-w-[721px] flex-col items-center gap-6 text-center">
      <p className="font-plex text-orb-eyebrow uppercase text-orb-accent">THE PILOTS</p>
      <h2 className="font-sohne font-normal text-orb-h2 text-orb-text">
        Don&rsquo;t see your role?
      </h2>
      <p className="font-sohne text-orb-body text-orb-text opacity-70">
        We&rsquo;re growing fast and open roles change frequently. If you&rsquo;re passionate about
        space robotics and think you&rsquo;d be a strong fit, check back often or reach out directly.
        We&rsquo;d love to hear from you.
      </p>
      <div className="mt-2">
        <OrbButton to="/contact">CONTACT</OrbButton>
      </div>
    </div>
  </section>
);

const Block = ({ title, body, image, alt, flip = false }) => (
  <div
    className={`grid items-center gap-12 lg:grid-cols-2 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}
  >
    <div>
      <h2 className="font-sohne font-normal text-orb-h2 text-orb-text">{title}</h2>
      <p className="mt-7 max-w-[631px] font-sohne text-orb-body text-orb-text opacity-70">{body}</p>
    </div>
    <img
      src={image}
      alt={alt}
      className="mx-auto aspect-square w-full max-w-[528px] rounded-full object-cover"
    />
  </div>
);

const OrbCareers = () => (
  <OrbPage cta={<CtaBlock />}>
    <section className="px-6 pb-20 pt-44 md:px-10 md:pt-52">
      <div className="mx-auto max-w-[1362px]">
        <h1 className="max-w-[1140px] font-sohne font-normal text-orb-display text-orb-text">
          Build the Infrastructure of the Space Economy
        </h1>
      </div>
    </section>

    <DividerGlow />

    <section className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto flex max-w-[1362px] flex-col gap-28">
        <Block
          title="Our Hiring Philosophy"
          body="We believe a strong fit for Orbital Robotics is more than just your resume. We look for candidates that are low-ego, work well in small teams, and obsessively passionate about the space industry. Also, we don't make you type out your experience."
          image={HiringPhilosophy}
          alt=""
        />
        <Block
          title="Life at Orbital Robotics"
          body="We celebrate our wins and failures together as a team while ruthlessly pursuing the greater objective. We recognize the value of each team member and welcome the opportunity to celebrate you as well."
          image={LifeAtOrbital}
          alt=""
          flip
        />
      </div>
    </section>

    <section className="px-6 pb-28 md:px-10">
      <div className="mx-auto max-w-[1372px]">
        <h2 className="font-sohne font-normal text-orb-h2 text-orb-text">Open Roles</h2>

        <p className="mt-12 border-t border-white/10 pt-10 font-sohne text-[24px] tracking-[-0.02em] text-orb-text">
          Engineering
        </p>

        <ul className="mt-8 flex flex-col gap-4">
          {OPEN_ROLES.map((r) => (
            <li key={r.id}>
              <Link
                to={`/careers/${r.id}`}
                className="group flex flex-col gap-6 bg-orb-card px-6 py-10 transition-colors
                           hover:bg-[#262626] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col gap-4">
                  <p className="font-sohne text-orb-lg text-orb-text">{r.title}</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="bg-orb-accent p-2.5 font-sohne text-orb-caption text-orb-text">
                      {r.department}
                    </span>
                    <p className="font-sohne text-orb-caption text-orb-text">
                      {r.location} &nbsp;•&nbsp; {r.type}
                    </p>
                    <p className="font-sohne text-orb-caption text-orb-text-2">{r.salary}</p>
                  </div>
                </div>

                <span className="flex shrink-0 items-center gap-4 font-sohne text-orb-caption text-orb-text">
                  View Role
                  <span
                    aria-hidden
                    className="text-orb-accent transition-transform group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  </OrbPage>
);

export default OrbCareers;
