import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        pacman: {
          yellow: "#FFFF00",
          blue: "#2121DE",
          background: "#1A1A2E",
          white: "#FFFFFF",
          red: "#FF0000",
        },
      },
      keyframes: {
        chomp: {
          "0%, 100%": { transform: "rotate(45deg)" },
          "50%": { transform: "rotate(0deg)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        chomp: "chomp 0.3s ease-in-out infinite",
        blink: "blink 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;