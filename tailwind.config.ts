import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#E6EEF5",
          100: "#C0D4E8",
          200: "#8BB1D4",
          300: "#5A8FC0",
          400: "#2D6DAB",
          500: "#003B7A",
          600: "#003069",
          700: "#002555",
          800: "#001A40",
          900: "#000F2B",
          DEFAULT: "#003B7A",
        },
        gold: {
          50: "#FFFBE6",
          100: "#FFF4B3",
          200: "#FFED80",
          300: "#FFE54D",
          400: "#FFDE1A",
          500: "#FFD700",
          600: "#D4B300",
          700: "#AA8F00",
          800: "#806B00",
          900: "#554700",
          DEFAULT: "#FFD700",
        },
        success: {
          DEFAULT: "#28A745",
          light: "#d4edda",
          dark: "#155724",
        },
        warning: {
          DEFAULT: "#FFC107",
          light: "#fff3cd",
          dark: "#856404",
        },
        danger: {
          DEFAULT: "#DC3545",
          light: "#f8d7da",
          dark: "#721c24",
        },
        info: {
          DEFAULT: "#17A2B8",
          light: "#d1ecf1",
          dark: "#0c5460",
        },
      },
      fontFamily: {
        heading: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        body: ["var(--font-open-sans)", "Open Sans", "sans-serif"],
        accent: ["var(--font-playfair)", "Playfair Display", "serif"],
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-out forwards",
        fadeUp: "fadeUp 0.5s ease-out forwards",
        slideInLeft: "slideInLeft 0.4s ease-out forwards",
        slideInRight: "slideInRight 0.4s ease-out forwards",
        scaleIn: "scaleIn 0.3s ease-out forwards",
        progressFill: "progressFill 1s ease-out forwards",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        progressFill: {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width, 100%)" },
        },
        pulseGold: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 0 0 rgba(255, 215, 0, 0.4)" },
          "50%": { opacity: "0.9", boxShadow: "0 0 0 8px rgba(255, 215, 0, 0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 59, 122, 0.08), 0 2px 4px -2px rgba(0, 59, 122, 0.06)",
        "card-hover": "0 10px 15px -3px rgba(0, 59, 122, 0.1), 0 4px 6px -4px rgba(0, 59, 122, 0.08)",
        nav: "0 1px 3px 0 rgba(0, 59, 122, 0.1)",
        "gold-glow": "0 0 20px rgba(255, 215, 0, 0.3)",
      },
      borderRadius: {
        card: "12px",
        button: "8px",
        badge: "20px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
