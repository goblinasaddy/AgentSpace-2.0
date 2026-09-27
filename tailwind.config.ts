import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        canvas: {
          DEFAULT: "#05070B",
          secondary: "#080B12",
        },
        surface: {
          DEFAULT: "#0D1118",
          elevated: "#111722",
          panel: "#151B27",
        },
        accent: {
          purple: "#6D5DF6",
          blue: "#4D8DFF",
          lightPurple: "#A78BFA",
          success: "#34D399",
          warning: "#FBBF24",
          danger: "#FB7185",
        },
        spaceBorder: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          strong: "rgba(255, 255, 255, 0.13)",
        },
        text: {
          primary: "#F5F7FA",
          secondary: "#A7AFBF",
          muted: "#6F788A",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
    },
  },
  plugins: [],
};

export default config;
