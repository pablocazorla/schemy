/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "selector",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eefffc",
          100: "#c6fff6",
          200: "#8efff0",
          300: "#4dfbe7",
          400: "#19e8d6",
          500: "#00bdb0",
          600: "#00a49d",
          700: "#02837e",
          800: "#086765",
          900: "#0c5553",
          950: "#003334",
        },
        tool: "#f4f4f5",
        "tool-dark": "#3f3f46",
      },
    },
  },
  plugins: [],
};
