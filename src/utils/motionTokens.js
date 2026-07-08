// Single source of truth for the site's motion "feel". Import these instead of
// re-declaring easing curves / durations / offsets per component, so the whole
// site can be re-tuned in one place.

export const ease = {
  // Standard entrance: confident ease-out (engineered, not bouncy).
  standard: [0.22, 0.61, 0.36, 1],
  // Quicker ease-in for exits.
  exit: [0.4, 0, 1, 1],
  // Symmetric smooth curve for hovers / small transitions.
  smooth: [0.4, 0, 0.2, 1],
};

export const duration = {
  fast: 0.2,
  base: 0.5,
  slow: 0.7,
};

export const distance = {
  sm: 20,
  md: 40,
};

export const stagger = {
  children: 0.08,
  delay: 0.1,
};

// Reveal variants used by section/stagger components. When `reduce` is true
// (prefers-reduced-motion), collapse offsets so content simply fades/appears.
export const makeRevealVariants = (reduce = false, offset = { y: distance.md }) => ({
  hidden: reduce ? { opacity: 0 } : { opacity: 0, ...offset },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: reduce ? 0.2 : duration.base, ease: ease.standard },
  },
});

export const makeItemVariants = (reduce = false) => ({
  hidden: reduce ? { opacity: 0 } : { opacity: 0, y: distance.sm },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: reduce ? 0.2 : duration.base, ease: ease.standard },
  },
});
