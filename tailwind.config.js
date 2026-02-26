/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00AEEF',
        'primary-dark': '#0090CC',
        accent: '#191923',
        dark: '#191923',
        light: '#F0FAFF',
      },
    },
  },
  plugins: [],
}
