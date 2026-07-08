import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigationType } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import AnimatedSection from '../components/motion/AnimatedSection';
import { Button, SectionHeader, CornerBrackets } from '../components/ui';
import OrbtosConsole from '../components/OrbtosConsole';
import { services, hardwareProducts, softwareProducts } from '../data/productsData';

// Catalog IDs: the mono designation column of the index.
const CATALOG_IDS = {
  'robotic-arms': 'ORA',
  astrobot: 'ASTROBOT',
  'satellite-os': 'ORBTOS',
  naviq: 'NAV-IQ',
  astrap: 'ASTRA-P',
  'rpoc-service': 'SVC-RPOC',
  'de-orbit-service': 'SVC-DEORB',
};

const StatusChip = ({ product }) => {
  if (product.availability) {
    return (
      <span className="type-mono-label text-ember border border-ember/40 bg-ember-subtle px-3 py-1.5 whitespace-nowrap">
        {product.availability} — BOOKING
      </span>
    );
  }
  return (
    <span className="type-mono-label text-text-muted border hairline px-3 py-1.5 whitespace-nowrap">
      IN DEVELOPMENT
    </span>
  );
};

const DossierMedia = ({ product }) => {
  const { image, video, videos, imageFit = 'cover', imageBg = '', videoFit = 'cover', videoPosition = 'center' } = product;
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);

  const handleVideoEnded = () => {
    if (videos && videos.length > 1) {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }
  };

  useEffect(() => {
    if (videoRef.current && videos && videos.length > 0) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentVideoIndex, videos]);

  const activeVideo = videos ? videos[currentVideoIndex] : video;
  if (product.console) {
    return (
      <div className="md:w-64 shrink-0 overflow-hidden">
        <OrbtosConsole />
      </div>
    );
  }
  if (!activeVideo && !image) return null;

  return (
    <div className="relative overflow-hidden border hairline bg-black aspect-video md:aspect-[4/3] md:w-64 shrink-0">
      {activeVideo ? (
        <video
          ref={videoRef}
          src={activeVideo}
          autoPlay
          loop={!videos}
          muted
          playsInline
          preload="metadata"
          onEnded={handleVideoEnded}
          className={`w-full h-full object-${videoFit}`}
          style={{ objectPosition: videoPosition }}
        />
      ) : (
        <img src={image} alt={product.title} loading="lazy" className={`w-full h-full object-${imageFit} ${imageBg}`} />
      )}
      <span className="absolute bottom-1.5 left-1.5 type-mono-label text-text-faint bg-black/60 px-1.5 py-0.5 pointer-events-none">
        {activeVideo ? 'SIM' : 'RENDER'}
      </span>
      <CornerBrackets inset="inset-1.5" />
    </div>
  );
};

const DossierRow = ({ product, onSaveScroll }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.4 }}
  >
    <Link
      to={`/products/${product.id}`}
      onClick={onSaveScroll}
      className="group flex flex-col md:flex-row gap-6 py-8 border-b hairline hover:border-white/[0.16] transition-colors"
    >
      <DossierMedia product={product} />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
          <span className="type-mono-label text-text-faint">{CATALOG_IDS[product.id] || product.id.toUpperCase()}</span>
          <StatusChip product={product} />
        </div>
        <h3 className="type-display text-h3 text-white mb-2 group-hover:text-accent transition-colors">
          {product.title}
        </h3>
        <p className="text-text-secondary leading-relaxed max-w-2xl mb-4">{product.tagline || product.description}</p>
        {product.highlights && (
          <div className="flex flex-wrap gap-2 mb-4">
            {product.highlights.map((h) => (
              <span key={h} className="type-mono-label text-text-muted border hairline px-2.5 py-1">
                {h.toUpperCase()}
              </span>
            ))}
          </div>
        )}
        <span className="type-mono-label text-accent group-hover:text-white transition-colors">
          OPEN DOSSIER →
        </span>
      </div>
    </Link>
  </motion.div>
);

const CatalogSection = ({ index, label, products, onSaveScroll }) => (
  <div className="mb-20">
    <SectionHeader index={index} label={label} className="mb-2" />
    {products.map((product) => (
      <DossierRow key={product.id} product={product} onSaveScroll={onSaveScroll} />
    ))}
  </div>
);

const Products = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP' || location.state?.keepScroll) {
      const savedPosition = sessionStorage.getItem('productsScrollPosition');
      if (savedPosition) {
        setTimeout(() => window.scrollTo(0, parseInt(savedPosition, 10)), 0);
      }
    }
  }, [navigationType, location]);

  const saveScrollPosition = () => {
    sessionStorage.setItem('productsScrollPosition', window.scrollY.toString());
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <SEO
        title="Systems"
        description="Explore Orbital Robotics' hardware and software: the ORA robotic arm family, AstroBot refueling vehicle, ASTRA-P autonomous GNC, NavIQ computer vision, and ORBtos flight software."
      />
      <div className="container mx-auto px-6">
        <AnimatedSection className="max-w-3xl mb-16 pt-10">
          <p className="type-mono-label text-primary mb-4">SYSTEMS CATALOG</p>
          <h1 className="type-display text-h1 text-white mb-6">Systems</h1>
          <p className="text-xl text-text-secondary">
            Hardware, autonomy software, and services — one closed-loop capture stack.
          </p>
        </AnimatedSection>

        <CatalogSection index="H" label="HARDWARE" products={hardwareProducts} onSaveScroll={saveScrollPosition} />
        <CatalogSection index="A" label="AUTONOMY" products={softwareProducts} onSaveScroll={saveScrollPosition} />
        <CatalogSection index="S" label="SERVICES" products={services} onSaveScroll={saveScrollPosition} />

        {/* CTA */}
        <AnimatedSection>
          <div className="mt-24 bg-surface border hairline p-12">
            <h2 className="type-display text-h3 text-white mb-4">Ready to upgrade your mission?</h2>
            <p className="text-text-secondary mb-8 max-w-2xl">
              Contact our engineering team to discuss how Orbital Robotics can support your specific
              mission requirements.
            </p>
            <Button to="/contact" size="lg">
              First Contact
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Products;
