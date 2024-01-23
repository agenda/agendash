/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        scheduled: "#3599ea",
        queued: "#ecb32c",
        running: "#32b132",
        completed: "#348437",
        failed: "#F44336",
        repeating: "#9C27B0",
      },
    },
  },
  plugins: [],
};
