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
        display: ["clamp(3rem, 7.5vw, 5.25rem)", { lineHeight: "1.05" }],
        h1: ["clamp(2rem, 5vw, 3rem)", { lineHeight: "1.15" }],
        h2: ["clamp(1.5rem, 3.5vw, 2.125rem)", { lineHeight: "1.25" }],
        h3: ["1.25rem", { lineHeight: "1.4" }],
        body: ["1rem", { lineHeight: "1.6" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
        price: ["1.125rem", { lineHeight: "1.4", fontWeight: "600" }],
        eyebrow: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.28em" }],
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
        "card-hover": "0 12px 32px rgba(44, 31, 31, 0.12)",
        modal: "0 24px 64px rgba(44, 31, 31, 0.16)",
        btn: "0 8px 24px rgba(160, 112, 112, 0.28)",
        pill: "0 2px 10px rgba(160, 112, 112, 0.30)",
        print: "0 16px 40px rgba(44, 31, 31, 0.14)",
      },
      maxWidth: {
        content: "1200px",
      },
      height: {
        "hero-desktop": "100svh",
      },
      spacing: {
        "section-mobile": "64px",
        "section-desktop": "104px",
        "nav-mobile": "64px",
        "nav-desktop": "72px",
      },
    },
  },
  plugins: [],
};

export default config;
