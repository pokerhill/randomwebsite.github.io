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
      },
      colors: {
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
      },
      animation: {
        'radar-sweep': 'radar-sweep 6s linear infinite',
        'cursor-blink': 'cursor-blink 1.1s steps(1) infinite',
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
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
