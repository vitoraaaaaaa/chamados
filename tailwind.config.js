/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' }
        }
      },
      animation: {
        'float': 'float 7s ease-in-out infinite',
      },
      backdropBlur: {
        'lg': '16px',
      },
      backgroundOpacity: {
        '80': '0.8',
      },
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
          950: '#172554',
        },
        dark: {
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
          950: '#020617',
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-filters'),
  ],
  variants: {
    extend: {
      scale: ['hover', 'focus', 'active', 'group-hover', 'dark'],
      transform: ['hover', 'focus', 'group-hover', 'dark'],
      translate: ['hover', 'focus', 'group-hover', 'dark'],
      blur: ['hover', 'focus', 'dark'],
      opacity: ['hover', 'focus', 'disabled', 'dark'],
      cursor: ['hover', 'focus', 'disabled'],
      backgroundColor: ['dark', 'hover', 'focus'],
      textColor: ['dark', 'hover', 'focus'],
      borderColor: ['dark', 'hover', 'focus'],
    }
  }
}