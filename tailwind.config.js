/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'game': 'repeat(20, minmax(0, 1fr))'
      }
    },
  },
  plugins: [],
}
