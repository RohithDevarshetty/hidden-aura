import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nord Polar Night (backgrounds)
        nord: {
          0: '#2E3440',  // darkest
          1: '#3B4252',
          2: '#434C5E',
          3: '#4C566A',  // lightest dark
        },
        // Nord Snow Storm (foregrounds)
        snow: {
          0: '#D8DEE9',  // darkest light
          1: '#E5E9F0',
          2: '#ECEFF4',  // lightest
        },
        // Nord Frost (accent colors - blues/cyans)
        frost: {
          0: '#8FBCBB',  // cyan
          1: '#88C0D0',  // light blue
          2: '#81A1C1',  // medium blue
          3: '#5E81AC',  // dark blue
        },
        // Nord Aurora (semantic colors)
        aurora: {
          red: '#BF616A',
          orange: '#D08770',
          yellow: '#EBCB8B',
          green: '#A3BE8C',
          purple: '#B48EAD',
        },
        // Convenience aliases
        primary: {
          DEFAULT: '#88C0D0',  // frost.1 - light blue
          dark: '#5E81AC',     // frost.3 - dark blue
        },
        accent: '#8FBCBB',      // frost.0 - cyan
        success: '#A3BE8C',     // aurora.green
        error: '#BF616A',       // aurora.red
        warning: '#EBCB8B',     // aurora.yellow
        info: '#81A1C1',        // frost.2 - medium blue
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-sunset": "linear-gradient(135deg, #88C0D0 0%, #8FBCBB 100%)",
        "gradient-nord": "linear-gradient(135deg, #5E81AC 0%, #88C0D0 50%, #8FBCBB 100%)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
