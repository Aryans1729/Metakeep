/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-yellow': '#FFD60A',
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "scale(1) translate(0px, 0px)",
          },
          "33%": {
            transform: "scale(1.1) translate(30px, -50px)",
          },
          "66%": {
            transform: "scale(0.9) translate(-20px, 20px)",
          },
          "100%": {
            transform: "scale(1) translate(0px, 0px)",
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}