import type { ModuleOptions as SitemapModuleOptions } from '@nuxtjs/sitemap';

export default defineNuxtConfig({
  app: {
    head: {
      title: 'agents.txt',
      meta: [
        { name: 'description', content: 'agents.txt standard for Agent discovery.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' }
      ],
      htmlAttrs: {
        lang: 'en'
      }
    }
  },

  nitro: {
    compatibilityDate: '2025-01-19',
    compressPublicAssets: true,
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: ['@nuxtjs/sitemap', '@nuxtjs/tailwindcss', 'nuxt-gtag', '@nuxtjs/robots'],

  sitemap: <Partial<SitemapModuleOptions>>{
    hostname: 'https://agentstxt.dev',
    gzip: true,
    autoLastmod: true,
  },

  gtag: {
    id: 'G-140KXY2NLP'
  },
});