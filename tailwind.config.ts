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
          DEFAULT: '#0A0A0F',
          alt: '#0B0B12'
        },
        card: {
          DEFAULT: '#13131C',
          alt: '#161620'
        },
        border: {
          DEFAULT: '#262633',
          soft: '#FFFFFF14'
        },
        primary: {
          DEFAULT: '#7C3AED',
          violet: '#8B5CF6',
          blue: '#3B82F6'
        },
        text: {
          DEFAULT: '#F5F5F7',
          secondary: '#A1A1AA',
          muted: '#71717A'
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
        'fade-up': 'fade-up 0.6s ease-out both',
        float: 'float 5s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
