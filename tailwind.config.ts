import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "var(--ink)",
          elevated: "var(--ink-elevated)",
          soft: "var(--ink-soft)",
        },
        amber: {
          DEFAULT: "var(--amber)",
          bright: "var(--amber-bright)",
          dim: "var(--amber-dim)",
        },
        honey: "var(--honey)",
        nectar: "var(--nectar)",
        wax: "var(--wax)",
        mist: "var(--mist)",
        cell: "var(--cell)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "hive-radial":
          "radial-gradient(ellipse 80% 60% at 70% 40%, var(--amber-glow), transparent 60%)",
        "hive-veil":
          "linear-gradient(180deg, rgba(8,10,9,0.35) 0%, rgba(8,10,9,0.82) 55%, var(--ink) 100%)",
      },
      keyframes: {
        "pulse-cell": {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "0.7" },
        },
        "drift-pollen": {
          "0%": { transform: "translate(0, 0)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translate(var(--dx), var(--dy))", opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "draw-line": {
          "0%": { strokeDashoffset: "120" },
          "100%": { strokeDashoffset: "0" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        "pulse-cell": "pulse-cell 4.5s ease-in-out infinite",
        "drift-pollen": "drift-pollen 7s linear infinite",
        "fade-up": "fade-up 0.8s ease-out both",
        "draw-line": "draw-line 1.4s ease-out both",
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
