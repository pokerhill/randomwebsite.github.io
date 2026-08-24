import React from 'react';
import ReactDOM from 'react-dom/client';
// Self-hosted fonts (replaces the render-blocking Google Fonts @import).
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/600.css';
// Redesign mono register — every eyebrow, footer link, and caption in the Figma.
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/700.css';
// Redesign display/body register. The Figma uses Test Söhne, which is a paid Klim
// license and exists only inside the design file — Geist is the shipping stand-in
// (same neo-grotesk lineage). Weights map to Söhne's: Buch 400, Kräftig 500,
// Halbfett 600, Fett 700.
import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';
import '@fontsource/geist-sans/600.css';
import '@fontsource/geist-sans/700.css';
import './styles/global.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);