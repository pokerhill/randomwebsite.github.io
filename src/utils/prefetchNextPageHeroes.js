import AaronImg from '../assets/headshots/aaron.jpg';
import HiringPhilosophy from '../assets/orb/careers/hiring-philosophy.jpg';

// Warms the browser cache for the first image a visitor meets on each of the
// main nav destinations, so clicking through from the landing page does not
// start from a cold fetch. Runs only after the landing page's own images have
// settled, at idle, at low priority — it must never compete with anything the
// visitor is currently looking at.
// Deliberately excludes the arm page's hero: at ~1MB it was a quarter of the
// landing page's weight, speculatively, for a page a visitor may never open.
// These two are a few tens of KB together.
const NEXT_PAGE_HEROES = [AaronImg, HiringPhilosophy];

// Only skip on connections where a few megabytes actually costs the visitor
// something. Browsers without the Network Information API (Safari) report
// nothing, which means "no evidence this is metered" — prefetch there rather
// than disabling the feature for a whole engine.
const onMeteredConnection = () => {
  const conn = navigator.connection;
  if (!conn) return false;
  return Boolean(conn.saveData) || conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g';
};

const warm = () => {
  if (onMeteredConnection()) return;
  NEXT_PAGE_HEROES.forEach((src) => {
    const img = new Image();
    img.decoding = 'async';
    img.fetchPriority = 'low';
    img.src = src;
  });
};

const scheduleWarm = () => {
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(warm, { timeout: 4000 });
  } else {
    setTimeout(warm, 2000);
  }
};

const prefetchNextPageHeroes = () => {
  if (document.readyState === 'complete') {
    scheduleWarm();
    return undefined;
  }
  window.addEventListener('load', scheduleWarm, { once: true });
  return () => window.removeEventListener('load', scheduleWarm);
};

export default prefetchNextPageHeroes;
