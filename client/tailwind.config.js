import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      maxWidth: {
        "8xl": "88rem",
      },
      fontSize: {
        "xxs": "0.65rem",
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        theme: 'hsl(var(--theme))',
        "theme-1": 'hsl(var(--theme-1))',
        "theme-2": 'hsl(var(--theme-2))',
        "theme-2-dark": 'hsl(var(--theme-2-dark))',
        "theme-2-muted": 'hsl(var(--theme-2-muted))',
        "theme-danger": 'hsl(var(--theme-danger))',
        "theme-warning": 'hsl(var(--theme-warning))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      textShadow: {
        sm: '1px 1px 0 #000',
        DEFAULT: '2px 2px 0 #000',
        lg: '3px 3px 0 #000',
        classic3d:
          '1px 1px 0 #000, 2px 2px 0 #000, 3px 3px 0 #000, 4px 4px 0 #000',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    plugin(function ({ addComponents }) {
      addComponents({
        ".btn": {
          "@apply w-fit !h-11": {},
        },
        ".btn-sm": {
          "@apply w-fit !h-8": {},
        },
        ".btn-lg": {
          "@apply w-fit !h-12": {},
        },
        ".btn-block": {
          "@apply !w-full": {},
        },
        ".input": {
          "@apply flex w-full rounded-lg border border-input focus:border-theme-2/30 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-2/20 focus:ring-theme-2/20 disabled:cursor-not-allowed disabled:opacity-50": {}
        },
        ".has-error": {
          "@apply !border-theme-danger/50 focus:!border-theme-danger/70 focus:!ring-theme-danger/30": {}
        },
        ".card-header-bg": {
          "@apply bg-gradient-to-b from-white to-muted": {}
        }
      })
    })
  ],
};
