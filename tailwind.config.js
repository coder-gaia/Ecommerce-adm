/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "fbfafd",
        foreground: "var(--foreground)",
        primary: "#5542f6",
        highlight: "#eae8fb",
      },
    },
  },
  plugins: [],
};
