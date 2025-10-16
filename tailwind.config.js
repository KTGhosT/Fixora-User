/** @type {import('tailwindcss').Config} */
module.exports = {

  theme: {
    extend: {
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scroll-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' }, // Moves line marker down the scroll line
        },
        'orb-move-1': {
            '0%, 100%': { transform: 'translate(0, 0) scale(1.0)' },
            '30%': { transform: 'translate(50px, -50px) scale(1.1)' },
            '70%': { transform: 'translate(-50px, 50px) scale(0.9)' },
        },
        'orb-move-2': {
            '0%, 100%': { transform: 'translate(0, 0) scale(1.0)' },
            '40%': { transform: 'translate(-60px, 70px) scale(0.95)' },
            '80%': { transform: 'translate(60px, -70px) scale(1.05)' },
        },
        'float-slow': {
            '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
            '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        'float-fast': {
            '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
            '25%': { transform: 'translate(10px, -15px) rotate(10deg)' },
            '75%': { transform: 'translate(-10px, 15px) rotate(-5deg)' },
        }
      },
      animation: {
        // Main staggered visibility relies on CSS transitions, but we use this keyframe for the scroll indicator
        'scroll-down': 'scroll-down 2s infinite cubic-bezier(0.5, 0, 0.5, 1)',
        'pulse-slow': 'pulse 3s infinite',
        'orb-move-1': 'orb-move-1 30s ease-in-out infinite alternate',
        'orb-move-2': 'orb-move-2 25s ease-in-out infinite alternate-reverse',
        'float-slow': 'float-slow 20s ease-in-out infinite alternate',
        'float-fast': 'float-fast 15s ease-in-out infinite alternate',
      },
    },
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

