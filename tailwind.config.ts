import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        blush: "#ff4f87",
        wine: "#6f1235",
        ruby: "#c1123f",
        cream: "#fff3f8",
        midnight: "#1a1021"
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "heart-fall": "heart-fall 8s linear infinite",
        pulseGlow: "pulseGlow 2.5s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "heart-fall": {
          "0%": { transform: "translateY(-10vh) translateX(0)", opacity: "0" },
          "10%, 90%": { opacity: "0.8" },
          "100%": { transform: "translateY(110vh) translateX(20px)", opacity: "0" }
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 rgba(255, 79, 135, 0)" },
          "50%": { boxShadow: "0 0 24px rgba(255, 79, 135, 0.45)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
