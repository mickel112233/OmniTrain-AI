/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617',
        accent: '#38bdf8',
        success: '#10b981',
        card: '#0f172a',
        border: '#1e293b',
        text: {
          high: '#f8fafc',
          mid: '#94a3b8',
          low: '#475569'
        }
      }
    },
  },
  plugins: [],
}
