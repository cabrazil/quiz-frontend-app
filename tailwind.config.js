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
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
        'scale-bounce': 'scale-bounce 1s ease-in-out infinite',
        'fall-slow': 'fall 3s linear infinite',
        'fall-medium': 'fall 2.5s linear infinite',
        'fall-fast': 'fall 2s linear infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'scale-bounce': {
          '0%, 100%': {
            transform: 'scale(1)',
          },
          '50%': {
            transform: 'scale(1.1)',
          },
        },
        'fall': {
          '0%': {
            transform: 'translateY(-100%)',
            opacity: 0,
          },
          '50%': {
            opacity: 1,
          },
          '100%': {
            transform: 'translateY(1000%)',
            opacity: 0,
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
} 