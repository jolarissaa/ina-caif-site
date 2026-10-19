import type { Config } from "tailwindcss";

// Color, type, spacing and radius values below are taken directly from the
// INA-CAIF design system (colors, type scale, spacing and radius tokens).
// Change a value here and it updates everywhere the token is used.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#FFFFFF",
        "surface-alt": "#F4F8F7",
        "surface-raised": "#FFFFFF",
        "border-subtle": "#DCE6E3",
        ink: "#16231F",
        "ink-muted": "#4A5955",
        brand: "#0F766E",
        "brand-dark": "#0B2E2A",
        "on-brand": "#FFFFFF",
        accent: "#A4C639",
        "on-accent": "#16231F",
        error: "#B3261E",
        "status-done-bg": "#D7ECD2",
        "status-done-text": "#2E7D32",
        "status-ongoing-bg": "#FBE8B8",
        "status-ongoing-text": "#8A6400",
        "status-notyet-bg": "#FADCE0",
        "status-notyet-text": "#B23A48",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "16px",
        pill: "999px",
      },
      spacing: {
        18: "4.5rem",
        30: "7.5rem",
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [],
};
export default config;
