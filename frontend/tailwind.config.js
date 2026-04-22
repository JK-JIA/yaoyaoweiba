/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff9ed",
          100: "#fdf0d1",
          300: "#f8cf8b",
          500: "#eea758",
          700: "#b16b2b",
          900: "#6f3f14"
        }
      }
    }
  },
  plugins: []
};
