/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        metin: {
          dark: '#0a0a0c',
          gold: '#d4af37',
          red: '#8b0000',
          panel: '#141416',
          border: '#2a2a2e',
          highlight: '#ffcc00'
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        crimson: ['Crimson Text', 'serif'],
      }
    },
  },
  plugins: [],
}
