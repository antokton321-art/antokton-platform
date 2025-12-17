import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e0f0ff',
          100: '#b3d9ff',
          200: '#80c1ff',
          300: '#4daaff',
          400: '#1a92ff',
          500: '#0079e6',
          600: '#005fb4',
          700: '#004581',
          800: '#002b4f',
          900: '#00121f'
        }
      }
    }
  },
  plugins: []
};

export default config;