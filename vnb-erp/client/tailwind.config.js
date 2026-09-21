/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        vnb: {
          dark: '#0A0A0E',
          surface: '#111118',
          card: '#161622',
          orange: '#FF5500',
          gold: '#E5A823',
        },
      },
    },
  },
  plugins: [],
};
