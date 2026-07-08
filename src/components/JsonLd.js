import { useEffect } from 'react';

// Injects a <script type="application/ld+json"> structured-data block and cleans
// it up on unmount / data change. Improves search + social rich results.
const JsonLd = ({ data }) => {
  const json = JSON.stringify(data);
  useEffect(() => {
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.text = json;
    document.head.appendChild(el);
    return () => {
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, [json]);
  return null;
};

export default JsonLd;
