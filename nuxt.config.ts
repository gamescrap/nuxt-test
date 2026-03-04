
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,

  runtimeConfig: {
    apiBaseUrl: 'http://host.docker.internal:8080',
    public: {
      apiBase: '/api',
    },
  },

  nitro: {
    routeRules: {
      '/.well-known/**': { redirect: { to: '/', statusCode: 301 } },
    },
  },
})
