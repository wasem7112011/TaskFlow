import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14171F",
        canvas: "#F5F6FA",
        surface: "#FFFFFF",
        line: "#E4E6EF",
        muted: "#8A8FA3",
        accent: {
          DEFAULT: "#5B54E8",
          hover: "#4A43D6",
          light: "#EEEDFD",
        },
        signal: {
          amber: "#F5A524",
          coral: "#FF6B4A",
          emerald: "#1FAE73",
          slate: "#64748B",
        },
      },
      fontFamily: {
        display: ["var(--font-jakarta)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20, 23, 31, 0.06), 0 1px 1px rgba(20, 23, 31, 0.04)",
        floating: "0 12px 32px rgba(20, 23, 31, 0.14)",
      },
      borderRadius: {
        xl2: "0.875rem",
      },
    },
  },
  plugins: [],
};
export default config;
