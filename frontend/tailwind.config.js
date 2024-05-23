/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        integral: ['Integral', 'sans-serif'],
      },
      colors: {
        orangeLight: '#fca136',
        orangeE: '#ff8500',
      },
    },
  },
  plugins: [],
}

