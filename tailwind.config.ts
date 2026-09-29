import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0A",
        surface: {
          DEFAULT: "#141414",
          2: "#1E1E1E",
        },
        border: "#2A2A2A",
        brand: {
          DEFAULT: "#7ED321",
          dark: "#4CAF1A",
        },
        chrome: {
          DEFAULT: "#E5E5E5",
          muted: "#A3A3A3",
        },
        danger: "#EF4444",
        warning: "#F59E0B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-exo2)", "var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #7ED321, #4CAF1A)",
        "chrome-gradient": "linear-gradient(180deg, #FFFFFF, #9CA3AF)",
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "scale(0.98)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "sheet-in": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 150ms ease-out",
        "sheet-in": "sheet-in 200ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
