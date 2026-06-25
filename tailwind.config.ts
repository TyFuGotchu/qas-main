import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: "#0B0C10",
          900: "#12141A",
          850: "#0E1016",
          800: "#1F2833",
          700: "#2A3441",
        },
        cyan: {
          terminal: "#66FCF1",
          accent: "#00E5FF",
        },
        emerald: {
          terminal: "#45A29E",
        },
      },
      fontFamily: {
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(102,252,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(102,252,241,0.03) 1px, transparent 1px)",
        "qs-panel":
          "linear-gradient(135deg, rgba(18,20,26,0.95) 0%, rgba(11,12,16,0.9) 50%, rgba(15,18,24,0.92) 100%)",
        "qs-header-line":
          "linear-gradient(90deg, transparent 0%, rgba(0,229,255,0.4) 50%, transparent 100%)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(102,252,241,0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(102,252,241,0.4)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(0,229,255,0.15)" },
          "50%": { boxShadow: "0 0 28px rgba(0,229,255,0.45)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;