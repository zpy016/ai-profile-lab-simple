import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#9B4D4D",
        "primary-hover": "#8A4343",
        "primary-active": "#7A3A3A",
        "primary-surface": "#F5EAEA",
        "brand-dark": "#4A6670",
        accent: "#C49A6C",
        "accent-bg": "rgba(196, 154, 108, 0.15)",
        "accent-surface": "#FDF6EC",
        "accent-warm": "#D4C5A0",
        "accent-green": "#7A8B6F",
        "text-primary": "#2C3E50",
        "text-secondary": "#546E7A",
        "text-placeholder": "#7F8C8D",
        "text-disabled": "#A3B1B2",
        border: "#E8E4DE",
        "border-light": "#F0ECE6",
        bg: "#FAFAF7",
        surface: "#FFFFFF",
        elevated: "#F7F5F0",
        "block-self_intro": "#9B4D4D",
        "block-background": "#B8A9C9",
        "block-offer": "#A8BF9A",
        "block-need": "#C9A882",
        "block-custom": "#9BB5C4",
        success: "#7A8B6F",
        "success-surface": "#EDF2E8",
        warning: "#C49A6C",
        "warning-surface": "#FDF6EC",
        error: "#B85C5C",
        "error-surface": "#F8EDED",
        info: "#4A6670",
        "info-surface": "#EBF0F2",
      },
      fontFamily: {
        serif: ["'Noto Serif SC'", "'Source Han Serif SC'", "STSong", "SimSun", "serif"],
        sans: ["'PingFang SC'", "-apple-system", "'Helvetica Neue'", "'Microsoft YaHei'", "sans-serif"],
        mono: ["'SF Mono'", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      borderRadius: {
        card: "6px",
        btn: "4px",
        tag: "3px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(44, 62, 80, 0.06)",
        md: "0 4px 12px rgba(44, 62, 80, 0.08)",
        lg: "0 8px 24px rgba(44, 62, 80, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
