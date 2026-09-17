import React from 'react';
import OrbPage from '../../components/orb/OrbPage';
import { SOFTWARE } from '../../data/brand';
import OrbtosArchitecture from '../../components/orb/OrbtosArchitecture';
import Marquee from '../../components/orb/Marquee';
import NaviqDemo from '../../assets/orb/naviq-demo.png';
import NaviqSegmentation from '../../assets/video/in_space_segmentation_compressed.mp4';
import AstrapDemo from '../../assets/orb/astrap-demo.jpg';
import AstrapCubeGrasp from '../../assets/video/free-float-cube-grasp.mp4';
import CupolaEarthLimb from '../../assets/orb/cupola-earth-limb.png';

// Figma "Software" (335:409) — a 1440x6606 frame. Hero lockup, the architecture
// diagram, then a section per layer (NavIQ, then ASTRA-P).
//
// Product names come from brand.js, so this page says ORBtos and NavIQ rather
// than the design's ORBTOS and NAVIQ.
//
// The demo band is the part that was wrong before. In the design the giant
// wordmark and the still are not stacked — the wordmark bleeds past the frame on
// both sides and the still sits ON TOP of it, centred:
//
//                        watermark          still
//   NavIQ     343:993  x=-475 y=2434    343:1009  x=489 y=2465  476x434
//             w=2330 h=483              (centres: 2675.5 vs 2682)
//   ASTRA-P   343:1013 x=-248 y=3882    343:1015  x=477 y=3844  500x538
//             w=1876 h=483              (centres: 4123.5 vs 4113)
//
// So the rule is: full-bleed wordmark, vertically centred on the still, behind
// it. Both stills are centred on the frame (x+w/2 = 727 in both cases).
//
// Wordmark type is the node's own: 400px Söhne Fett, 483.003px line box,
// 17.889px tracking, 20% white. 400/1440 = 27.78vw, so it scales with the frame
// the way the design does.

const [orbtos, naviq, astrap] = SOFTWARE;

// Figma ships both demos as flat stills, but each one is a frame of footage this
// repo already carries — so they play here rather than sitting still:
//
//   NavIQ    343:1009  frame of in_space_segmentation_compressed.mp4 (1920x1080)
//   ASTRA-P  343:1015  frame of free-float-cube-grasp.mp4            (1920x1080)
//
// Both keep the design's box, so both crop the same way: each box is tighter/
// taller than the 16:9 footage, so `object-cover` fills it rather than
// letterboxing — matching how NavIQ's box already handled its own 16:9 source.
// ASTRA-P previously showed a flat Monte Carlo dispersion plot (contained on
// white, per the design's own still); swapped for real footage of the dual-arm
// free-floating capture — ASTRA-P's actual planning/control output, not just a
// plot of it — at the user's request.
const LAYERS = {
  naviq: {
    kind: 'video',
    src: NaviqSegmentation,
    // The node export, so the first paint is the design's frame.
    poster: NaviqDemo,
    width: '33.06%',
    aspect: '476 / 434',
    gapTop: 86,
    gapCaption: 30,
    gapBody: 83,
  },
  astrap: {
    kind: 'video',
    src: AstrapCubeGrasp,
    poster: AstrapDemo,
    width: '34.72%',
    aspect: '500 / 538',
    gapTop: 110,
    gapCaption: 42,
    gapBody: 107,
  },
};

const DEMO = 'relative z-10 mx-auto block w-[70%] lg:w-[var(--demo-w)]';

const Demo = ({ layer, caption }) =>
  layer.kind === 'video' ? (
    <video
      src={layer.src}
      poster={layer.poster}
      autoPlay
      loop
      muted
      playsInline
      aria-label={caption}
      className={`${DEMO} object-cover`}
      style={{ '--demo-w': layer.width, aspectRatio: layer.aspect }}
    />
  ) : (
    <img
      src={layer.src}
      alt={caption}
      className={`${DEMO} bg-white object-contain`}
      style={{ '--demo-w': layer.width, aspectRatio: layer.aspect }}
    />
  );

// Scrolls at the shared MARQUEE_SPEED, same as the hardware wordmark, so every
// oversized word on the site moves at one pace.
//
// Held to the content column rather than the viewport, matching the hardware
// wordmark on the landing page: the track's fade then lands on the same gutter as
// every other section instead of running to the screen edge. This is a departure
// from the design, which bleeds the wordmark past the frame on both sides.
//
// Type is capped at its 1440 value for the same reason the width is: past that the
// column stops growing, so an uncapped 27.78vw just inflated the glyphs against a
// fixed box.
const Watermark = ({ children }) => (
  <Marquee className="pointer-events-none absolute left-1/2 top-1/2 w-full max-w-[1362px] -translate-x-1/2 -translate-y-1/2">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        aria-hidden
        className="select-none whitespace-nowrap px-[0.14em] font-sohne text-[min(27.78vw,400px)] font-bold
                   uppercase leading-[1.2075] tracking-[0.0447em] text-white opacity-20"
      >
        {children}
      </span>
    ))}
  </Marquee>
);

const Layer = ({ eyebrow, headline, blurb, body, watermark, caption, layer }) => (
  <section className="overflow-hidden py-20 md:py-28">
    <div className="mx-auto max-w-[1372px] px-6 md:px-10">
      <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
        <div className="max-w-[696px]">
          <p className="font-plex text-orb-eyebrow uppercase text-orb-accent">{eyebrow}</p>
          <h2 className="mt-6 font-sohne font-normal text-orb-h1 text-orb-text">{headline}</h2>
        </div>
        <p className="max-w-[496px] font-sohne text-orb-body text-orb-text opacity-70">{blurb}</p>
      </div>
    </div>

    {/* Demo band. Sits outside the content column so the still's width resolves
        against the design's 1440 frame and the wordmark can bleed past it. */}
    <div
      className="relative mx-auto w-full max-w-[1440px]"
      style={{ marginTop: layer.gapTop }}
    >
      <Watermark>{watermark}</Watermark>
      <Demo layer={layer} caption={caption} />
    </div>

    <div className="mx-auto max-w-[1372px] px-6 md:px-10">
      <p
        className="text-center font-plex text-orb-label uppercase text-orb-text"
        style={{ marginTop: layer.gapCaption }}
      >
        {caption}
      </p>
      <p
        className="max-w-[1361px] font-sohne text-orb-lg leading-[1.6] text-orb-text"
        style={{ marginTop: layer.gapBody }}
      >
        {body}
      </p>
    </div>
  </section>
);

// Decorative cluster behind the intro line — Figma 337:666/667 (two plain
// 780px-diameter rings, offset vertically by ~124.6px, overlapping in a Venn
// pair rather than the rotated-ellipse lens OrbCtaBand uses further down),
// 337:669 (a circular photo, cupola window on Earth's limb), and dots
// 348:1028/348:1030. Positioned absolute against the section itself (top:0 =
// the section's own top edge, right after the architecture diagram at Figma
// y=1295), so every offset below is simply the node's own y minus 1295. Left
// un-clipped so it bleeds into the NavIQ heading beneath it, exactly as the
// design does.
const IntroRings = () => (
  <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 mx-auto hidden max-w-[1440px] lg:block">
    {/* 337:666 and 337:667 are one 463.31 x 639.86 ellipse drawn twice, co-centred
        on the cupola at -/+45deg; the 780px square Figma reports is their rotated
        bounding box, so reading it as a circle drew them oversized and 330px too
        low. Each stroke is a gradient down the ellipse's own axis — the same
        treatment the CTA band's lens uses, and the reason a flat border read far
        too faint at the bright tip. */}
    <svg
      viewBox="0 0 780.054 780.054"
      fill="none"
      className="absolute left-[46.11%] top-[45.4px] aspect-square w-[54.17%]"
    >
      <defs>
        <linearGradient id="orb-intro-lens" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop stopColor="#D9D9D9" />
          <stop offset="1" stopColor="#161616" />
        </linearGradient>
      </defs>
      <ellipse
        cx="390.027"
        cy="390.027"
        rx="231.655"
        ry="319.93"
        stroke="url(#orb-intro-lens)"
        vectorEffect="non-scaling-stroke"
        transform="rotate(-45 390.027 390.027)"
      />
      <ellipse
        cx="390.027"
        cy="390.027"
        rx="231.655"
        ry="319.93"
        stroke="url(#orb-intro-lens)"
        vectorEffect="non-scaling-stroke"
        transform="rotate(45 390.027 390.027)"
      />
    </svg>
    <img
      src={CupolaEarthLimb}
      alt=""
      loading="lazy"
      className="absolute left-[59.79%] top-[238px] w-[26.94%] rounded-full object-cover"
    />
    <span className="absolute left-[55.56%] top-[209px] aspect-square w-[2.08%] rounded-full bg-white" />
    <span className="absolute left-[91.32%] top-[549px] aspect-square w-[2.08%] rounded-full bg-white" />
  </div>
);

const OrbSoftware = () => (
  <OrbPage>
    <section className="px-6 pb-16 pt-44 md:px-10 md:pt-52">
      <div className="mx-auto max-w-[1362px]">
        <h1 className="font-sohne font-normal text-orb-display text-orb-text">
          {orbtos.name} System
        </h1>
        <p className="mt-9 max-w-[1044px] font-sohne text-orb-lead text-orb-text">
          {orbtos.name} runs {naviq.name} (perception) and {astrap.name} (autonomous guidance and
          control) as native modules
        </p>
      </div>
    </section>

    {/* Architecture diagram — Figma 335:451, rebuilt as real DOM from the node
        tree (glass cards, pills, lockup) rather than pasted in as a flat export,
        so the labels are live text and use brand.js casing. */}
    <OrbtosArchitecture />

    {/* Figma leaves 328px above this line and 332px below it (diagram bottom
        1295 -> paragraph 1623 -> NavIQ heading 2129) before the rings and the
        cupola photo bleed in behind the text. IntroRings only shows at lg (see
        below), so the big gap is lg-only too — smaller screens keep the plain
        py-16 they had before. */}
    {/* overflow-x-clip, not hidden: IntroRings' box spans 100.28% of the frame
        (left 46.11% + width 54.17%), which put a 4px horizontal scrollbar on the
        page. Its visible ink stops 107px short of that edge, so clipping x costs
        nothing, while clip (unlike hidden) leaves the y bleed into the section
        below intact. */}
    <section className="relative overflow-x-clip px-6 py-16 md:px-10 lg:pb-[332px] lg:pt-[328px]">
      <IntroRings />
      <div className="relative mx-auto max-w-[1362px]">
        <p className="max-w-[659px] font-sohne text-orb-lead text-orb-text">
          Let any spacecraft bus run the full Orbital Robotics autonomous stack with minimal
          integration.
        </p>
      </div>
    </section>

    <Layer
      eyebrow={naviq.name}
      headline="Vision and perception"
      blurb="Our computer vision software. Estimates the position and motion of any unprepared satellite or debris object from stereo vision alone."
      body={naviq.long}
      watermark={naviq.name}
      caption={`${naviq.name} segmenting an unprepared target in orbit.`}
      layer={LAYERS.naviq}
    />

    <Layer
      eyebrow={astrap.name}
      headline="Autonomous movement + control"
      blurb={`Our autonomous guidance and control software. Takes ${naviq.name}'s state estimate and plans the capture maneuver.`}
      body={astrap.long}
      watermark={astrap.name}
      caption={`${astrap.name} executing a planned approach.`}
      layer={LAYERS.astrap}
    />
  </OrbPage>
);

export default OrbSoftware;
