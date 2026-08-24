import React, { useCallback, useEffect, useRef, useState } from 'react';

// One scrolling primitive for the whole redesign, so every marquee moves at the
// same visible speed.
//
// The bug this replaces: both marquees shared Tailwind's `marquee 45s` animation.
// A fixed *duration* means speed depends entirely on track length, and the tracks
// differ by ~3x — the partner row covers ~2400px in 45s (~53 px/s) while the
// oversized wordmark covers ~6500px (~144 px/s). Same duration, wildly different
// motion.
//
// So duration is derived from measured width instead: children are rendered twice
// and translated -50%, and the duration is (half-track width / SPEED). Any track
// length now scrolls at SPEED, matching the slower of the two originals.

// Pixels per second, shared by every marquee so they stay in step. Started at 50
// (the partner row's original pace) and doubled on request.
export const MARQUEE_SPEED = 100;

const Marquee = ({
  children,
  className = '',
  pauseOnHover = false,
  speed = MARQUEE_SPEED,
  // Soft edges so words enter and leave rather than being cut off by the
  // container. The fade sits at the content gutter, so a scrolling track lines up
  // with every other section's margins instead of bleeding to the viewport edge.
  fade = true,
  fadeWidth = 96,
}) => {
  const trackRef = useRef(null);
  const [duration, setDuration] = useState(null);

  // Track width depends on webfonts and image loads, so measure rather than
  // assume, and re-measure whenever it changes.
  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // scrollWidth covers both halves; one half is the distance actually travelled.
    const half = el.scrollWidth / 2;
    if (half > 0) setDuration(half / speed);
  }, [speed]);

  useEffect(() => {
    measure();
    const el = trackRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // Fonts landing late changes text width, which changes the correct duration.
    if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [measure]);

  const maskStyle = fade
    ? {
        maskImage: `linear-gradient(90deg, transparent 0, #000 ${fadeWidth}px, #000 calc(100% - ${fadeWidth}px), transparent 100%)`,
        WebkitMaskImage: `linear-gradient(90deg, transparent 0, #000 ${fadeWidth}px, #000 calc(100% - ${fadeWidth}px), transparent 100%)`,
      }
    : undefined;

  return (
    <div className={`overflow-hidden ${className}`} style={maskStyle}>
      <div
        ref={trackRef}
        className={`flex w-max animate-marquee motion-reduce:animate-none ${
          pauseOnHover ? 'hover:[animation-play-state:paused]' : ''
        }`}
        // Until measured, hold the animation so it can't flash at the wrong speed.
        style={duration ? { animationDuration: `${duration}s` } : { animationPlayState: 'paused' }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
