export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc', // Light slate for admin
        surface: '#ffffff',
        primary: '#3b82f6', // Blue
        secondary: '#64748b',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        text: '#0f172a',
        muted: '#64748b',
      }
    },
  },
  plugins: [],
}
