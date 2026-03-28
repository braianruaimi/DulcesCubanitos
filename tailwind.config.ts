import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#000000',
        neonPink: '#FF69B4',
        neonCyan: '#00FFFF',
        neonGreen: '#25D366',
        graphite: '#101010',
      },
      boxShadow: {
        neon: '0 0 0 1px rgba(255, 105, 180, 0.5), 0 0 24px rgba(0, 255, 255, 0.18)',
        button: '0 0 0 1px rgba(255, 105, 180, 0.65), 0 0 18px rgba(255, 105, 180, 0.25), 0 0 28px rgba(0, 255, 255, 0.12)',
      },
      backgroundImage: {
        'neon-grid': 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 900ms ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%': { transform: 'scale(0.94)', opacity: '0.7' },
          '50%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
