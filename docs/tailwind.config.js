/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        background: '#08080c',
        sidebar: '#0d0c12',
        panel: '#14121c',
        'panel-light': '#1b1827',
        'primary-blue': '#a78bfa',
        'primary-blue-light': '#c4b5fd',
        'accent-blue': '#a78bfa',
        'text-primary': '#f4f4f6',
        'text-secondary': '#a1a1aa',
        'text-muted': '#71717a',
        'border-color': '#241f31',
      },
      animation: { 'fade-in': 'fade-in 0.3s ease-out forwards' },
      keyframes: { 'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } } },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
