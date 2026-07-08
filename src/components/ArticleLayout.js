import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Link2, Check } from 'lucide-react';
import SEO from './SEO';
import JsonLd from './JsonLd';
import Eyebrow from './ui/Eyebrow';

const ShareRow = ({ title }) => {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      /* clipboard unavailable */
    }
  };

  const btn =
    'inline-flex items-center justify-center w-10 h-10 border hairline text-text-secondary hover:text-white hover:border-white/[0.16] transition-all';

  return (
    <div className="flex items-center gap-3 mt-12 pt-8 border-t border-white/10">
      <span className="text-sm text-text-muted mr-1">Share</span>
      <a
        className={btn}
        aria-label="Share on LinkedIn"
        target="_blank"
        rel="noopener noreferrer"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
      >
        <Linkedin size={18} strokeWidth={1.75} />
      </a>
      <a
        className={btn}
        aria-label="Share on X"
        target="_blank"
        rel="noopener noreferrer"
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
      >
        <Twitter size={18} strokeWidth={1.75} />
      </a>
      <button className={btn} aria-label="Copy link" onClick={copy}>
        {copied ? <Check size={18} strokeWidth={1.75} /> : <Link2 size={18} strokeWidth={1.75} />}
      </button>
    </div>
  );
};

// One template for every internal article page: back-nav, byline as <time>,
// a constrained reading measure, prose typography, and share actions.
const ArticleLayout = ({ title, description, source, date, dateTime, heroImage, children }) => (
  <div className="min-h-screen bg-background pt-[var(--header-height)] pb-20">
    <SEO title={title} description={description || title} image={heroImage} />
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: title,
        description: description || title,
        datePublished: dateTime,
        ...(heroImage ? { image: [heroImage] } : {}),
        author: { '@type': 'Organization', name: 'Orbital Robotics' },
        publisher: {
          '@type': 'Organization',
          name: 'Orbital Robotics',
          logo: { '@type': 'ImageObject', url: 'https://www.orbital-robots.com/logo_white.png' },
        },
      }}
    />
    <div className="container mx-auto px-6 max-w-2xl">
      <Link
        to="/news"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors text-sm mt-6 mb-8"
      >
        ← Back to News
      </Link>

      <header className="mb-10">
        {source && <Eyebrow className="mb-3">{source}</Eyebrow>}
        <h1 className="text-h1 font-heading text-white mb-4">{title}</h1>
        {date && (
          <time dateTime={dateTime} className="text-text-muted text-sm">
            {date}
          </time>
        )}
      </header>

      {heroImage && (
        <img
          src={heroImage}
          alt={title}
          loading="lazy"
          className="w-full rounded-panel border hairline mb-10 shadow-elev-2"
        />
      )}

      <article className="prose prose-lg prose-invert max-w-none">{children}</article>

      <ShareRow title={title} />
    </div>
  </div>
);

export default ArticleLayout;
