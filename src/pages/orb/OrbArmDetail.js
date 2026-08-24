import React from 'react';
import OrbPage from '../../components/orb/OrbPage';
import OrbButton from '../../components/orb/OrbButton';
import DividerGlow from '../../components/orb/DividerGlow';
import { ARMS, SOFTWARE } from '../../data/brand';
import ProductLine from '../../assets/orb/arms/ora-product-line.png';
import LensA from '../../assets/orb/lens-a.svg';
import LensB from '../../assets/orb/lens-b.svg';
import BracketRule from '../../assets/orb/bracket-rule.svg';
import DesignFlagship from '../../assets/orb/arms/design-flagship.jpg';
import DesignMini from '../../assets/orb/arms/design-mini.jpg';
import DesignGigaAllArms from '../../assets/orb/arms/design-giga-all-arms.jpg';

// Figma "Arm Detail Page" (291:544) — a 1440x6090 frame.
//
//   hero still     292:574   x=1    y=0     1439x899   full bleed
//   hero copy      291:562   x=38   y=355   566x274
//   divider        291:553   y=895  h=6
//   intro          305:1062  x=43   y=984   1287x290   48px
//   arm board      369:1499  x=-4   y=1285  1434x2410
//   cross-sell     369:1598  x=40   y=3846  1361x351
//
// The arm board's geometry could not be read off get_metadata: the rings are
// rotated, and for a rotated node the metadata reports the PRE-rotation box, so
// the two ellipses come back at x=1007.878 and x=880.176 as if they were offset
// from each other. They are not. get_design_context resolves the transforms and
// puts both at left=545.05px, concentric — one at rotate(45deg), the other at
// rotate(135deg) with scaleY(-1). Measuring the Figma render confirms it: the
// visible ring bbox is 571px, which is what a 473.934x654.532 ellipse turns into
// at 45 degrees, centred on the arm.
//
// Everything below is therefore a percentage of its parent's design box.

const orbtos = SOFTWARE[0];

// Percentages of the 1434x2410 board (369:1499).
// Each render is a 3840x2160 studio still that the design crops hard into the
// 504.41px circle. `box` is the image node's frame as a percentage of that
// circle; `crop` is the fill's own offset and scale inside that frame. Both come
// straight off the nodes (369:1493, 369:1552, 369:1560, 369:1568).
//
// These are the design's own renders rather than the transparent PNGs used
// elsewhere on the site. Ours are a different, wider pose — measured against the
// Figma frame they come out 32% wider at the same height — so no amount of
// scaling makes them sit like the design's. The file does give each block its
// own visual (a flagship still, a separate Mini still, and Giga's all-arms still
// layered over the flagship), so per-variant imagery still holds.
const BOX = { left: '-1.007%', top: '-6.747%', width: '104.28%', height: '107.65%' };
const GIGA_BOX = { left: '-1.998%', top: '6.546%', width: '104.08%', height: '95.36%' };

const BLOCKS = [
  {
    renderTop: '5.103%',
    copyTop: '11.409%',
    layers: [
      { src: DesignFlagship, box: BOX, crop: { left: '-99.62%', top: '0.02%', width: '284.68%', height: '155.21%' } },
    ],
  },
  {
    renderTop: '38.339%',
    copyTop: '44.646%',
    layers: [
      { src: DesignMini, box: BOX, crop: { left: '-117.68%', top: '-29.11%', width: '330.64%', height: '180.16%' } },
    ],
  },
  {
    renderTop: '72.945%',
    copyTop: '79.251%',
    layers: [
      { src: DesignFlagship, box: BOX, crop: { left: '-99.62%', top: '0.02%', width: '284.68%', height: '155.21%' } },
      { src: DesignGigaAllArms, box: GIGA_BOX, crop: { left: '-86.42%', top: '-21.73%', width: '266.34%', height: '163.52%' } },
    ],
  },
];

// One image node: the fill cropped inside its frame, then the design's fade to
// black from 65% down. Every render layer in the file is built this way.
const RenderLayer = ({ layer, alt }) => (
  <div className="absolute" style={layer.box}>
    <div className="absolute inset-0 overflow-hidden">
      <img src={layer.src} alt={alt || ''} aria-hidden={alt ? undefined : true} className="absolute max-w-none" style={layer.crop} />
    </div>
    <div aria-hidden className="absolute inset-0 bg-orb-render-fade" />
  </div>
);

// The lens sits in a 797.946px square against the render's 504.41px circle, so
// it is 158.20% of the render. Their centres are 2.27px apart horizontally and
// 13.78px vertically, which is where the 49.55%/47.27% comes from — centring it
// on the render would sit it 14px too low.
const Lens = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute left-[49.55%] top-[47.27%] flex aspect-square
               w-[158.2%] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
  >
    <img src={LensA} alt="" className="absolute h-[82.03%] w-[59.39%] rotate-45" />
    <img src={LensB} alt="" className="absolute h-[82.03%] w-[59.39%] -scale-y-100 rotate-[135deg]" />
  </div>
);

// Each arm keeps its own render (mini / giga rather than the flagship), which is
// where this departs from the file: the design reuses the same ORA_Crouched
// still for the flagship and Mini, and layers an ALL_ARMS still over it for Giga.
const ArmBlock = ({ arm, block }) => (
  <div
    className="flex flex-col gap-10 px-6 py-16 md:px-10 lg:absolute lg:inset-0 lg:block lg:p-0"
    style={{ '--render-top': block.renderTop, '--copy-top': block.copyTop }}
  >
    <div
      id={arm.id}
      className="flex flex-col gap-[26px] lg:absolute lg:left-[11.16%] lg:top-[var(--copy-top)]
                 lg:w-[28.45%]"
    >
      <p className="font-plex text-orb-eyebrow uppercase text-orb-accent">{arm.eyebrow}</p>
      <h2 className="font-sohne font-normal text-orb-h2 text-orb-text lg:whitespace-nowrap">
        {arm.name}
      </h2>
      <p className="font-sohne text-orb-body text-orb-text opacity-70">{arm.blurb}</p>
    </div>

    <div
      className="relative mx-auto aspect-square w-full max-w-[504px] lg:absolute lg:left-[48.4%]
                 lg:top-[var(--render-top)] lg:mx-0 lg:w-[35.17%] lg:max-w-none"
    >
      <Lens />
      <div className="absolute inset-0 overflow-hidden rounded-full">
        {block.layers.map((layer, i) => (
          <RenderLayer key={layer.src} layer={layer} alt={i === 0 ? arm.name : ''} />
        ))}
      </div>
    </div>
  </div>
);

// Frame 77 / 78 (369:1606, 369:1609): a corner tick at each end of a 1361px
// span, nothing in between. The bottom copy is the same asset rotated 180.
const Bracket = ({ className }) => (
  <img src={BracketRule} alt="" aria-hidden className={`absolute left-0 w-full ${className}`} />
);

const OrbArmDetail = () => (
  <OrbPage>
    <section
      className="relative isolate overflow-hidden bg-orb-black lg:aspect-[1440/899]"
      data-figma="291:544"
      data-figma-name="Arm hero"
    >
      <img
        src={ProductLine}
        alt="The ORA series product line."
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="relative px-6 pb-24 pt-44 md:px-10 md:pt-52
                   lg:absolute lg:left-[2.64%] lg:top-[39.49%] lg:w-[39.31%] lg:p-0"
      >
        {/* 113.898px / 100px leading. Tracking is -0.05em here, tighter than the
            shared orb-display token's -0.02em, so it is set locally. */}
        <h1 className="whitespace-nowrap font-sohne font-normal text-orb-display tracking-[-0.05em] text-orb-text">
          ORA-SERIES
        </h1>
        <p className="mt-8 max-w-[558px] font-sohne text-orb-lg text-orb-text lg:mt-[66px]">
          Enabling the next generation of space operations with autonomous robotics
        </p>
      </div>
    </section>

    <DividerGlow />

    <section className="px-6 pb-6 pt-16 md:px-10 lg:px-[2.99%] lg:pb-[11px] lg:pt-[83px]">
      <p className="max-w-[1287px] font-sohne text-orb-sub text-orb-text">
        Our robotic arms perform the physical work in orbit: capture, manipulation, and servicing.
        Paired with {SOFTWARE[1].name} for perception and {SOFTWARE[2].name} for autonomous guidance
        and control, they form a complete autonomous capture and servicing system.
      </p>
    </section>

    {/* The lens is 158% of the render it sits behind, so it needs clipping below
        lg where the render is nearly viewport-wide. */}
    <section className="overflow-hidden bg-orb-band">
      <div className="relative mx-auto w-full max-w-[1434px] lg:aspect-[1434/2410]">
        {ARMS.map((arm, i) => (
          <ArmBlock key={arm.id} arm={arm} block={BLOCKS[i]} />
        ))}
      </div>
    </section>

    <section className="px-6 py-24 md:px-10 md:py-32">
      <div className="relative mx-auto w-full max-w-[1361px] py-12 lg:aspect-[1361/351] lg:py-0">
        <Bracket className="top-0" />
        <Bracket className="bottom-0 rotate-180" />

        <div
          className="flex flex-col gap-6 lg:absolute lg:left-[3.233%] lg:top-[29.06%] lg:w-[44.6%]"
        >
          <p className="font-plex text-[clamp(1.25rem,2.22vw,2rem)] uppercase leading-[26px] tracking-[0.0625em] text-orb-text">
            SOFTWARE SYSTEM
          </p>
          <p className="font-plex text-[clamp(3.5rem,9.218vw,132.741px)] font-bold uppercase leading-[0.8125] tracking-[0.0075em] text-orb-text">
            {orbtos.name}
          </p>
        </div>

        <div
          className="mt-12 flex flex-col items-start gap-10 lg:absolute lg:left-[48.64%]
                     lg:top-[18.52%] lg:mt-0 lg:w-[51.21%]"
        >
          <h2 className="font-sohne font-normal text-orb-h2 leading-[1.15] text-orb-text">
            Built to seamlessly integrate with {orbtos.name}
          </h2>
          <OrbButton to="/products/satellite-os">LEARN</OrbButton>
        </div>
      </div>
    </section>
  </OrbPage>
);

export default OrbArmDetail;
