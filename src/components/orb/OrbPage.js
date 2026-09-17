import React from 'react';
import OrbNav from './OrbNav';
import OrbFooter from './OrbFooter';
import OrbCtaBand from './OrbCtaBand';

// Every redesigned page has the same shell: nav, content, the "Have a target in
// orbit?" band, footer. Pages that need a different closing CTA (Careers uses
// "Don't see your role?") pass `cta` instead of relying on the default.

const OrbPage = ({ children, cta }) => (
  <div className="min-h-screen bg-orb-bg">
    <OrbNav />
    {children}
    {cta === null ? null : cta || <OrbCtaBand />}
    <OrbFooter />
  </div>
);

export default OrbPage;
