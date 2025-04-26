// tailwind.config.js
const config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        dropShadow: "var(--dropShadow)",
      },
    },
  },
  plugins: [],
};

export default config;
