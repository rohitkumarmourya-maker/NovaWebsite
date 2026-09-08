/** @type {import('tailwindcss').Config} */

/*
 * Design tokens — "Graphite & Ember" palette (approved concept review).
 *
 *  graphite  dark surfaces, headings, primary buttons
 *  ember     accent (CTA band, dashes, chips)      amber = ember on light backgrounds / hover
 *  paper     page background                        sand   = alternating bands, wells
 *  ink       text on light backgrounds
 *
 * Type scale — golden ratio (φ = 1.618) with √φ (1.272) half-steps so headings step up
 * harmoniously without leaving gaps: 12.6 · 16 · 20.4 · 25.9 · 32.9 · 41.9 · 53.3 · 67.8 px.
 * Display sizes are fluid (clamp) so the same ratio holds from a 360 px phone to a 1440 px desktop.
 * Body copy uses a φ line-height (1.618) for a calm reading rhythm.
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: '#0F161E',
          900: '#1B2632',
          800: '#263445',
          700: '#34455A',
          600: '#4A5D74',
        },
        ember: {
          DEFAULT: '#F5A425',
          300: '#FBD48A',
          400: '#F8BE55',
          500: '#F5A425',
          600: '#D98A12',
          700: '#B45309',
          800: '#8A3E06',
        },
        paper: '#F7F4ED',
        sand: {
          50: '#F4F0E5',
          100: '#EAE3D3',
          200: '#DDD3BC',
          300: '#CBBFA3',
        },
        ink: {
          900: '#26231D',
          700: '#3B372C',
          500: '#6D6657',
          400: '#8C8474',
        },
        success: { 50: '#EEF7EE', 600: '#2E7D4F', 700: '#256640' },
        danger: { 50: '#FCEEEE', 600: '#B3261E', 700: '#8C1D17' },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        display: ['"Manrope"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // φ-scale (rem): 0.786 · 1 · 1.272 · 1.618 · 2.058 · 2.618 · 3.33 · 4.236
        eyebrow: ['0.786rem', { lineHeight: '1.4', letterSpacing: '0.16em' }],
        small: ['0.875rem', { lineHeight: '1.6' }],
        body: ['1rem', { lineHeight: '1.618' }],
        lead: ['clamp(1rem, 0.94rem + 0.4vw, 1.272rem)', { lineHeight: '1.618' }],
        h4: ['clamp(1.05rem, 1rem + 0.3vw, 1.272rem)', { lineHeight: '1.3', letterSpacing: '-0.005em' }],
        h3: ['clamp(1.272rem, 1.15rem + 0.55vw, 1.618rem)', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        h2: ['clamp(1.618rem, 1.2rem + 1.7vw, 2.618rem)', { lineHeight: '1.12', letterSpacing: '-0.015em' }],
        h1: ['clamp(2.058rem, 1.35rem + 2.9vw, 4.236rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        statement: ['clamp(1.8rem, 1.05rem + 3.2vw, 3.33rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      maxWidth: {
        content: '1440px',
        prose: '62ch',
      },
      letterSpacing: {
        wide2: '0.14em',
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(27, 38, 50, 0.06)',
        lift: '0 24px 70px rgba(15, 22, 30, 0.14)',
        pill: '0 10px 40px rgba(27, 38, 50, 0.10)',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      spacing: {
        header: '4.5rem',
        'safe-b': 'env(safe-area-inset-bottom)',
      },
      screens: {
        xs: '400px',
      },
    },
  },
  plugins: [],
}
