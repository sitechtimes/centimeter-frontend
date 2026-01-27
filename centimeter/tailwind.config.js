/** @type {import('tailwindcss').Config} */
export default {
  content: ["./pages/**/*.{vue,js,ts,jsx,tsx}", "./components/**/*.{vue,js,ts,jsx,tsx}", "./layouts/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    }
  },
  plugins: [],
  darkMode: "selector",
  future: {
    hoverOnlyWhenSupported: true
  }
};
