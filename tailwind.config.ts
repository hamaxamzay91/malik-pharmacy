import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: "#0F9D58",
          dark: "#0B7A44",
          deep: "#08532F",
          pale: "#E8F5EE",
          pale2: "#DBF1E3",
        },
        blue: {
          DEFAULT: "#2563EB",
          dark: "#1D4ED8",
        },
        ink: {
          DEFAULT: "#122019",
          soft: "#3F5148",
        },
        muted: "#6B7B73",
        paper: "#FBFDFC",
        line: "#E1EBE4",
      },
      fontFamily: {
        display: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "var(--font-arabic)", "sans-serif"],
        arabic: ["var(--font-arabic)", "sans-serif"],
      },
      borderRadius: {
        xl2: "20px",
      },
      boxShadow: {
        brand: "0 20px 40px -20px rgba(15,157,88,.25)",
      },
      keyframes: {
        float: {
          "0%, 100%": { marginTop: "0px" },
          "50%": { marginTop: "-16px" },
        },
        draw: {
          to: { strokeDashoffset: "-340" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        draw: "draw 3.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
