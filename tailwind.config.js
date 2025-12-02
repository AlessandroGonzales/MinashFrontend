/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFFFFF",
        blackDeep: "#000000",
        graphite: "#1A1A1A",
        steel: "#3A3A3A",
        gold: "#C9A86A",
        ice: "#D9D9D9",
      }
    },
  },
  plugins: [],
}
