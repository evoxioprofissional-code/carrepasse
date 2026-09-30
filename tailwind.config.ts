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
        // Superfícies claras (o site todo segue o visual da home).
        bg: "#F4F5F7",
        surface: {
          DEFAULT: "#FFFFFF",
          2: "#F1F3F5",
        },
        border: "#E1E4E8",
        brand: {
          DEFAULT: "#7ED321",
          dark: "#4CAF1A",
        },
        chrome: {
          DEFAULT: "#15171A",
          muted: "#5E6570",
        },
        danger: {
          DEFAULT: "#EF4444",
          ink: "#B91C1C",
        },
        warning: {
          DEFAULT: "#F59E0B",
          ink: "#92400E",
        },
        // Tema claro da vitrine (home): header/hero escuros, anúncios em fundo claro.
        night: "#0F1113",
        paper: "#F4F5F7",
        ink: {
          DEFAULT: "#15171A",
          muted: "#5E6570",
        },
        line: "#E1E4E8",
        lime: {
          DEFAULT: "#7ED321",
          hover: "#8FE03A",
          ink: "#2F6B0C",
          soft: "#EAF6DC",
        },
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
