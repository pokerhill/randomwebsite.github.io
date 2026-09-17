import React from 'react';
import { FaLinkedinIn } from 'react-icons/fa';
import OrbArticle, { H2, H3, Li, P, Ul } from '../../../components/orb/OrbArticle';
import OrbButton from '../../../components/orb/OrbButton';
import SaveHubblePreview from '../../../assets/images/news/save_hubble_preview.png';
import SaveHubbleRoboticArm from '../../../assets/images/news/save_hubble_robotic_arm.png';
import SaveHubbleServicing from '../../../assets/images/news/save_hubble_servicing.png';

// Ported verbatim from the pre-redesign src/pages/news/SaveHubble.js. The
// closing coalition box reuses this site's own button language (OrbButton,
// the LinkedIn icon treatment from OrbFooter/OrbContact) rather than the old
// page's custom blue/primary-gradient buttons, which don't exist as tokens
// here — same content and both destinations, restyled to match.

const OrbSaveHubble = () => (
  <OrbArticle
    eyebrow="Orbital Robotics"
    title="Save Hubble Coalition"
    date="January 2026"
    dateTime="2026-01-01"
    heroImage={SaveHubblePreview}
  >
    <P>
      The Hubble Space Telescope has been humanity&rsquo;s eye on the universe for over three decades.
      Now, it needs our help to continue its groundbreaking mission.
    </P>

    <div className="flex flex-col gap-5">
      <H2>The Challenge</H2>
      <P>
        An increase in solar activity has caused the Hubble Space Telescope to drift lower in orbit than
        previously expected. Without intervention, Hubble will re-enter the atmosphere, posing a
        significant risk. Previous studies determined there is a 1:240 chance of a fatal scenario during
        uncontrolled reentry, as many of the telescope&rsquo;s large components will not burn up
        completely.
      </P>
      <P>
        Current analysis shows Hubble&rsquo;s perigee could reach critical altitude (400 km) as early as
        December 2027 in worst-case scenarios, or November 2028 nominally. Urgent action is needed to
        capture and boost the telescope before this window closes.
      </P>
    </div>

    <div className="flex flex-col gap-5">
      <H2>Our Mission Approach</H2>
      <P>
        Orbital Robotics is developing a low-cost, non-invasive servicing mission to save Hubble. Our
        approach involves softly docking with Hubble using autonomous robotic arms and the existing Soft
        Capture Mechanism (SCM), then boosting it to a higher, stable orbit. We also plan to mount star
        trackers to provide attitude determination, replacing the faulty gyroscopes.
      </P>
      <P>
        The mission utilizes a commercially available spacecraft bus combined with Orbital Robotics&rsquo;
        proprietary 1-meter, 7-degree-of-freedom robotic arms and AI-powered guidance and control
        systems. Our patent-pending neural network approach provides safety-critical autonomous control
        while maintaining the verification standards required for space missions.
      </P>
    </div>

    <div className="flex flex-col gap-5">
      <H2>Key Technologies</H2>
      <Ul>
        <Li>
          <strong className="text-orb-text">ASTRA-P Guidance &amp; Control:</strong> Patent-pending
          AI-powered system designed for highly dynamic scenarios including capturing tumbling spacecraft
        </Li>
        <Li>
          <strong className="text-orb-text">NavIQ Perception:</strong> Vision-based navigation for
          six-degree-of-freedom pose estimation with &plusmn;3 cm accuracy
        </Li>
        <Li>
          <strong className="text-orb-text">Autonomous Robotic Arms:</strong> 1-meter, 7-DOF arms
          scheduled for on-orbit testing in 2026
        </Li>
        <Li>
          <strong className="text-orb-text">Star Tracker Payload:</strong> Four star trackers with solar
          panels for independent attitude determination
        </Li>
      </Ul>
    </div>

    <div className="flex flex-col gap-5">
      <H2>Expert Advisory Team</H2>
      <P>
        This mission concept has been developed with guidance from an exceptional team of advisors,
        including:
      </P>
      <Ul>
        <Li>
          <strong className="text-orb-text">Dr. John Grunsfeld:</strong> NASA astronaut with five
          missions including three Hubble servicing missions
        </Li>
        <Li>
          <strong className="text-orb-text">Michael Good:</strong> NASA astronaut with two missions
          including the final Hubble servicing mission (SM4)
        </Li>
        <Li>
          <strong className="text-orb-text">Dr. Gordon Roesler:</strong> Program manager for DARPA&rsquo;s
          Robotic Servicing of Geosynchronous Satellites Program
        </Li>
        <Li>
          <strong className="text-orb-text">Chris Sembroski:</strong> Commercial astronaut on the
          Inspiration4 mission
        </Li>
      </Ul>
    </div>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <img
        src={SaveHubbleRoboticArm}
        alt="Robotic arm servicing Hubble"
        loading="lazy"
        className="rounded-sm border border-white/10"
      />
      <img
        src={SaveHubbleServicing}
        alt="Hubble servicing mission"
        loading="lazy"
        className="rounded-sm border border-white/10"
      />
    </div>

    <div className="rounded-2xl border border-orb-accent/25 bg-gradient-to-r from-orb-accent/15 to-orb-accent/5 p-8">
      <H3>Join the Save Hubble Coalition</H3>
      <p className="mt-4 font-sohne text-orb-body leading-[1.6] text-orb-text opacity-70">
        Join our LinkedIn group to stay up to date on mission developments and connect with others
        passionate about preserving Hubble. If you have expertise, resources, or services that could
        support this mission, we&rsquo;d love to hear from you.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <a
          href="https://www.linkedin.com/groups/16897016/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 border-x border-orb-btn-border px-6 py-3 font-sohne text-orb-btn uppercase text-orb-text transition-colors hover:bg-white hover:text-orb-bg"
        >
          <FaLinkedinIn />
          Stay Updated on LinkedIn
        </a>
        <OrbButton to="/contact" variant="solid">
          Offer Your Support
        </OrbButton>
      </div>
    </div>
  </OrbArticle>
);

export default OrbSaveHubble;
