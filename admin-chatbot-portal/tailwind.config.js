// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        highContrast: '#000000',
        lightContrast: '#FFFFFF',
      },
    },
  },
  plugins: [],
};
