import rootTailwindConfig from '../tailwind.config.js'

/** @type {import('tailwindcss').Config} */
export default {
    ...rootTailwindConfig,
    content: [
        ...rootTailwindConfig.content,
        "../src/**/*.{js,jsx,ts,tsx,html}",
    ]
}

