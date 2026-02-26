/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#B40000',
        accent: '#A06E14',
        dark: '#191923',
        light: '#F5F5F8',
      },
    },
  },
  plugins: [],
}
