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
        fintech: {
          primary: '#635BFF', // Azul Fintech (Stripe Indigo)
          dark: '#0B0B0E',    // Deep Luxurious Charcoal
          surface: '#14141A', // Card surface
          light: '#FFFFFF',   // Pure White
          muted: '#E6E6E6',   // Muted
          success: '#00C48C', // Verde
          warning: '#FFC700', // Amarelo
          error: '#FF4B4B',   // Vermelho
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '14px',
        'lg': '20px',
      },
      boxShadow: {
        'subtle': '0 4px 20px -4px rgba(99, 91, 255, 0.08)',
        'lift': '0 12px 30px -10px rgba(99, 91, 255, 0.22)',
        'glow': '0 0 30px rgba(99, 91, 255, 0.35)',
      }
    },
  },
  plugins: [],
}
