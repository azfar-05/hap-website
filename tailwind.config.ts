import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F5EFE6",
        surface: "#FDF8F2",
        "surface-hover": "#F0E8DE",
        brand: "#A07070",
        accent: "#C4967A",
        "hap-text": "#2C1F1F",
        muted: "#7A6259",
        border: "#E0D5C8",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(2.5rem, 7vw, 4.5rem)", { lineHeight: "1.1" }],
        h1: ["clamp(2rem, 5vw, 3rem)", { lineHeight: "1.2" }],
        h2: ["clamp(1.5rem, 3.5vw, 2rem)", { lineHeight: "1.3" }],
        h3: ["1.25rem", { lineHeight: "1.4" }],
        body: ["1rem", { lineHeight: "1.6" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
        price: ["1.125rem", { lineHeight: "1.4", fontWeight: "600" }],
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
        input: "8px",
        badge: "999px",
        image: "16px",
      },
      boxShadow: {
        "card-rest": "0 2px 8px rgba(44, 31, 31, 0.06)",
        "card-hover": "0 8px 24px rgba(44, 31, 31, 0.12)",
        modal: "0 24px 64px rgba(44, 31, 31, 0.16)",
      },
      maxWidth: {
        content: "1200px",
      },
      spacing: {
        "section-mobile": "48px",
        "section-desktop": "80px",
        "nav-mobile": "64px",
        "nav-desktop": "72px",
      },
    },
  },
  plugins: [],
};

export default config;
