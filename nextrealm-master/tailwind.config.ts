import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core Void System
        void: {
          DEFAULT: '#050505',
          elevated: '#0a0a0e',
          surface: '#0d0d12',
          panel: '#12121a',
        },
        // Dominant Energy: Forge Gold
        gold: {
          DEFAULT: '#c9a24d',
          bright: '#e0b85a',
          muted: '#9a7a3a',
          dim: '#7a6030',
        },
        // Opposing Energy: Electric Cyan
        cyan: {
          DEFAULT: '#00d4ff',
          bright: '#4de8ff',
          muted: '#0099b8',
        },
        // Tertiary: Plasma Purple
        purple: {
          DEFAULT: '#8b5cf6',
          bright: '#a78bfa',
        },
        // Text System
        text: {
          primary: '#f5f5f5',
          secondary: 'rgba(255, 255, 255, 0.75)',
          muted: 'rgba(255, 255, 255, 0.5)',
          faint: 'rgba(255, 255, 255, 0.35)',
        },
      },
      fontFamily: {
        display: ['var(--font-cabinet)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(3rem, 8vw, 4.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display': ['clamp(2.25rem, 5vw, 3rem)', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'subheading': ['clamp(1.125rem, 2vw, 1.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      borderRadius: {
        'btn': '14px',
        'card': '20px',
        'panel': '24px',
        'pill': '999px',
      },
      boxShadow: {
        'glow-gold': '0 0 30px rgba(201, 162, 77, 0.4), 0 0 60px rgba(201, 162, 77, 0.15)',
        'glow-cyan': '0 0 25px rgba(0, 212, 255, 0.35), 0 0 50px rgba(0, 212, 255, 0.1)',
        'glow-purple': '0 0 25px rgba(139, 92, 246, 0.3)',
        'panel': '0 20px 60px rgba(0, 0, 0, 0.5)',
        'elevated': '0 32px 80px rgba(0, 0, 0, 0.7)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #c9a24d 0%, #9a7a3a 100%)',
        'gradient-cyan': 'linear-gradient(135deg, #00d4ff 0%, #0099b8 100%)',
        'glass-panel': 'linear-gradient(180deg, rgba(13, 13, 18, 0.95) 0%, rgba(10, 10, 14, 0.98) 100%)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'count-up': 'count-up 2s ease-out forwards',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201, 162, 77, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(201, 162, 77, 0.5), 0 0 60px rgba(201, 162, 77, 0.2)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
