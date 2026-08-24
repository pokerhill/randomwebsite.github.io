import React, { useState } from 'react';
import OrbPage from '../../components/orb/OrbPage';
import DividerGlow from '../../components/orb/DividerGlow';
import ProfileModal from '../../components/orb/ProfileModal';
import { CREW, ADVISORS } from '../../data/brand';

// Figma "Team" (368:1155). Display headline + intro, four crew cards in a flat
// row (unlike the landing page, where the founder cards cascade), the accent
// divider, then hairline-separated advisor rows: 153px circular avatar, then
// role/name/accent tags, then a 762px bio at 70% opacity.
//
// All names, roles, credentials and bios come from brand.js — which is the live
// site's data, so the design's errors (Aaron "Borgor", Roesler tagged Ex-Blue
// Origin, the duplicated Sembroski row) do not reach the page.
//
// Every card/row opens the "Profiles" popup (369:1418/1419, ProfileModal.js)
// on click — same member data, just the fuller bio/LinkedIn treatment.

const Tag = ({ children }) => (
  <span className="bg-orb-accent p-1 font-sohne text-orb-tag text-orb-text">{children}</span>
);

const OrbTeam = () => {
  const [selected, setSelected] = useState(null);

  return (
    <OrbPage>
      <section className="px-6 pb-20 pt-44 md:px-10 md:pt-52">
        <div className="mx-auto max-w-[1362px]">
          <h1 className="max-w-[905px] font-sohne font-normal text-orb-display text-orb-text">
            Meet the crew
          </h1>
          <p className="mt-9 max-w-[905px] font-sohne text-orb-lg text-orb-text">
            Founded by Blue Origin and SpaceX engineers who have flown robotic-capture payloads and
            built flight software for lunar landers, advised by astronauts and space-systems leaders.
          </p>

          <div className="mt-24 grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
            {CREW.map((m) => (
              <button
                type="button"
                key={m.name}
                onClick={() => setSelected(m)}
                className="group text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orb-accent"
              >
                <figure>
                  <img
                    src={m.image}
                    alt={m.name}
                    className="aspect-[307/349] w-full rounded-sm object-cover object-top grayscale transition-opacity group-hover:opacity-80"
                  />
                  <figcaption className="mt-8">
                    <p className="font-sohne text-orb-lg text-orb-text">{m.name}</p>
                    <p className="mt-3 font-sohne text-orb-caption text-orb-text-2">{m.role}</p>
                  </figcaption>
                </figure>
              </button>
            ))}
          </div>
        </div>
      </section>

      <DividerGlow />

      <section className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1372px]">
          <h2 className="font-sohne font-normal text-orb-h1 text-orb-text">Advisors and Board</h2>

          <div className="mt-12 flex flex-col">
            {ADVISORS.map((a) => (
              <button
                type="button"
                key={a.name}
                onClick={() => setSelected(a)}
                className="group flex flex-col gap-8 border-t border-white/10 py-10 text-left
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orb-accent
                           lg:flex-row lg:items-center lg:gap-20"
              >
                <img
                  src={a.image}
                  alt={a.name}
                  className="h-[153px] w-[153px] shrink-0 rounded-full object-cover transition-opacity group-hover:opacity-80"
                />

                <div className="flex w-full max-w-[235px] shrink-0 flex-col gap-6">
                  <div>
                    <p className="font-sohne text-orb-caption text-orb-text">{a.role}</p>
                    <p className="mt-3 font-sohne text-orb-lg text-orb-text">{a.name}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {a.credentials.map((c) => (
                      <Tag key={c}>{c}</Tag>
                    ))}
                  </div>
                </div>

                <p className="max-w-[762px] font-sohne text-orb-body text-orb-text opacity-70">
                  {a.bio}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <ProfileModal member={selected} onClose={() => setSelected(null)} />
    </OrbPage>
  );
};

export default OrbTeam;
