/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Named token palette — keep these as the single source of truth for color.
        ink: "#1B1730", // near-black background, dark mode base
        cloud: "#FFF8EC", // warm off-white background, light mode base
        punch: "#FF5D73", // coral/pink — "No" energy, wrong-answer warmth
        zest: "#FFC93C", // egg-yolk yellow — accents, progress, highlights
        grape: "#6C5CE7", // violet — primary brand, headings
        mint: "#2EE6A6", // green — "Yes" energy, success, confetti
      },
      fontFamily: {
        display: ["Fredoka", "ui-rounded", "system-ui", "sans-serif"],
        body: ["Nunito", "system-ui", "sans-serif"],
      },
      boxShadow: {
        chunky: "0 6px 0 0 rgba(27, 23, 48, 0.85)",
        "chunky-sm": "0 4px 0 0 rgba(27, 23, 48, 0.85)",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(20px, -25px) scale(1.08)" },
          "66%": { transform: "translate(-15px, 15px) scale(0.95)" },
        },
      },
      animation: {
        wiggle: "wiggle 0.5s ease-in-out infinite",
        "pop-in": "pop-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        blob: "blob 12s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};
