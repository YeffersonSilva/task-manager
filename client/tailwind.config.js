/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#8b5cf6",
          300: "#7c3aed",
          500: "#6d28d9",
          900: "#5b21b6",
        },
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
    },
  },

  plugins: [],
};
