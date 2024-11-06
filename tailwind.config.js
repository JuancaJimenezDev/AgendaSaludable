/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // carpeta app en Next.js
    "./pages/**/*.{js,ts,jsx,tsx}", //carpeta pages en Next.js
    "./components/**/*.{js,ts,jsx,tsx}", //una carpeta components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
