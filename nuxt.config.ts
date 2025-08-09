// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@nuxt/icon',
    "@nuxtjs/cloudinary",
    'nuxt-auth-utils',
  ],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  nitro: {
    preset: 'vercel-edge', // Optimized for Vercel deployment
  },
  runtimeConfig: {
    // Authentication
    githubId: '',
    githubSecret: '',
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    
    // eBay Integration
    ebayClientId: process.env.EBAY_CLIENT_ID || 'RyDurham-relic-PRD-a0be0d98a-2d7a9c8b',
    ebayClientSecret: process.env.EBAY_CLIENT_SECRET || 'PRD-0be0d98a084d-54d5-4b15-a125-4c30',
    ebayDevId: process.env.EBAY_DEV_ID || 'dcb2dbc8-d680-4ed7-8763-e33e88064e97',
    ebayRuName: process.env.EBAY_RUNAME || 'Ry_Durham-RyDurham-relic--diwpygxre',
    ebayEnvironment: process.env.EBAY_ENVIRONMENT || 'Production',
    ebayOauthRedirectUri: process.env.EBAY_OAUTH_REDIRECT_URI || 'http://localhost:3000/api/auth/ebay/callback',
    
    // Payments
    stripeSecret: '',
    stripeWebhookSecret: '',
    nowpaymentsApiKey: process.env.NOWPAYMENTS_API_KEY || '',
    nowpaymentsIpnSecret: process.env.NOWPAYMENTS_IPN_SECRET || '',
    
    public: {
      cloudinaryCloudName: '',
      uploadPreset: '',
      stripeKey: '',
      nowpaymentsApiUrl: 'https://api.nowpayments.io/v1',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
    cloudinaryApiKey: '',
    cloudinaryApiSecret: '',
    
    // Database
    databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/multi-platform-ecommerce',
  },
  cloudinary: {
    cloudName: process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.NUXT_PUBLIC_UPLOAD_PRESET,
    apiKey: process.env.NUXT_CLOUDINARY_API_KEY,
  },
  // SEO and Performance
  app: {
    head: {
      title: 'Multi-Platform Inventory Management | SaaS',
      meta: [
        { name: 'description', content: 'Comprehensive inventory management for eBay, WooCommerce & Shopware with crypto payments' },
        { name: 'keywords', content: 'inventory management, ecommerce, ebay, woocommerce, shopware, cryptocurrency payments' },
        { httpEquiv: 'Content-Security-Policy', content: "script-src 'self' 'unsafe-inline' 'unsafe-eval'" }
      ]
    }
  },
  // Build optimizations for production
  build: {
    transpile: ['@prisma/client']
  }
})