/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(var(--bg) / <alpha-value>)',
        surface: {
          DEFAULT: 'hsl(var(--surface) / <alpha-value>)',
          hover: 'hsl(var(--surface-hover) / <alpha-value>)',
        },
        muted: 'hsl(var(--muted) / <alpha-value>)',
        fg: {
          DEFAULT: 'hsl(var(--fg) / <alpha-value>)',
          muted: 'hsl(var(--fg-muted) / <alpha-value>)',
          subtle: 'hsl(var(--fg-subtle) / <alpha-value>)',
        },
        line: 'hsl(var(--line) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        brand: {
          DEFAULT: 'hsl(var(--brand) / <alpha-value>)',
          fg: 'hsl(var(--brand-fg) / <alpha-value>)',
          soft: 'hsl(var(--brand-soft) / <alpha-value>)',
          'soft-fg': 'hsl(var(--brand-soft-fg) / <alpha-value>)',
          border: 'hsl(var(--brand-border) / <alpha-value>)',
        },
      },
      boxShadow: {
        card: '0 30px 80px -40px rgb(120 53 15 / 0.18)',
        'brand-glow': '0 6px 20px -6px rgb(251 146 60 / 0.55)',
      },
    },
  },
  plugins: [],
}
