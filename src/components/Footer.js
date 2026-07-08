import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedinIn } from 'react-icons/fa';
import Logo from '../assets/images/logo_white.png';

// Ground-station clock: T+ elapsed since page load.
const useMissionClock = () => {
  const [start] = useState(() => Date.now());
  const [now, setNow] = useState(start);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const t = Math.floor((now - start) / 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return `T+${pad(Math.floor(t / 3600))}:${pad(Math.floor((t % 3600) / 60))}:${pad(t % 60)}`;
};

const RadarSweep = () => (
  <div className="relative w-16 h-16 rounded-full border hairline overflow-hidden" aria-hidden>
    <div className="absolute inset-2 rounded-full border border-white/[0.06]" />
    <div className="absolute inset-5 rounded-full border border-white/[0.06]" />
    <div className="absolute inset-0 animate-radar-sweep">
      <div className="absolute top-1/2 left-1/2 w-1/2 h-px bg-gradient-to-r from-accent/80 to-transparent origin-left" />
    </div>
    <div className="absolute top-1/2 left-1/2 w-1 h-1 -ml-0.5 -mt-0.5 rounded-full bg-accent/80" />
  </div>
);

const Footer = () => {
  const clock = useMissionClock();

  return (
    <footer className="bg-surface relative overflow-hidden border-t hairline">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img src={Logo} alt="Orbital Robotics" className="h-10 mb-4" />
            <p className="text-text-secondary text-sm leading-relaxed">
              Autonomous robotic arms for in-space capture, servicing, and assembly.
            </p>
          </div>

          {/* Systems */}
          <div>
            <h4 className="type-mono-label text-text-muted mb-4">SYSTEMS</h4>
            <ul className="space-y-3">
              <li><Link to="/products/robotic-arms" className="text-text-secondary hover:text-accent transition-colors text-sm">Robotic Arms</Link></li>
              <li><Link to="/products/astrobot" className="text-text-secondary hover:text-accent transition-colors text-sm">AstroBot</Link></li>
              <li><Link to="/products/astrap" className="text-text-secondary hover:text-accent transition-colors text-sm">ASTRA-P</Link></li>
              <li><Link to="/products/naviq" className="text-text-secondary hover:text-accent transition-colors text-sm">NavIQ</Link></li>
              <li><Link to="/products/satellite-os" className="text-text-secondary hover:text-accent transition-colors text-sm">ORBtos</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="type-mono-label text-text-muted mb-4">COMPANY</h4>
            <ul className="space-y-3">
              <li><Link to="/team" className="text-text-secondary hover:text-accent transition-colors text-sm">Crew</Link></li>
              <li><Link to="/news" className="text-text-secondary hover:text-accent transition-colors text-sm">Mission Log</Link></li>
              <li><Link to="/contact" className="text-text-secondary hover:text-accent transition-colors text-sm">First Contact</Link></li>
            </ul>
          </div>

          {/* Ground station */}
          <div>
            <h4 className="type-mono-label text-text-muted mb-4">GROUND STATION</h4>
            <div className="flex items-start gap-4">
              <RadarSweep />
              <div className="font-mono text-micro tracking-[0.14em] text-text-secondary space-y-1.5 uppercase">
                <p>SEATTLE — 47.6062 N, 122.3321 W</p>
                <p>info@orbital-robots.com</p>
                <p className="text-accent tabular-nums">{clock}</p>
              </div>
            </div>
            <div className="flex space-x-4 mt-5">
              <a
                href="https://www.linkedin.com/company/orbital-robotics-corp/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Orbital Robotics on LinkedIn"
                className="w-10 h-10 border hairline flex items-center justify-center text-text-secondary hover:text-white hover:border-white/[0.16] transition-all"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t hairline flex flex-wrap items-baseline justify-between gap-2">
          <p className="type-mono-label text-text-faint">
            © {new Date().getFullYear()} ORBITAL ROBOTICS — ALL RIGHTS RESERVED
          </p>
          <p className="type-mono-label text-text-faint">ALL MISSION MEDIA: SIMULATION</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
