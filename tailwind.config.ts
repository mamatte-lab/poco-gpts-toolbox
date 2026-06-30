import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#302D28",
        cream: "#FFFDF7",
        butter: "#F9C846",
        "butter-soft": "#FFF3C4",
        line: "#EDE9DD",
        muted: "#77746D",
      },
      boxShadow: {
        soft: "0 12px 35px rgba(71, 62, 36, 0.07)",
        card: "0 5px 18px rgba(71, 62, 36, 0.06)",
      },
    },
  },
  plugins: [],
} satisfies Config;
