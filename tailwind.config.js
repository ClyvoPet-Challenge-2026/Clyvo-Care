/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./index.ts", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Cores atuais (provavelente serão removidas)
        blue: "#1F6AE1",
        lightBlue: "#E6F0FA",
        text: "#1F6AE1",
        mainBackground: "#f3f5f8",
        secondaryBackground: "#FFFFFF",

        // Azuis
        brand: {
          DEFAULT: "#1f6ae1",
          hover: "#0069e8",
          ink: "#19448b",
        },
        navy: {
          DEFAULT: "#182447",
          2: "#111c3a",
        },
        soft: "#e5ebf5",

        // Neutros
        paper: "#ffffff",
        ground: "#f2f3f5",
        ink: "#0c0d10",
        body: "#393f4b",
        "soft-ink": "#525a6a",
        mute: "#6c778c",
        rule: {
          DEFAULT: "#d9dce1",
          2: "#e1e7ee",
        },

        //Status
        ok: "#008c4d",
        mint: "#99e6bf",
        warn: "#f6b60b",
        danger: "#d32f2f",
      },
    },
  },
  plugins: [],
};
