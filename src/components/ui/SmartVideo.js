import React, { useEffect, useRef, forwardRef, useCallback } from 'react';

// Disciplined video: pauses when off-screen (plays at >=30% visibility),
// defaults to preload="metadata", always muted/inline for autoplay policy.
// Forward a ref when a parent needs direct element control (sync, timeupdate).
const SmartVideo = forwardRef(function SmartVideo(
  { src, poster, className = '', style, loop = true, controls = false, preload = 'metadata', onTimeUpdate, onEnded },
  forwardedRef
) {
  const innerRef = useRef(null);
  const setRefs = useCallback(
    (node) => {
      innerRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef]
  );

  useEffect(() => {
    const el = innerRef.current;
    if (!el || controls) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.3) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: [0, 0.3] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [controls]);

  return (
    <video
      ref={setRefs}
      src={src}
      poster={poster}
      muted
      playsInline
      loop={loop}
      controls={controls}
      preload={preload}
      onTimeUpdate={onTimeUpdate}
      onEnded={onEnded}
      className={className}
      style={style}
    />
  );
});

export default SmartVideo;
