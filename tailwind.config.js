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
      borderWidth: {
        DEFAULT: '1px',
        '1': '1px',
      },
      extend: {},
    },
    plugins: [],
  }
  