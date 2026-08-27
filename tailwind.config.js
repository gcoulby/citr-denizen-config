/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#efe8d6',
        'paper-dark': '#e3dabf',
        ink: '#2b241a',
        'ink-soft': '#5c5240',
        accent: '#8a1f1f',
        'accent-soft': '#b3453a',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Crimson Text"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
