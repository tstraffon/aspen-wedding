/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Aspen Fall Colors Palette
        aspen: {
          gold: '#F4A460',      // Golden aspen leaves
          amber: '#D4A373',     // Warm amber
          copper: '#B87333',    // Copper tones
          rust: '#A0522D',      // Rust red
          burgundy: '#800020',  // Deep burgundy
          sage: '#9CAF88',      // Sage green
          forest: '#2D5016',    // Forest green
          pine: '#01411C',      // Deep pine
          cream: '#F5F5DC',     // Cream/beige
          stone: '#8B8680',     // Mountain stone
        },
        primary: {
          DEFAULT: '#D4A373',   // Amber
          dark: '#B87333',      // Copper
          light: '#F4A460',     // Gold
        },
        secondary: {
          DEFAULT: '#2D5016',   // Forest green
          dark: '#01411C',      // Pine
          light: '#9CAF88',     // Sage
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'aspen-gradient': 'linear-gradient(135deg, #F4A460 0%, #D4A373 50%, #B87333 100%)',
        'mountain-gradient': 'linear-gradient(180deg, #2D5016 0%, #01411C 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
