/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--border)",
        ring: "var(--primary)",
        background: "var(--background)",
        foreground: "var(--text)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--text)",
          dark: "var(--primary-dark)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--text)",
          dark: "var(--secondary-dark)",
        },
        destructive: {
          DEFAULT: "var(--error)",
          foreground: "var(--text)",
        },
        muted: {
          DEFAULT: "var(--card)",
          foreground: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--background)",
          dark: "var(--accent-dark)",
        },
        popover: {
          DEFAULT: "var(--card)",
          foreground: "var(--text)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--text)",
        },
        success: "var(--success)",
        error: "var(--error)",
        warning: "var(--warning)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
} 