import React from 'react';
import CollageLab from '../../../assets/orb/collage-lab.png';
import CollageLabVideo from '../../../assets/video/ai_view_ar3_catch.mp4';
import CollageArm from '../../../assets/orb/collage-arm.png';
import CollageSegmentation from '../../../assets/orb/collage-segmentation.png';
import PanelLeft from '../../../assets/orb/panel-left.png';
import PanelRight from '../../../assets/orb/panel-right.png';
import { SOFTWARE } from '../../../data/brand';

// Figma 145:102 "Group 3" — 1220x829 at x=109 y=4242.
//
// Every position below is the node's own coordinate from the file, converted to a
// percentage of the group box, so the composition scales instead of being
// eyeballed. Earlier passes placed the collage near the top; it actually occupies
// the lower half (images start at y=367 of 829).
//
//   text          Frame 11     121:195  left 15.00%  top  0.00%  w 72.70%
//   panel-left    Rectangle 19 114:163  left  0.00%  top 58.99%  w 19.84%  h 30.64%
//   earth         Rectangle 20 114:164  left 16.48%  top 69.12%  w 26.07%  h 30.88%
//   lab           Container    114:160  left 30.98%  top 44.27%  w 38.52%  h 37.39%
//   panel-right   Rectangle 23 114:166  left 58.61%  top 62.85%  w 32.46%  h 32.33%
//   arm           Rectangle 20 114:162  left 77.05%  top 48.97%  w 22.95%  h 32.33%
//
// The two blue panels are exported image nodes (dot-matrix screens with their own
// brightness falloff), not the CSS dot grid a previous pass approximated.
//
// Stacking, back to front, matches the file's layer order: panel-right, arm,
// panel-left, earth, lab. The lab is the topmost node, so it clips the earth
// shot's upper-right corner rather than the other way round.

const naviq = SOFTWARE[1];

const NextFrontier = () => (
  <section className="overflow-hidden bg-orb-bg px-6 py-28 md:px-10 md:py-36">
    <div
      className="relative mx-auto w-full max-w-[1220px] lg:aspect-[1220/829]"
      data-figma="145:102"
      data-figma-name="The next frontier"
    >
      {/* Copy block */}
      <div className="text-center lg:absolute lg:left-[15%] lg:top-0 lg:w-[72.7%]">
        <p className="font-plex text-orb-eyebrow uppercase text-orb-accent">THE NEXT FRONTIER</p>
        <h2 className="mx-auto mt-6 max-w-[720px] font-sohne font-normal text-orb-h2 text-orb-text">
          Creating the possibility of dexterity in space
        </h2>
        <p className="mx-auto mt-6 font-sohne text-orb-body text-orb-text opacity-70">
          The same capture, twice: the raw simulation feed, and the identical moment through{' '}
          {naviq.name}&rsquo;s perception — segmentation, tracking, and state estimation of an
          unprepared target.
        </p>
      </div>

      {/* Collage. Flow-stacked below lg; at lg it fills the aspect box so each
          child's top/height percentage resolves against the design's 829px height. */}
      <div className="relative mt-14 aspect-[1220/470] lg:absolute lg:inset-0 lg:mt-0 lg:aspect-auto">
        <img
          src={PanelLeft}
          alt=""
          aria-hidden
          className="absolute left-0 top-[38%] w-[19.84%] lg:top-[58.99%] lg:h-[30.64%]"
        />
        <img
          src={PanelRight}
          alt=""
          aria-hidden
          className="absolute left-[58.61%] top-[45%] w-[32.46%] lg:top-[62.85%] lg:h-[32.33%]"
        />

        {/* The one moving panel in the collage. Same lab scene the still was cut
            from, kept greyscale so it reads as one composition with the other
            two, which stay stills. */}
        <video
          src={CollageLabVideo}
          poster={CollageLab}
          autoPlay
          loop
          muted
          playsInline
          aria-label="Flight hardware on the bench in the Seattle lab."
          className="absolute left-[30.98%] top-[8%] z-30 w-[38.52%] object-cover grayscale lg:top-[44.27%] lg:h-[37.39%]"
        />
        <img
          src={CollageArm}
          alt="A development arm manipulating a target mock-up."
          className="absolute left-[77.05%] top-[20%] z-20 w-[22.95%] object-cover lg:top-[48.97%] lg:h-[32.33%]"
        />
        <img
          src={CollageSegmentation}
          alt={`${naviq.name} segmenting an unprepared target against Earth.`}
          className="absolute left-[16.48%] top-[52%] z-20 w-[26.07%] object-cover lg:top-[69.12%] lg:h-[30.88%]"
        />
      </div>
    </div>
  </section>
);

export default NextFrontier;
