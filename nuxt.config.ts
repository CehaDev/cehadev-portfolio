// https://nuxt.com/docs/api/configuration/nuxt-config
const googleVerification = (process.env.NUXT_GOOGLE_VERIFICATION || '').trim()

export default defineNuxtConfig({
  compatibilityDate: '2026-08-12',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  features: {
    inlineStyles: false
  },
  experimental: {
    appManifest: false
  },
  css: ['~/assets/css/main.css'],
  components: [{ path: '~/components', pathPrefix: false }],
  nitro: {
    preset: 'vercel'
  },
  routeRules: {
    '/admin/**': { headers: { 'x-robots-tag': 'noindex, nofollow' } },
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    // Konten publik jarang berubah — cache di edge CDN agar navigasi antar halaman instan
    '/api/content/site': { swr: 600 },
    '/api/content/articles': { swr: 600 },
    '/api/content/projects': { swr: 600 },
    '/api/content/skills': { swr: 600 },
    '/api/content/cv': { swr: 600 }
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
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
        { rel: 'icon', type: 'image/png', href: '/icon-192.png', sizes: '192x192' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        {
          rel: 'preload',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap',
          as: 'style',
          onload: 'this.onload=null;this.rel="stylesheet"'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap',
          media: 'print',
          onload: 'this.media="all"'
        }
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
            '@type': 'WebSite',
            name: 'CehaDev',
            alternateName: ['CehaDev Portfolio', 'cehadev-portfolio'],
            url: 'https://cehadev.id'
          })
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
