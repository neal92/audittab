/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Couleurs de la charte AuditTab
        'audittab-green': {
          DEFAULT: '#00D563',
          50: '#E6FFF2',
          100: '#B3FFD9',
          200: '#80FFC0',
          300: '#4DFFA7',
          400: '#1AFF8E',
          500: '#00D563',
          600: '#00B354',
          700: '#009145',
          800: '#006F36',
          900: '#004D27',
        },
        'audittab-navy': {
          DEFAULT: '#003B5C',
          50: '#E6EEF3',
          100: '#B3CCDB',
          200: '#80AAC3',
          300: '#4D88AB',
          400: '#1A6693',
          500: '#003B5C',
          600: '#00324D',
          700: '#00293E',
          800: '#00202F',
          900: '#001720',
        },
      },
    },
  },
  plugins: [],
};
