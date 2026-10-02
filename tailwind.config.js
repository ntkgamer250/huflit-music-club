/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-blue': '#050D1A',
        'navy': '#071A33',
        'music-blue': '#0E2A4D',
        'electric-blue': '#398BFF',
        'cyan-light': '#70D7FF',
        'warm-amber': '#FFB45C',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Be Vietnam Pro"', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(112, 215, 255, 0.45)',
        'glow-blue': '0 0 30px rgba(57, 139, 255, 0.55)',
        'glow-lg': '0 0 50px rgba(57, 139, 255, 0.4)',
      },
    },
  },
  plugins: [],
}
