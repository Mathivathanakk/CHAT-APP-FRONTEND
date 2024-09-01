/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Roboto: ["Roboto Slab", "serif"],
        Nunito: ["Nunito Sans", "sans-serif"],
        Serif: ["DM Serif Text", "serif"],
      },
    },
  },
  plugins: [],
};
