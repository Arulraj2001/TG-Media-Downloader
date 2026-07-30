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
          dark: '#242424',    // Cinza Escuro (Charcoal background)
          surface: '#1A1A1A', // Deep surface
          light: '#FFFFFF',   // Branco
          muted: '#E6E6E6',   // Cinza Claro
          success: '#00C48C', // Verde
          warning: '#FFC700', // Amarelo
          error: '#FF4B4B',   // Vermelho
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'sm': '6px',
        'md': '12px',
        'lg': '18px',
      },
      boxShadow: {
        'subtle': '0 2px 12px rgba(0, 0, 0, 0.06)',
        'lift': '0 4px 20px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
