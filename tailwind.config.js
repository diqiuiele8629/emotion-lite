/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#121212',
        card: '#1e1e1e',
        text: '#e0e0e0',
        accent: '#ff4d4d', // 愤怒红
        calm: '#4d94ff',   // 平静蓝
      },
      fontFamily: {
        sans: ['Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'shatter': 'shatter 0.6s ease-in forwards',
        'breathe': 'breathe 4s infinite ease-in-out',
        'float': 'floatAway 2s ease-in forwards',
      },
      keyframes: {
        shatter: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1) rotate(5deg)', filter: 'blur(2px)' },
          '100%': { transform: 'scale(0)', opacity: '0' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.5)', opacity: '0.3' },
        },
        floatAway: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-200px) scale(0.5)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
