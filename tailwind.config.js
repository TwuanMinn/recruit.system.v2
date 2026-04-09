/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.04)',
        card: '0 4px 16px rgba(0,0,0,0.06)',
        elevated: '0 8px 30px rgba(0,0,0,0.08)',
        glow: '0 0 20px rgba(99,102,241,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out both',
        'fade-up': 'fadeUp 0.5s ease-out both',
        'slide-down': 'slideDown 0.3s ease-out both',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275) both',
        'count-up': 'countUp 0.6s ease-out both',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
