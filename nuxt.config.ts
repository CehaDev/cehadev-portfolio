// https://nuxt.com/docs/api/configuration/nuxt-config
const googleVerification = (process.env.NUXT_GOOGLE_VERIFICATION || '').trim()

export default defineNuxtConfig({
  compatibilityDate: '2026-08-12',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  experimental: {
    appManifest: false
  },
  css: ['~/assets/css/main.css'],
  components: [{ path: '~/components', pathPrefix: false }],
  nitro: {
    preset: 'vercel',
    xPoweredBy: false,
    hooks: {
      'render:response': (response: any) => {
        if (response?.headers) delete response.headers['x-powered-by']
      }
    }
  },
  routeRules: {
    '/admin/**': { headers: { 'x-robots-tag': 'noindex, nofollow' } },
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } }
  },
  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'CehaDev — Web Developer Portfolio',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
        { name: 'theme-color', content: '#0A0A0F' },
        { name: 'author', content: 'CehaDev' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'CehaDev Portfolio' },
        { property: 'og:title', content: 'CehaDev — Web Developer Portfolio' },
        { property: 'og:description', content: 'Portfolio CehaDev, Web Developer & Tech Enthusiast berbasis di Grobogan, Jawa Tengah.' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'CehaDev — Web Developer Portfolio' },
        { name: 'twitter:description', content: 'Portfolio CehaDev, Web Developer & Tech Enthusiast berbasis di Grobogan, Jawa Tengah.' },
        ...(googleVerification ? [{ name: 'google-site-verification', content: googleVerification }] : [])
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/ch.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }
      ],
      script: [
        {
          innerHTML:
            "(function(){try{var t=localStorage.getItem('cehadev-theme');var isDark=(t==='dark')||((t!=='light')&&(!window.matchMedia||!window.matchMedia('(prefers-color-scheme: light)').matches));if(isDark){document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})()",
          tagPosition: 'head'
        },
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'CehaDev',
            jobTitle: 'Web Developer & Tech Enthusiast',
            url: 'https://cehadev.id',
            email: 'hello@cehadev.id',
            address: { '@type': 'PostalAddress', addressLocality: 'Wirosari, Grobogan, Jawa Tengah', addressCountry: 'ID' },
            knowsAbout: ['Nuxt.js', 'Vue.js', 'Node.js', 'Tailwind CSS', 'JavaScript', 'TypeScript']
          })
        }
      ]
    }
  }
})
