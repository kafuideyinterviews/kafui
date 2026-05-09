import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './sanity/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ── Brand colours ──────────────────────────────────────────────
      colors: {
        navy:    '#0B0F1A',   // Primary dark background
        gold:    '#C9A84C',   // Primary accent — gold
        cream:   '#F7F2EB',   // Light mode text / dark mode bg layer
        charcoal:'#2C2C2A',   // Body text on light
        muted:   '#8A8880',   // Secondary/muted text
        border:  'rgba(0,0,0,0.1)',  // Overridden per mode via CSS vars
        surface: '#F3EEE7',   // Light mode card surface
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
      },

      // ── Typography ─────────────────────────────────────────────────
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
      },

      // ── Type scale ─────────────────────────────────────────────────
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],     // 10px
        xs:    ['0.75rem',  { lineHeight: '1.125rem' }], // 12px
        sm:    ['0.875rem', { lineHeight: '1.375rem' }], // 14px
        base:  ['1rem',     { lineHeight: '1.625rem' }], // 16px
        lg:    ['1.125rem', { lineHeight: '1.75rem' }],  // 18px — story body
        xl:    ['1.25rem',  { lineHeight: '1.875rem' }], // 20px
        '2xl': ['1.5rem',   { lineHeight: '2rem' }],     // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],  // 30px
        '4xl': ['2.25rem',  { lineHeight: '2.625rem' }], // 36px
        '5xl': ['3rem',     { lineHeight: '3.375rem' }], // 48px
        '6xl': ['3.75rem',  { lineHeight: '4rem' }],     // 60px
      },

      // ── Spacing additions ──────────────────────────────────────────
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
        34: '8.5rem',
      },

      // ── Border radius ──────────────────────────────────────────────
      borderRadius: {
        sm: '2px',   // editorial — very subtle, not pill
        DEFAULT: '4px',
        md: '6px',
        lg: '10px',
      },

      // ── Max widths ─────────────────────────────────────────────────
      maxWidth: {
        prose:  '68ch',  // optimal story body width
        narrow: '48ch',
        wide:   '90rem',
      },

      // ── Animations ─────────────────────────────────────────────────
      animation: {
        'fade-up':      'fadeUp 0.6s ease forwards',
        'fade-in':      'fadeIn 0.4s ease forwards',
        'slide-in-left':'slideInLeft 0.5s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },

      // ── Typography plugin prose config ─────────────────────────────
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '68ch',
            color: 'var(--color-foreground)',
            a: { color: '#C9A84C', textDecoration: 'none' },
            'h2, h3': { fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic' },
            blockquote: { borderLeftColor: '#C9A84C', fontStyle: 'normal' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
    function ({ addUtilities }: { addUtilities: (u: Record<string, Record<string, string>>) => void }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        '.scrollbar-hide::-webkit-scrollbar': {
          display: 'none',
        },
      })
    },
  ],
}

export default config
