/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'storm-blue': '#3b82f6',
        'storm-dark': '#111827',
        'storm-light': '#1f2937',
        'storm-gray': '#374151',
        'storm-accent': '#60a5fa',
      },
    },
  },
  plugins: [],
}
