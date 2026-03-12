export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,

  runtimeConfig: {
    apiBaseUrl: 'http://localhost:8080',
    accessTokenMaxAge: 60 * 15, // 15 minutes
    refreshTokenMaxAge: 60 * 60 * 24 * 7, // 7 jours
    public: {
      apiBase: '/api',
    },
  },

  nitro: {
    routeRules: {
      '/.well-known/**': { redirect: { to: '/', statusCode: 301 } },
    },
  },

  modules: ['@nuxtjs/tailwindcss'],
})