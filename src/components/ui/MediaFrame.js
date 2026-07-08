import React from 'react';

// Consistent media frame (image or video go inside as children, sized w-full
// h-full object-*). Gives every product/article image the same engineered
// border + radii. NOTE: lazy-load / poster / transcode are intentionally out of
// scope this round (media pipeline deferred); this is a styling wrapper only.
const MediaFrame = ({ ratio = 'aspect-video', rounded = 'rounded-xl', className = '', children }) => (
  <div className={`relative overflow-hidden ${rounded} border border-white/10 bg-black ${ratio} ${className}`}>
    {children}
  </div>
);

export default MediaFrame;
