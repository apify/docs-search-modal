/** @type {import('tailwindcss').Config} */
module.exports = {
    corePlugins: {
      preflight: false,
    },
    darkMode: ['class', '[data-theme="dark"]'],
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  