import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import PageTransition from './components/motion/PageTransition';
import Home from './pages/Home';
import Products from './pages/Products';
// import Roadmap from './pages/Roadmap'; // Roadmap page hidden — re-enable to bring it back
import Team from './pages/Team';
import Contact from './pages/Contact';
import News from './pages/News';
import ProductDetail from './pages/ProductDetail';
import StarcloudAnnouncement from './pages/news/StarcloudAnnouncement';
import TechCrunchAnnouncement from './pages/news/TechCrunchAnnouncement';
import SaveHubble from './pages/news/SaveHubble';
import './styles/global.css';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
        <Route path="/products/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
        {/* <Route path="/roadmap" element={<PageTransition><Roadmap /></PageTransition>} /> */}
        <Route path="/team" element={<PageTransition><Team /></PageTransition>} />
        <Route path="/news" element={<PageTransition><News /></PageTransition>} />
        <Route path="/news/starcloud-partnership" element={<PageTransition><StarcloudAnnouncement /></PageTransition>} />
        <Route path="/news/techcrunch-disrupt" element={<PageTransition><TechCrunchAnnouncement /></PageTransition>} />
        <Route path="/news/save-hubble" element={<PageTransition><SaveHubble /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
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
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </MotionConfig>
    </HashRouter>
  );
}

export default App;
