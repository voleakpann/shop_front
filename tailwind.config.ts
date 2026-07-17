import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#35b6c9", // teal accent used for prices, links, primary buttons
          dark: "#2ba0b2",
        },
        ink: "#1e1e1e", // near-black text / dark buttons
        charcoal: "#2b2b2b", // dark subscribe band
        band: "#eef1f4", // light blue-grey page-header band
        muted: "#9a9a9a", // secondary/grey text
        line: "#e6e6e6", // hairline borders
      },
      fontFamily: {
        sans: ["var(--font-jost)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "1400px",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
