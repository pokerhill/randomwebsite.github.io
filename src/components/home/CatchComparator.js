import React, { useRef, useState, useEffect, useCallback } from 'react';
import { SectionHeader, SmartVideo, CornerBrackets } from '../ui';
import SimCatch from '../../assets/video/ar3_catch.mp4';
import NavIQCatch from '../../assets/video/ai_view_ar3_catch.mp4';

// Draggable comparator: the same capture, raw sim feed vs NavIQ's perception
// overlay, split by a reticle handle. Keyboard-operable (role=slider).
const CatchComparator = () => {
  const containerRef = useRef(null);
  const simRef = useRef(null);
  const navRef = useRef(null);
  const [pos, setPos] = useState(0.5);
  const dragging = useRef(false);

  // Drift correction: keep the two feeds time-locked.
  useEffect(() => {
    const id = setInterval(() => {
      const a = simRef.current;
      const b = navRef.current;
      if (a && b && Math.abs(a.currentTime - b.currentTime) > 0.1) {
        b.currentTime = a.currentTime;
      }
    }, 500);
    return () => clearInterval(id);
  }, []);

  const updateFromClientX = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = (clientX - rect.left) / rect.width;
    setPos(Math.min(0.97, Math.max(0.03, next)));
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (dragging.current) updateFromClientX(e.clientX);
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [updateFromClientX]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') setPos((p) => Math.max(0.03, p - 0.04));
    if (e.key === 'ArrowRight') setPos((p) => Math.min(0.97, p + 0.04));
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <SectionHeader
          index="002"
          label="THE CATCH"
          title="See like the arm sees."
          lede="The same capture, twice: the raw simulation feed, and the identical moment through NavIQ's perception — segmentation, tracking, and state estimation of an unprepared target. Drag the divider."
          className="mb-12"
        />

        <figure className="max-w-5xl mx-auto">
          <div
            ref={containerRef}
            className="relative overflow-hidden border hairline bg-black aspect-video select-none touch-none cursor-ew-resize"
            onPointerDown={(e) => {
              dragging.current = true;
              updateFromClientX(e.clientX);
            }}
          >
            <SmartVideo ref={simRef} src={SimCatch} preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos * 100}%)` }}>
              <SmartVideo ref={navRef} src={NavIQCatch} preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
            </div>

            {/* Feed labels */}
            <span className="absolute top-3 left-3 type-mono-label text-text-secondary bg-black/60 px-2 py-1 pointer-events-none">
              SIM FEED
            </span>
            <span className="absolute top-3 right-3 type-mono-label text-accent bg-black/60 px-2 py-1 pointer-events-none">
              NAVIQ OVERLAY
            </span>

            {/* Reticle handle */}
            <div
              role="slider"
              tabIndex={0}
              aria-label="Comparison divider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos * 100)}
              onKeyDown={onKeyDown}
              className="absolute top-0 bottom-0 w-10 -ml-5 flex items-center justify-center cursor-ew-resize outline-offset-4"
              style={{ left: `${pos * 100}%` }}
            >
              <div className="absolute top-0 bottom-0 w-px bg-accent/80" />
              <div className="relative w-8 h-8 border-[1.5px] border-accent/80 bg-black/70 flex items-center justify-center">
                <span className="text-accent text-[10px] font-mono tracking-tighter">◂▸</span>
              </div>
            </div>

            <CornerBrackets />
          </div>
          <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pt-2 border-b hairline pb-2">
            <span className="type-mono-label text-text-muted">
              <span className="text-text-faint">FIG. 02 — </span>AR-3 CAPTURE / RAW VS NAVIQ PERCEPTION
            </span>
            <span className="type-mono-label text-text-faint">SIMULATION — FLIGHT SOFTWARE IN THE LOOP</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default CatchComparator;
