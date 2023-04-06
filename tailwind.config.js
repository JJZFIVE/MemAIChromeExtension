/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter"],
        "work-sans": ["Work Sans"],
        inconsolata: ["Inconsolata"],
      },
      colors: {
        "uniswap-gray": "#737781",
        "uniswap-dark-gray-box-border": "#AEACB4",
        "header-text": "#33363F",
        "body-text": "#40424C",
        "mem-red": "#E44A47",
      },
      backgroundColor: {
        main: "#F4F7F9",
        "button-red": "#E44A47",
        "button-purple": "#D83D81",
        "button-dark": "#33363F",
        tag: "#D9D9D9",
      },
      gradientColorStops: {
        "button-red": "#E44A47",
        "button-purple": "#D83D81",
      },
      animation: {
        fadeInSlow: "fadeIn 2s linear forwards",
        fadeInFast: "fadeIn 1.5s linear forwards",
      },
    },
  },
  plugins: [],
};
