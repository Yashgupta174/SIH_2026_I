/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0284c7', // Primary healthcare blue
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#0a3651',
        },
        ayush: {
          50: '#f4fbf7',
          100: '#e1f7eb',
          500: '#10b981', // AYUSH herbal green
          700: '#047857',
        },
        emergency: {
          50: '#fff1f2',
          500: '#ef4444',
          700: '#b91c1c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
