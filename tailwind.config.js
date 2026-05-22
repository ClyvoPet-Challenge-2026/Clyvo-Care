/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./index.ts", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        blue: '#1F6AE1',
        lightBlue: '#E6F0FA',
        text: '#1F6AE1',
        mainBackground: '#f3f5f8',
        secondaryBackground: '#FFFFFF',
      },
    },
  },
  plugins: [],
}