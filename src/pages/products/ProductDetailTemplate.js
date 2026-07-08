import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import JsonLd from '../../components/JsonLd';
import AnimatedSection from '../../components/motion/AnimatedSection';
import StaggerContainer, { itemVariants } from '../../components/motion/StaggerContainer';
import { Eyebrow, Badge, Button, Breadcrumb, CornerBrackets } from '../../components/ui';
import OrbtosConsole from '../../components/OrbtosConsole';

// Renders image / single video / cycling video array into a fixed media frame.
const ProductMedia = ({ image, video, videos, imageFit = 'contain', imageBg = '', videoFit = 'contain', videoBg = '', videoPosition = 'center', controls = false, title, className = '' }) => {
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
      videoRef.current.play().catch((e) => console.log('Autoplay prevented', e));
    }
  }, [currentVideoIndex, videos]);

  const activeVideo = videos ? videos[currentVideoIndex] : video;
  if (!activeVideo && !image) return null;

  return (
    <div className={`relative overflow-hidden border hairline bg-black ${className}`}>
      {activeVideo ? (
        <video
          ref={videoRef}
          src={activeVideo}
          autoPlay={!controls}
          controls={controls}
          loop={!videos}
          muted
          playsInline
          onEnded={handleVideoEnded}
          className={`w-full h-[320px] md:h-[460px] object-${videoFit} ${videoBg}`}
          style={{ objectPosition: videoPosition }}
        />
      ) : (
        <img src={image} alt={title} className={`w-full h-[320px] md:h-[460px] object-${imageFit} ${imageBg}`} />
      )}
      <span className="absolute bottom-2 left-2 type-mono-label text-text-faint bg-black/60 px-2 py-1 pointer-events-none">
        {activeVideo ? 'SIMULATION' : 'RENDER'}
      </span>
      <CornerBrackets />
    </div>
  );
};

// Section shell with eyebrow + heading, left-aligned, with an anchor id.
const DetailSection = ({ id, bg = 'background', eyebrow, title, subtitle, center = false, children }) => (
  <section id={id} className={`py-16 scroll-mt-32 ${bg === 'surface' ? 'bg-surface' : 'bg-background'}`}>
    <div className="container mx-auto px-6">
      {(eyebrow || title) && (
        <AnimatedSection className={`mb-10 ${center ? 'text-center max-w-2xl mx-auto' : 'max-w-2xl'}`}>
          {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
          {title && <h2 className="type-display text-h3 text-white">{title}</h2>}
          {subtitle && <p className="text-text-secondary mt-3">{subtitle}</p>}
        </AnimatedSection>
      )}
      {children}
    </div>
  </section>
);

const CardGrid = ({ items }) => {
  const cols = items.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';
  return (
    <StaggerContainer className={`grid grid-cols-1 ${cols} gap-6`}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="p-8 rounded-panel bg-surface border hairline hover:border-white/[0.16] transition-all"
        >
          <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
          <p className="text-text-secondary leading-relaxed">{item.description}</p>
        </motion.div>
      ))}
    </StaggerContainer>
  );
};

// Key-figures band: single-value spec pairs rendered as instrument-style stats.
const KeyFigures = ({ specs }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.08] overflow-hidden border hairline">
    {specs.map((spec, index) => (
      <div key={index} className="bg-surface px-6 py-6 text-center">
        <div className="text-2xl font-heading font-bold text-white mb-1">{spec.value}</div>
        <div className="type-mono-label text-text-muted">{spec.label}</div>
      </div>
    ))}
  </div>
);

const SpecTable = ({ table }) => (
  <div className="max-w-3xl mx-auto overflow-x-auto border hairline">
    <table className="w-full text-left">
      <thead>
        <tr className="bg-background/60">
          <th className="py-4 px-6 type-mono-label text-text-secondary">Specification</th>
          {table.columns.map((col, index) => (
            <th key={index} className="py-4 px-6 type-mono-label text-white">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row, index) => {
          const spans = row.values.length === 1 && table.columns.length > 1;
          return (
            <tr key={index} className="border-t border-white/5">
              <td className="py-4 px-6 text-text-secondary">{row.label}</td>
              {spans ? (
                <td colSpan={table.columns.length} className="py-4 px-6 text-text-primary font-mono text-sm">{row.values[0]}</td>
              ) : (
                row.values.map((value, valueIndex) => (
                  <td key={valueIndex} className="py-4 px-6 text-text-primary font-mono text-sm">{value}</td>
                ))
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const RelatedProductsGrid = ({ items }) => {
  const cols = items.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';
  return (
    <StaggerContainer className={`grid grid-cols-1 ${cols} gap-6 max-w-5xl mx-auto`}>
      {items.map((item, index) => (
        <motion.div key={index} variants={itemVariants}>
          <Link
            to={`/products/${item.id}`}
            className="group block h-full bg-background/50 border hairline hover:border-white/[0.16] rounded-panel p-6 transition-all"
          >
            <Eyebrow className="mb-2">In the stack</Eyebrow>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{item.label}</h3>
            <p className="text-text-secondary text-sm mb-4">{item.context}</p>
            <span className="text-primary text-sm font-medium inline-flex items-center">
              Learn more
              <span className="ml-1 transform group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </Link>
        </motion.div>
      ))}
    </StaggerContainer>
  );
};

const ProductDetailTemplate = ({ product }) => {
  const {
    title, category, tagline, description, availability,
    variants, features, applications, useCases, specs, specsTable, demos,
    relatedProducts,
    image, video, videos, heroMedia,
    imageFit = 'contain', imageBg = '', videoFit = 'contain', videoBg = '', videoPosition = 'center',
  } = product;

  // heroMedia: false keeps card media (image/video) out of the detail hero.
  // console: true renders the live ORBtos instrument panel as the hero media.
  const hasMedia = heroMedia !== false && Boolean(product.console || image || video || (videos && videos.length));
  const hasKeyFigures = Boolean(specs && specs.length > 0);
  const hasSpecTable = Boolean(specsTable);

  // Build the sticky anchor nav from sections that are actually present.
  const navItems = [
    description && { id: 'overview', label: 'Overview' },
    variants && variants.length > 0 && { id: 'family', label: 'The Family' },
    features && features.length > 0 && { id: 'features', label: 'Features' },
    demos && demos.length > 0 && { id: 'demos', label: 'Demos' },
    hasSpecTable && { id: 'specs', label: 'Specifications' },
    relatedProducts && relatedProducts.length > 0 && { id: 'stack', label: 'The Stack' },
  ].filter(Boolean);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-background text-text-primary pt-[var(--header-height)]">
      <SEO title={`${title} - Orbital Robotics`} description={tagline || description} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: title,
          category,
          description: tagline || description,
          brand: { '@type': 'Brand', name: 'Orbital Robotics' },
        }}
      />

      {/* Hero */}
      <section className="relative pt-10 pb-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <Breadcrumb
            className="mb-8"
            items={[
              { label: 'Products', to: '/products', state: { keepScroll: true } },
              { label: title },
            ]}
          />
          <div className={`grid items-center gap-12 ${hasMedia ? 'lg:grid-cols-2' : 'max-w-3xl'}`}>
            <AnimatedSection direction="left">
              <div className="flex items-center gap-3 mb-5">
                <Eyebrow>{category}</Eyebrow>
                {availability && <Badge variant="ember">Available {availability}</Badge>}
              </div>
              <h1 className="type-display text-h2 text-white mb-5">{title}</h1>
              <p className="text-xl text-text-secondary mb-8 leading-relaxed">{tagline || description}</p>
              <div className="flex flex-wrap gap-4">
                <Button to="/contact" size="lg">Get in Touch</Button>
                {navItems.length > 0 && (
                  <Button as="button" variant="secondary" size="lg" onClick={() => scrollTo(navItems[navItems.length - 1].id)}>
                    Explore details
                  </Button>
                )}
              </div>
            </AnimatedSection>
            {hasMedia && (
              <AnimatedSection direction="right">
                {product.console ? (
                  <OrbtosConsole />
                ) : (
                  <ProductMedia
                    image={image} video={video} videos={videos}
                    imageFit={imageFit} imageBg={imageBg} videoFit={videoFit} videoBg={videoBg} videoPosition={videoPosition}
                    title={title}
                  />
                )}
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>

      {/* Key figures band */}
      {hasKeyFigures && (
        <div className="container mx-auto px-6 relative z-10 -mt-2 mb-4">
          <AnimatedSection className="max-w-4xl">
            <KeyFigures specs={specs} />
          </AnimatedSection>
        </div>
      )}

      {/* Sticky anchor nav */}
      {navItems.length > 1 && (
        <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-md border-y border-white/5">
          <div className="container mx-auto px-6">
            <div className="flex gap-2 overflow-x-auto py-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="whitespace-nowrap px-4 py-1.5 type-mono-label text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Overview */}
      {description && (
        <section id="overview" className="py-16 bg-background scroll-mt-32">
          <div className="container mx-auto px-6">
            <AnimatedSection className="max-w-3xl">
              <Eyebrow className="mb-3">Overview</Eyebrow>
              <p className="text-lg text-text-secondary leading-relaxed">{description}</p>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* The Family: variants */}
      {variants && variants.length > 0 && (
        <DetailSection id="family" bg="surface" eyebrow="The Family" title="One architecture, many configurations" subtitle="Configurations sharing the same control software and integration patterns.">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {variants.map((variant, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group bg-background/50 border hairline rounded-panel overflow-hidden hover:border-white/[0.16] transition-all flex flex-col"
              >
                {variant.image && (
                  <div className="aspect-[4/3] bg-[#010101] overflow-hidden">
                    <img src={variant.image} alt={variant.name} className="w-full h-full object-contain" />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  {variant.badge && (
                    <Badge variant="signal" className="self-start mb-3">{variant.badge}</Badge>
                  )}
                  <h3 className="text-xl font-bold text-white mb-3">{variant.name}</h3>
                  <p className="text-text-secondary text-sm mb-4 flex-1">{variant.description}</p>
                  <Link
                    to="/contact"
                    className="text-primary text-sm font-medium inline-flex items-center hover:text-primary-hover transition-colors border-t border-white/5 pt-3"
                  >
                    Contact us
                    <span className="ml-1 transform group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </DetailSection>
      )}

      {/* Key Features */}
      {features && features.length > 0 && (
        <DetailSection id="features" bg="surface" eyebrow="Capabilities" title="Key Features">
          <CardGrid items={features} />
        </DetailSection>
      )}

      {/* Applications */}
      {applications && applications.length > 0 && (
        <DetailSection eyebrow="Where it flies" title="Applications">
          <CardGrid items={applications} />
        </DetailSection>
      )}

      {/* Use Cases */}
      {useCases && useCases.length > 0 && (
        <DetailSection bg="surface" eyebrow="In practice" title="Use Cases" subtitle="Real-world scenarios with named outcomes.">
          <CardGrid items={useCases} />
        </DetailSection>
      )}

      {/* Demos */}
      {demos && demos.length > 0 && (
        <DetailSection id="demos" eyebrow="See it work" title="Demos" subtitle="Mission and simulation footage of the system in action.">
          <div className={`grid grid-cols-1 ${demos.length > 1 ? 'lg:grid-cols-2' : 'max-w-4xl mx-auto'} gap-8`}>
            {demos.map((demo, index) => (
              <div key={index}>
                <ProductMedia
                  image={demo.image} video={demo.video} videos={demo.videos}
                  controls={demo.controls} videoFit={demo.videoFit || 'cover'} videoPosition={demo.videoPosition || 'center'}
                  title={`${title} demo ${index + 1}`}
                />
                {demo.caption && <p className="mt-4 text-center text-sm text-text-secondary">{demo.caption}</p>}
              </div>
            ))}
          </div>
        </DetailSection>
      )}

      {/* Specifications table */}
      {hasSpecTable && (
        <DetailSection id="specs" eyebrow="The numbers" title="Specifications" subtitle={specsTable.note} center>
          <SpecTable table={specsTable} />
        </DetailSection>
      )}

      {/* How It Fits */}
      {relatedProducts && relatedProducts.length > 0 && (
        <DetailSection id="stack" bg="surface" eyebrow="How it fits" title="Built to work with the rest of the stack" center>
          <RelatedProductsGrid items={relatedProducts} />
        </DetailSection>
      )}

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Button to="/products" state={{ keepScroll: true }} variant="secondary" size="lg">
              ← Back to Products
            </Button>
            <Button to="/contact" size="lg">Get in Touch</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailTemplate;
