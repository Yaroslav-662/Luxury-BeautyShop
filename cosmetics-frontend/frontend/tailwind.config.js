/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: "#eac55f",
          400: "#d4a33c",
          500: "#b8860b",
          600: "#8c6310"
        },
        bg: {
          black: "#0b0b0c",
          dark: "#111113"
        }
      },
      borderRadius: {
        xl: "24px",
        lg: "18px",
        md: "12px"
      },
      boxShadow: {
        gold: "0 0 20px rgba(184,134,11,0.3)"
      }
    }
  },
  plugins: []
};
