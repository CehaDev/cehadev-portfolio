// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-08-12',
  devtools: { enabled: false },
  modules: ['@nuxt/content', '@nuxtjs/tailwindcss'],
  content: {
    experimental: {
      sqliteConnector: 'native'
    }
  },
  css: ['~/assets/css/main.css'],
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
        { property: 'og:description', content: 'Portfolio CehaDev, Web Developer & Tech Enthusiast berbasis di Jakarta.' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'CehaDev — Web Developer Portfolio' },
        { name: 'twitter:description', content: 'Portfolio CehaDev, Web Developer & Tech Enthusiast berbasis di Jakarta.' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'CehaDev',
            jobTitle: 'Web Developer & Tech Enthusiast',
            url: 'https://cehadev.id',
            email: 'hello@cehadev.id',
            address: { '@type': 'PostalAddress', addressLocality: 'Jakarta', addressCountry: 'ID' },
            knowsAbout: ['Nuxt.js', 'Vue.js', 'Node.js', 'Tailwind CSS', 'JavaScript', 'TypeScript']
          })
        }
      ]
    }
  }
})
