import { useEffect } from 'react';
import Lenis from 'lenis';

// Smooth ("soft") scroll for the whole site, matching the feel of
// chunfrutolaw.com — a Framer site whose live Lenis instance (window.lenis)
// reports this exact config: duration 1, the library's default exponential
// ease-out, lerp 0.1, 1x wheel/touch multipliers, vertical only. Framer wires
// Lenis in "window" mode (no scroll wrapper element required), which this
// mirrors — it drives the real document scroll, so nothing else on the site
// (anchor scrollIntoView, React Router's own scroll reset) needs to change.
//
// Mounted once near the app root so the instance and its rAF loop persist
// across route changes rather than restarting per page.
const SmoothScroll = () => {
  useEffect(() => {
    // Same posture as the rest of the site's motion (framer-motion's
    // useReducedMotion elsewhere): skip the smoothing layer entirely rather
    // than offering a "less smooth" version of it.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
      orientation: 'vertical',
      autoRaf: true,
    });

    // Exposed the same way Framer/Lenis itself does (window.lenis), so other
    // code — devtools inspection, a future programmatic scrollTo — can reach
    // the live instance without threading it through props/context.
    window.lenis = lenis;

    return () => {
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  return null;
};

export default SmoothScroll;
