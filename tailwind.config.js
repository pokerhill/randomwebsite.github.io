/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        heading: ['"Archivo Variable"', '"Archivo"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],

        // --- Redesign register (Figma "Orbital — Website") -------------------
        // Söhne carries every headline and all body copy in the design, but it is
        // a paid Klim license that exists only inside the Figma file — there is no
        // shippable copy of it in either repo or on the machine. Geist is the
        // stand-in: same neo-grotesk lineage, so proportions and terminals read
        // correctly. Söhne stays first in the stack, so dropping in the licensed
        // webfont later upgrades the whole site with no code change.
        sohne: ['"Test Söhne"', '"Söhne"', '"Geist Sans"', '"Inter"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        plex: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      // Instrument type scale: huge expanded-uppercase display, locked body,
      // mono micro-labels. Hierarchy comes from scale jumps, never color.
      fontSize: {
        display: ['clamp(3.25rem, 8vw, 7.5rem)', { lineHeight: '0.95', letterSpacing: '-0.01em', fontWeight: '800' }],
        h1: ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.0', letterSpacing: '-0.01em', fontWeight: '800' }],
        h2: ['clamp(2rem, 4.5vw, 3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.01em', fontWeight: '800' }],
        h3: ['clamp(1.25rem, 3vw, 1.75rem)', { lineHeight: '1.25', fontWeight: '700' }],
        eyebrow: ['0.8125rem', { lineHeight: '1', letterSpacing: '0.16em' }],
        micro: ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.14em' }],

        // --- Redesign scale ---------------------------------------------------
        // Figma is a fixed 1440px canvas; each clamp is anchored so the vw term
        // resolves to the exact design px at 1440 and shrinks from there.
        'orb-display': ['clamp(3rem, 7.91vw, 7.119rem)', { lineHeight: '0.878', letterSpacing: '-0.02em' }],
        'orb-h1': ['clamp(2.5rem, 5.56vw, 5rem)', { lineHeight: '1.25', letterSpacing: '-0.05em' }],
        'orb-h2': ['clamp(2rem, 4.44vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.031em' }],
        'orb-sub': ['clamp(1.75rem, 3.33vw, 3rem)', { lineHeight: '1.4', letterSpacing: '-0.021em' }],
        'orb-lead': ['clamp(1.5rem, 2.92vw, 2.625rem)', { lineHeight: '1.4', letterSpacing: '-0.024em' }],
        'orb-lg': ['clamp(1.25rem, 2.22vw, 2rem)', { lineHeight: '1.4', letterSpacing: '-0.031em' }],
        'orb-body': ['clamp(1rem, 1.39vw, 1.25rem)', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        'orb-caption': ['1rem', { lineHeight: '1.4', letterSpacing: '-0.02em' }],
        'orb-tag': ['0.75rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        // Mono register: eyebrows, footer links, captions. 2px tracking = 0.09em.
        'orb-eyebrow': ['clamp(1rem, 1.53vw, 1.375rem)', { lineHeight: '1.182', letterSpacing: '0.09em' }],
        'orb-link': ['1.125rem', { lineHeight: '1.444', letterSpacing: '0.111em' }],
        'orb-label': ['0.875rem', { lineHeight: '1.857', letterSpacing: '0.143em' }],
        'orb-btn': ['0.875rem', { lineHeight: 'normal', letterSpacing: '0.08em' }],
      },
      colors: {
        // --- Redesign palette (Figma "Orbital — Website") ---------------------
        // The design file defines no Figma variables, so these are the literal
        // values read off the nodes. Namespaced to keep the existing palette
        // below intact until components migrate over.
        orb: {
          bg: '#161616',          // every page frame — not pure black
          black: '#000000',       // hardware section, arm-detail mid-band
          navy: '#040632',        // CTA band gradient end
          card: '#202020',        // Careers role rows
          accent: '#3B45F5',      // eyebrows, tag pills, divider glow, coords
          'accent-deep': '#23288F', // divider glow falloff (used at 0 alpha)
          pill: '#254C9A',        // "Software"/"Hardware" labels on white pills
          text: '#FFFFFF',
          'text-2': '#AEB4BE',
          'text-3': '#9F9F9F',
          'text-4': '#7E7E7E',    // footer column headers
          glass: 'rgba(69, 73, 78, 0.33)',
          'glass-border': 'rgba(255, 255, 255, 0.15)',
          'btn-border': 'rgba(255, 255, 255, 0.4)',
        },

        // Near-black foundation + neutral surface tiers (industrial, no purple tint).
        background: '#030308',
        surface: {
          DEFAULT: '#0A0B0F',
          light: '#15171D',
        },
        // ONE signal accent: interactive + HUD only. Hover BRIGHTENS (instruments
        // brighten, they don't darken).
        primary: {
          DEFAULT: '#2E8BE6',
          hover: '#56A8EE',
        },
        accent: '#56A8EE',
        // Steel-blue kept for legacy `secondary` usages.
        secondary: {
          DEFAULT: '#3B6FA0',
        },
        // ONE warm instrument accent — sacred: heritage, COMPLETE, CAPTURE
        // CONFIRMED, availability. Nothing else.
        ember: {
          DEFAULT: '#E0701A',
          hover: '#F08A35',
          subtle: 'rgba(224, 112, 26, 0.12)',
        },
        // 8-step technical-neutral ramp.
        neutral: {
          50: '#F7F8FA',
          100: '#EDEFF2',
          200: '#D6DAE0',
          300: '#AEB4BE',
          400: '#7E8590',
          500: '#5B616B',
          600: '#3F444C',
          700: '#2A2E34',
          800: '#1A1D22',
          900: '#101216',
          950: '#070809',
        },
        // Status as literal mono words: NOMINAL / CAUTION / FAULT.
        success: '#3FB27F',
        warning: '#E0A91A',
        danger: '#E0533F',
        text: {
          primary: '#F4F6F8',
          secondary: '#AEB4BE',
          muted: '#7E8590',
          faint: '#5B616B',
        },
        hairline: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          active: 'rgba(255, 255, 255, 0.16)',
        },
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
        38: '9.5rem',
      },
      borderRadius: {
        // Instruments are rectangular: 2-4px max for chrome; media frames flat.
        instrument: '2px',
        panel: '4px',
      },
      boxShadow: {
        'elev-1': '0 1px 2px rgba(0, 0, 0, 0.4)',
        'elev-2': '0 8px 24px -8px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'hero-pattern': "radial-gradient(circle at center, #0B0D12 0%, #030308 100%)",

        // --- Redesign signature gradients -------------------------------------
        // Closes every page: near-black holds for 61% then falls to deep navy.
        'orb-cta': 'linear-gradient(180deg, #161616 60.966%, #040632 100%)',
        // The 6px accent rule between sections. Bleeds past the viewport edges.
        'orb-divider': 'linear-gradient(90deg, rgba(35,40,143,0) 0%, #3B45F5 48.558%, rgba(35,40,143,0) 100%)',
        // Arm-detail band: dips to true black in the middle, back to bg at both ends.
        'orb-band': 'linear-gradient(180deg, #161616 0%, #000 28.365%, #000 77.404%, #161616 100%)',
        // Bottom fade over product renders so they dissolve into the section.
        'orb-render-fade': 'linear-gradient(180deg, rgba(0,0,0,0) 65%, #000 100%)',
        // Software-page architecture cards.
        'orb-glass-card': 'linear-gradient(90deg, rgba(217,217,217,0.5) 0%, rgba(115,115,115,0) 100%)',
      },
      backdropBlur: {
        'orb-glass': '16.55px',
        'orb-nav': '24.7px',
        'orb-card': '20.878px',
      },
      animation: {
        'radar-sweep': 'radar-sweep 6s linear infinite',
        'cursor-blink': 'cursor-blink 1.1s steps(1) infinite',
        marquee: 'marquee 45s linear infinite',
      },
      keyframes: {
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'cursor-blink': {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        // Loops seamlessly when the track holds two identical halves.
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
