/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        luxury: {
          orange: '#FF5500',      // Signature Hermes/Luxury Orange
          'orange-hover': '#FF6A1A',
          amber: '#F59E0B',
          gold: '#D97706',
          dark: '#050505',        // Deep obsidian black
          card: '#0c0c0c',
          border: 'rgba(255, 85, 0, 0.2)',
        },
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 30s linear infinite',
      },
    },
  },
  plugins: [],
}
