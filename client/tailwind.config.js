/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef4ff",
          100: "#d9e7ff",
          500: "#1c4f91",
          700: "#123d73",
          900: "#0b2343"
        }
      },
      boxShadow: {
        soft: "0 12px 30px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

