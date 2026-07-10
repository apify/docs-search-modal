/** @type {import('tailwindcss').Config} */
module.exports = {
    corePlugins: {
      preflight: false,
    },
    darkMode: ['class', '[data-theme="dark"]'],
    content: [
      "./src/**/*.{js,jsx,ts,tsx,html}",
    ],
    theme: {
      borderWidth: {
        DEFAULT: '1px',
        '1': '1px',
      },
      extend: {
        colors: {
          // Apify brand tokens, injected by @apify/docs-theme (fallbacks keep the old palette)
          'apify-background': 'var(--color-neutral-background, #1e293b)',
          'apify-background-muted': 'var(--color-neutral-background-muted, #334155)',
          'apify-background-subtle': 'var(--color-neutral-background-subtle, #475569)',
          'apify-text': 'var(--color-neutral-text, #f1f5f9)',
          'apify-text-muted': 'var(--color-neutral-text-muted, #cbd5e1)',
          'apify-primary-action': 'var(--color-primary-action, #0369a1)',
        },
      },
    },
    plugins: [],
  }
  