import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background Colors
        primaryBg: '#F7FAFC',  // Light background
        secondaryBg: '#E2E8F0', // Light grey for secondary sections

        // Text Colors
        primaryText: '#2D3748',  // Dark grey text (for light theme)
        secondaryText: '#4A5568', // Medium grey text (for light theme)
        darkText: '#EDF2F7',     // Light grey text (for dark theme)
        darkTextAlt: '#E2E8F0',  // Slightly darker grey text for dark mode

        // Accent Colors
        primaryAccent: '#3182CE', // Vivid blue for accents (links, buttons, etc.)
        hoverAccent: '#63B3ED',   // Light blue for hover effects

        // Dark Mode Colors
        darkPrimaryBg: '#1A202C', // Dark background color
        darkSecondaryBg: '#2D3748', // Dark secondary background
        darkAccent: '#90CDF4',     // Light blue for hover effects in dark mode
        darkInputBg: '#4A5568',   // Dark grey input background

        // Grey Shades
        softGrey: '#EDF2F7',      // Soft background for inputs
        mediumGrey: '#4A5568',    // Medium grey, used for dark mode inputs or borders
        borderGrey: '#CBD5E0',    // Lighter grey for borders
      },
    },
  },
  plugins: [],
} satisfies Config;
