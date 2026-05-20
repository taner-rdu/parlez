/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070F1A',
          900: '#0D1B2A',
          800: '#152336',
          700: '#1E3248',
        },
        cream: {
          50: '#FFFDF9',
          100: '#FAF6F0',
          200: '#F2EBE0',
        },
        gold: {
          400: '#D4A843',
          500: '#C9A84C',
          600: '#B8943A',
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

