import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './app.vue',
    './plugins/**/*.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'rgb(var(--color-bg) / <alpha-value>)',
          alt: 'rgb(var(--color-bg-alt) / <alpha-value>)'
        },
        card: {
          DEFAULT: 'rgb(var(--color-card) / <alpha-value>)',
          alt: 'rgb(var(--color-card-alt) / <alpha-value>)'
        },
        border: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
          soft: '#FFFFFF14'
        },
        primary: {
          DEFAULT: '#7C3AED',
          violet: '#8B5CF6',
          blue: '#3B82F6'
        },
        text: {
          DEFAULT: 'rgb(var(--color-text) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)'
        },
        success: '#22C55E'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      borderRadius: {
        btn: '10px',
        card: '14px',
        xl: '16px'
      },
      boxShadow: {
        card: '0 4px 12px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.4)',
        'btn-glow': '0 4px 16px rgba(124,58,237,0.45)'
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(90deg, #8B5CF6 0%, #3B82F6 100%)',
        'glow-circle': 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, rgba(59,130,246,0.25) 40%, transparent 70%)'
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.8s ease-out both',
        float: 'float 8s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
