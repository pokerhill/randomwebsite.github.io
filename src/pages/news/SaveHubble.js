import React from 'react';
import { Link } from 'react-router-dom';
import ArticleLayout from '../../components/ArticleLayout';
import SaveHubblePreview from '../../assets/images/news/save_hubble_preview.png';
import SaveHubbleRoboticArm from '../../assets/images/news/save_hubble_robotic_arm.png';
import SaveHubbleServicing from '../../assets/images/news/save_hubble_servicing.png';

const SaveHubble = () => (
  <ArticleLayout
    title="Save Hubble Coalition"
    description="Join the Save Hubble Coalition — a collaborative effort to preserve one of humanity's greatest scientific achievements through innovative on-orbit servicing."
    source="Orbital Robotics"
    date="January 2026"
    dateTime="2026-01-01"
    heroImage={SaveHubblePreview}
  >
    <p className="lead">
      The Hubble Space Telescope has been humanity's eye on the universe for over three decades. Now, it needs our help
      to continue its groundbreaking mission.
    </p>

    <h2>The Challenge</h2>
    <p>
      An increase in solar activity has caused the Hubble Space Telescope to drift lower in orbit than previously
      expected. Without intervention, Hubble will re-enter the atmosphere, posing a significant risk. Previous studies
      determined there is a 1:240 chance of a fatal scenario during uncontrolled reentry, as many of the telescope's
      large components will not burn up completely.
    </p>
    <p>
      Current analysis shows Hubble's perigee could reach critical altitude (400 km) as early as December 2027 in
      worst-case scenarios, or November 2028 nominally. Urgent action is needed to capture and boost the telescope before
      this window closes.
    </p>

    <h2>Our Mission Approach</h2>
    <p>
      Orbital Robotics is developing a low-cost, non-invasive servicing mission to save Hubble. Our approach involves
      softly docking with Hubble using autonomous robotic arms and the existing Soft Capture Mechanism (SCM), then
      boosting it to a higher, stable orbit. We also plan to mount star trackers to provide attitude determination,
      replacing the faulty gyroscopes.
    </p>
    <p>
      The mission utilizes a commercially available spacecraft bus combined with Orbital Robotics' proprietary 1-meter,
      7-degree-of-freedom robotic arms and AI-powered guidance and control systems. Our patent-pending neural network
      approach provides safety-critical autonomous control while maintaining the verification standards required for
      space missions.
    </p>

    <h2>Key Technologies</h2>
    <ul>
      <li>
        <strong>ASTRA-P Guidance &amp; Control:</strong> Patent-pending AI-powered system designed for highly dynamic
        scenarios including capturing tumbling spacecraft
      </li>
      <li>
        <strong>NavIQ Perception:</strong> Vision-based navigation for six-degree-of-freedom pose estimation with ±3 cm
        accuracy
      </li>
      <li>
        <strong>Autonomous Robotic Arms:</strong> 1-meter, 7-DOF arms scheduled for on-orbit testing in 2026
      </li>
      <li>
        <strong>Star Tracker Payload:</strong> Four star trackers with solar panels for independent attitude
        determination
      </li>
    </ul>

    <h2>Expert Advisory Team</h2>
    <p>This mission concept has been developed with guidance from an exceptional team of advisors, including:</p>
    <ul>
      <li>
        <strong>Dr. John Grunsfeld:</strong> NASA astronaut with five missions including three Hubble servicing missions
      </li>
      <li>
        <strong>Michael Good:</strong> NASA astronaut with two missions including the final Hubble servicing mission
        (SM4)
      </li>
      <li>
        <strong>Dr. Gordon Roesler:</strong> Program manager for DARPA's Robotic Servicing of Geosynchronous Satellites
        Program
      </li>
      <li>
        <strong>Chris Sembroski:</strong> Commercial astronaut on the Inspiration4 mission
      </li>
    </ul>

    <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
      <img src={SaveHubbleRoboticArm} alt="Robotic arm servicing Hubble" loading="lazy" className="rounded-xl border border-white/10 shadow-elev-2" />
      <img src={SaveHubbleServicing} alt="Hubble servicing mission" loading="lazy" className="rounded-xl border border-white/10 shadow-elev-2" />
    </div>

    <div className="not-prose bg-gradient-to-r from-primary/15 to-accent/10 rounded-2xl p-8 mt-12 border border-primary/30">
      <h3 className="text-2xl font-bold text-white mb-4">Join the Save Hubble Coalition</h3>
      <p className="text-text-secondary mb-6">
        Join our LinkedIn group to stay up to date on mission developments and connect with others passionate about
        preserving Hubble. If you have expertise, resources, or services that could support this mission, we'd love to
        hear from you.
      </p>
      <div className="flex flex-wrap gap-4">
        <a
          href="https://www.linkedin.com/groups/16897016/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-[#0077B5] hover:bg-[#005885] text-white font-bold rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          Stay Updated on LinkedIn
        </a>
        <Link
          to="/contact"
          className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-colors"
        >
          Offer Your Support
          <span className="ml-2">→</span>
        </Link>
      </div>
    </div>
  </ArticleLayout>
);

export default SaveHubble;
