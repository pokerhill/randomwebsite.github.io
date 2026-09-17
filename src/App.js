import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import PageTransition from './components/motion/PageTransition';
import Products from './pages/Products';
// import Roadmap from './pages/Roadmap'; // Roadmap page hidden — re-enable to bring it back
import ProductDetail from './pages/ProductDetail';
import OrbLanding from './pages/OrbLanding';
import OrbTeam from './pages/orb/OrbTeam';
import OrbCareers from './pages/orb/OrbCareers';
import OrbJobDetail from './pages/orb/OrbJobDetail';
import OrbThankYou from './pages/orb/OrbThankYou';
import OrbSoftware from './pages/orb/OrbSoftware';
import OrbArmDetail from './pages/orb/OrbArmDetail';
import OrbNews from './pages/orb/OrbNews';
import OrbContact from './pages/orb/OrbContact';
import OrbStarcloudAnnouncement from './pages/orb/news/OrbStarcloudAnnouncement';
import OrbTechCrunchAnnouncement from './pages/orb/news/OrbTechCrunchAnnouncement';
import OrbSaveHubble from './pages/orb/news/OrbSaveHubble';
import OrbPreview from './pages/OrbPreview';
import './styles/global.css';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Products/ProductDetail are the old generic product index — still
            load-bearing (not "/legacy-*"): nothing in the redesign links to it
            since Hero's "SEE SYSTEM" now points at /products/satellite-os, but
            it's a real, independently-reachable page, not a reviewer's
            reference copy, so it isn't part of this cleanup pass. */}
        <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
        <Route path="/products/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
        {/* <Route path="/roadmap" element={<PageTransition><Roadmap /></PageTransition>} /> */}
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <HashRouter>
      {/* reducedMotion="user" makes every Framer Motion animation honor the
          OS "Reduce Motion" setting (transforms disabled, opacity kept). */}
      <MotionConfig reducedMotion="user">
        <ScrollToTop />
        {/* The redesign pages ship their own nav and footer, so they render
            outside Layout rather than nesting a second set of chrome.
            The redesigned landing page is the root route, and /orb-tokens is
            the palette + type + component reference sheet. Home.js, Team.js,
            Contact.js, News.js and their /legacy-* routes are gone — fully
            superseded, nothing left pointed at them. */}
        <Routes>
          <Route path="/" element={<OrbLanding />} />
          <Route path="/orb-preview" element={<OrbLanding />} />
          <Route path="/orb-tokens" element={<OrbPreview />} />
          <Route path="/team" element={<OrbTeam />} />
          <Route path="/careers" element={<OrbCareers />} />
          <Route path="/careers/thankyou" element={<OrbThankYou />} />
          <Route path="/careers/:role" element={<OrbJobDetail />} />
          <Route path="/products/satellite-os" element={<OrbSoftware />} />
          <Route path="/products/robotic-arms" element={<OrbArmDetail />} />
          <Route path="/news" element={<OrbNews />} />
          <Route path="/news/starcloud-partnership" element={<OrbStarcloudAnnouncement />} />
          <Route path="/news/techcrunch-disrupt" element={<OrbTechCrunchAnnouncement />} />
          <Route path="/news/save-hubble" element={<OrbSaveHubble />} />
          <Route path="/contact" element={<OrbContact />} />
          <Route
            path="/*"
            element={
              <Layout>
                <AnimatedRoutes />
              </Layout>
            }
          />
        </Routes>
      </MotionConfig>
    </HashRouter>
  );
}

export default App;
