import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'Orbital Robotics';
const DEFAULT_IMAGE = 'https://www.orbital-robots.com/logo_white.png';

// Create or update a <meta> tag identified by an attribute (name= or property=).
const upsertMeta = (attr, key, content) => {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const upsertCanonical = (href) => {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

/**
 * Per-route SEO: title, description, Open Graph and Twitter Card meta.
 * `image` overrides the default share image (e.g. an article hero).
 */
const SEO = ({ title, description, image = DEFAULT_IMAGE }) => {
  const location = useLocation();

  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const url = window.location.href; // includes the hash route under HashRouter

    document.title = fullTitle;

    upsertMeta('name', 'description', description);

    // Open Graph
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', image);

    // Twitter
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);

    upsertCanonical(url);

    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [title, description, image, location]);

  return null;
};

export default SEO;
