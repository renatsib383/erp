import { ru } from './assets/ru.json';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-icon',
    'nuxt-auth-sanctum',
    'nuxt-laravel-echo',
    '@vite-pwa/nuxt'
  ],
  plugins: ['~/plugins/sanctumClient.js'],

  sanctum: {
    baseUrl: `${process.env.NUXT_PUBLIC_API_BASE}/api`,
    redirectIfAuthenticated: true,
    endpoints : {
      user: 'user',
      csrf: `${process.env.NUXT_PUBLIC_API_BASE}/sanctum/csrf-cookie`,
    },
    redirect: {
      keepRequestedRoute: true, // Сохраняем запрошенный маршрут / когда пользователь проходит по ссылке и пройдет авторизацию, редиректится обратно по ссылке
      onLogin: '/', // Куда редиректить после успешного логина, если нет запрошенного маршрута
      onLogout: '/account/login',
      onAuthOnly: '/account/login',
      onGuestOnly: '/',
    },
    globalMiddleware: {
      enabled: !!process.env.SANCTUM_GLOBAL_MIDDLEWARE,
    },
  },
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: false,
    },
    routeRules: {
      '/api/**': { proxy: `${process.env.NUXT_PUBLIC_API_BASE}/api/**` }, // Прокси с .env
    },
  },
  vite: {
    optimizeDeps: {
      include: ['pusher-js'],
    },
    build: {
      minify: false,
    },
    server: {
      proxy: {
        '/api': {
          target: process.env.NUXT_PUBLIC_API_BASE,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },
  },

  runtimeConfig: {
    public: {
      apiBase: `${process.env.NUXT_PUBLIC_API_BASE}/api`,
    },
  },
  echo: {
    broadcaster: 'pusher',
    key: '3d584d3be99b6d97aa0decc8dd0bd4ab',
    cluster: 'mt1',
    authentication:{
      mode: 'cookie',
      baseUrl: process.env.NUXT_PUBLIC_API_BASE ?? 'https://api.atloncrm.ru',
    },
    properties: {
      wsHost: 'ws.atloncrm.ru',
    },
  },

  pwa: {
    strategies: 'injectManifest', // позволяет настроить собственный sw.js
    srcDir: 'public',
    filename: 'sw.js',
    registerType: 'prompt',
    manifest: {
      name: 'AtlonCRM',
      short_name: 'AtlonCRM',
      description: 'AtlonCRM — это специализированное решение, созданное для оптимизации работы компании "Атлон ФМ". Она помогает управлять проектами, взаимодействовать с клиентами и координировать команды, поставить и отследить задачи, создать сметы и т.д.',
      theme_color: '#64748b',
      background_color: '#ffffff',
      lang: 'ru',
      categories: ['business', 'finance', 'design'],
      display: 'fullscreen',
      scope: 'https://new.atloncrm.ru/',
      start_url:  '/',
      icons: [
        {
          src: '/images/pwa/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/images/pwa/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/images/pwa/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
      screenshots: [
        {
          "src": "/images/pwa/screenshots/deals_page.png",
          "type": "image/png",
          "sizes": "1920x1080",
          "form_factor": "wide"
        },
        {
          "src": "/images/pwa/screenshots/deal_modal.png",
          "type": "image/png",
          "sizes": "1920x1080",
          "form_factor": "wide"
        },
        {
          "src": "/images/pwa/screenshots/dashboard_mob.png",
          "type": "image/png",
          "sizes": "573x1280",
          "form_factor": "narrow"
        },
        {
          "src": "/images/pwa/screenshots/dds_mob.png",
          "type": "image/png",
          "sizes": "573x1280",
          "form_factor": "narrow"
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,ico}'],
      // cleanupOutdatedCaches: false,
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,svg,ico}'],
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // Увеличиваем лимит до 5 MB - это больше для отдельных файлов, а не вообще 5мб
    },
    client: {
      installPrompt: true, // Ручное управление баннером установки (Т.е. до установки предлагает установить приложение)
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      periodicSyncForUpdates: 60,  // настроен для проверки обновлений кажд минуту
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },

  imports: {
    autoImport: true
  },

  primevue: {
    options: {
      locale: ru,
      ripple: true,
      theme: 'none'
    },
    directives: {
      include: ['Ripple', 'Tooltip']
    }
  },
  css: [
    '@/assets/css/main.css',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },

  compatibilityDate: '2024-12-21'
})