/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cerulian: {
          400: '#6A8FAA',
          500: '#4A6D8C',
          600: '#3D5A7A',
          700: '#2E4760',
        },
        navy: {
          800: '#26415F',
          900: '#152238',
        },
        vermillion: '#B84030',
        glaucous: '#8A9870',
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

