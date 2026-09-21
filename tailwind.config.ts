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
          DEFAULT: "#05050D",
          secondary: "#080A12",
        },
        surface: {
          DEFAULT: "#0D101A",
          elevated: "#111522",
        },
        accent: {
          blue: "#4D9CFF",
          violet: "#8B5CF6",
          purple: "#A78BFA",
          magenta: "#D946EF",
          amber: "#FFB84D",
          cyan: "#22D3EE",
          success: "#34D399",
          danger: "#FB7185",
        },
        spaceBorder: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          strong: "rgba(255, 255, 255, 0.14)",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#A8ADBD",
          muted: "#6F7485",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
