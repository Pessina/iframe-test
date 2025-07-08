/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#ffffff",
        card: "#111111",
        border: "#333333",
        muted: "#1a1a1a",
        'muted-foreground': "#888888",
        success: "#16a34a",
        danger: "#dc2626",
        primary: "#ffffff",
        secondary: "#333333",
      },
    },
  },
  plugins: [],
};