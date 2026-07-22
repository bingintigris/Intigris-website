/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Intigris brand palette (from Brandbook 2023)
        coral: {
          DEFAULT: '#ff5f36',
          50: '#ffece6',
          100: '#ffd9cd',
          700: '#d6431b',
        },
        brown: {
          DEFAULT: '#402301',
          700: '#2b1700',
          chocolate: '#6c2a05',
        },
        cream: {
          DEFAULT: '#fcf7eb',
          100: '#f4ecd8',
          paper: '#fffdf6',
        },
        washed: { green: '#4c693a' },
        soft: { blue: '#9ab8e2' },
        // Admin UI neutrals (warm-tinted so it stays on-brand)
        ink: '#402301',
        muted: '#6c5740',
        line: '#e8ddc6',
      },
      fontFamily: {
        sans: ['"Inter Tight"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(64,35,1,0.06), 0 4px 12px rgba(64,35,1,0.05)',
        pop: '0 8px 24px rgba(64,35,1,0.12)',
      },
    },
  },
  plugins: [],
};
