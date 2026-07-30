/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F5EEFC',
          100: '#EADCF9',
          200: '#D5B7F3',
          300: '#BF90EC',
          400: '#AA68E6',
          500: '#9562E3', // Primary purple accent
          600: '#7E42D7',
          700: '#642DC4',
          800: '#4D1EA4',
          900: '#381283',
          950: '#210859',
        },
        dark: {
          bg: '#0F0F12',
          card: '#18181D',
          border: '#2A2A32',
          muted: '#8E8E93',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(149, 98, 227, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
