import React from 'react';
import { SOFTWARE } from '../../data/brand';
import SpacePlate from '../../assets/orb/arch/space-plate.png';
import NaviqIcon from '../../assets/orb/arch/naviq-icon.svg';
import ConnectorsIcon from '../../assets/orb/arch/connectors.svg';
import AstrapIcon from '../../assets/orb/arch/astrap-icon.svg';
import OraEllipse from '../../assets/orb/arch/ora-ellipse.svg';
import OraArm from '../../assets/orb/arch/ora-arm.png';
import ConnectorLine from '../../assets/orb/arch/connector-line.svg';
import RingL from '../../assets/orb/arch/ring-l.svg';
import RingR from '../../assets/orb/arch/ring-r.svg';

// ORBtos architecture diagram — Figma 335:451, a 1442x752 band.
//
// Rebuilt as real DOM from the node tree rather than pasted in as a flat export,
// so the labels are selectable text, the product names come from brand.js (the
// design says "ORBTOS"/"NAVIQ"; the live site says ORBtos/NavIQ), and the glass
// cards use the same tokens as the rest of the site.
//
// Every value below is the node's own from the file, expressed as a percentage of
// the 1442x752 band:
//
//   plate        -6.80% / -6.78%  w 113.07%   blur(40px), black 0.2 overlay
//   dashed frame  centre-115.38   w  29.45%  h 55.65%  radius 29.133, 1.766 dashed
//   NavIQ card    28.81% / 27.63%  w 12.24%  h 23.24%
//   Orbital Software 28.81% / 53.81%  w 26.33%  h 23.24%   (Figma: "Connectors")
//   ASTRA-P card  42.83% / 27.86%  w 12.24%  h 23.24%
//   ORA Series    63.95% / 40.07%  w 25.65%  h 25.71%
//   Software pill 39.03% / 14.48%
//   Hardware pill 73.62% / 30.56%
//   lockup        10.19% / 45.12%  w 13.41%  h 14.48%
//
// Card style is one shared recipe: backdrop-blur(20.878px), a left-to-right
// rgba(217,217,217,.5) -> rgba(115,115,115,0) gradient, 0.883px #d9d9d9 border,
// 16.773px radius.

const [orbtos, naviq, astrap] = SOFTWARE;

const CARD =
  'absolute overflow-hidden rounded-[1.16%/2.23%] border-[0.883px] border-[#d9d9d9] ' +
  'bg-gradient-to-r from-[rgba(217,217,217,0.5)] to-[rgba(115,115,115,0)] backdrop-blur-orb-card';

const Pill = ({ children, className }) => (
  <span
    className={`absolute flex items-center justify-center rounded-full bg-white px-[1%] py-[1.9%]
                font-sohne text-[0.98vw] leading-none text-orb-pill lg:text-[14.125px] ${className}`}
  >
    {children}
  </span>
);

const OrbtosArchitecture = () => (
  <div className="relative w-full overflow-hidden bg-orb-black">
    {/* Blurred space plate with the design's dark wash over it. Stays on the
        full-bleed wrapper so the plate still runs edge to edge past 1442. */}
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <img
        src={SpacePlate}
        alt=""
        className="absolute left-[-6.8%] top-[-6.78%] w-[113.07%] max-w-none object-cover blur-[40px]"
      />
      <div className="absolute inset-0 bg-black/20" />
    </div>

    {/* The design's 1442x752 band, capped and centred. Every offset below is a
        percentage of it and the labels are pinned to px at lg, so the frame has
        to stop growing at 1442 or the type shrinks against its own composition. */}
    <div className="relative mx-auto aspect-[1442/752] w-full max-w-[1442px]">
      {/* Counter-rotated guide rings, bleeding well past the frame. */}
      <img src={RingL} alt="" aria-hidden className="pointer-events-none absolute left-[-20.7%] top-[-77.8%] w-[140.9%] -rotate-45" />
      <img src={RingR} alt="" aria-hidden className="pointer-events-none absolute left-[-20.7%] top-[-77.8%] w-[140.9%] rotate-45 -scale-y-100" />

      {/* Dashed frame around the software half. */}
      <div
        aria-hidden
        className="absolute left-[27.27%] top-[24.69%] h-[55.65%] w-[29.45%]
                   rounded-[29px] border-[1.766px] border-dashed border-white/70"
      />

      {/* NavIQ */}
      <div className={`${CARD} left-[28.81%] top-[27.63%] h-[23.24%] w-[12.24%]`}>
        <img src={NaviqIcon} alt="" aria-hidden className="absolute left-[31%] top-[16.2%] w-[34%]" />
        <p className="absolute left-[27%] top-[55%] font-sohne text-[1.96vw] leading-[1.4] tracking-[-0.031em] text-white lg:text-[28.25px]">
          {naviq.name}
        </p>
      </div>

      {/* Connectors */}
      <div className={`${CARD} left-[28.81%] top-[53.81%] h-[23.24%] w-[26.33%]`}>
        <img src={ConnectorsIcon} alt="" aria-hidden className="absolute left-[27.2%] top-[20.2%] w-[45.1%]" />
        <p className="absolute left-1/2 top-[62.6%] -translate-x-1/2 whitespace-nowrap font-sohne text-[1.96vw] leading-[1.4] tracking-[-0.031em] text-white lg:text-[28.25px]">
          Orbital Software
        </p>
      </div>

      {/* ASTRA-P — mirrored in the design, so the card is flipped and the contents
          flipped back to stay legible. */}
      <div className={`${CARD} left-[42.83%] top-[27.86%] h-[23.24%] w-[12.24%] rotate-180 -scale-y-100`}>
        <div className="absolute inset-0 rotate-180 -scale-y-100">
          <img src={AstrapIcon} alt="" aria-hidden className="absolute left-[32.5%] top-[18.2%] w-[34.2%]" />
          <p className="absolute left-[18%] top-[55.6%] whitespace-nowrap font-sohne text-[1.96vw] leading-[1.4] tracking-[-0.031em] text-white lg:text-[28.25px]">
            {astrap.name}
          </p>
        </div>
      </div>

      {/* ORA Series */}
      <div className={`${CARD} left-[63.95%] top-[40.07%] h-[25.71%] w-[25.65%]`}>
        <img src={OraEllipse} alt="" aria-hidden className="absolute left-[47.9%] top-[-17.2%] w-[70.4%]" />
        <img src={OraArm} alt="" aria-hidden className="absolute left-[35.6%] top-[8.2%] w-[63.7%]" />
        <ul className="absolute left-[4.8%] top-[10%] flex flex-col gap-[2.3%] font-sohne text-[0.98vw] leading-[1.4] text-[#e2e9f0] lg:text-[14.125px]">
          {['MINI', 'GIGA', 'ASTROS-FERA'].map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
        <p className="absolute left-[4.3%] top-[63%] w-[23.6%] font-sohne text-[1.96vw] leading-[0.9] tracking-[-0.031em] text-white lg:text-[28.25px]">
          ORA Series
        </p>
      </div>

      {/* Link between the software and hardware halves. */}
      <img src={ConnectorLine} alt="" aria-hidden className="absolute left-[56.7%] top-[53.06%] w-[5.62%]" />

      <Pill className="left-[39.03%] top-[14.48%]">Software</Pill>
      <Pill className="left-[73.62%] top-[30.56%]">Hardware</Pill>

      {/* ORBtos lockup */}
      <div className="absolute left-[10.19%] top-[45.12%] flex h-[14.48%] w-[13.41%] flex-col items-center justify-center text-white">
        <p className="w-full font-sohne text-[3.55vw] font-semibold leading-[1.4] tracking-[-0.031em] lg:text-[51.13px]">
          {orbtos.name}
        </p>
        <p className="w-full text-center font-sohne text-[1.96vw] leading-[1.4] tracking-[-0.031em] lg:text-[28.25px]">
          System
        </p>
      </div>
    </div>
  </div>
);

export default OrbtosArchitecture;
