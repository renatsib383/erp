/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'
// const primeui = require("tailwindcss-primeui");

delete colors['lightBlue'];
delete colors['warmGray'];
delete colors['trueGray'];
delete colors['coolGray'];
delete colors['blueGray'];

export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./assets/**/*.{js,ts,css,vue}",
    "./app.vue",
  ],
  darkMode: 'class',
  theme: {
    colors: colors,
    extend: {
      colors: {
        'ground-bg': 'var(--p-ground-bg)',
        'body-bg': 'var(--body)',

        'sidebar-btn-hover': '#0e314f',
        // 'sidebar-scroll-shadow': '#00182C',
        'sidebar-scroll-shadow': 'var(--dark-400)',
        // 'sidebar-scroll-line': '#2e7bb9',
        'sidebar-scroll-line': 'var(--secondary)',
        'sidebar-bg': 'var(--p-sidebar-bg)',
        'sidebar-text': 'var(--p-sidebar-text)',
        'sidebar-item-active-bg': 'var(--dark-200)',
        'sidebar-item-active-text': 'var(--p-sidebar-item-active-text)',
        'sidebar-border': 'var(--dark-200)',

        'header-bg': 'var(--p-header-bg)',
        'search-bg': 'var(--p-search-bg)',
        'search-focus-bg': 'var(--p-search-focus-bg)',
        'search-border': 'var(--p-search-border)', 

        'input-border': 'var(--p-input-border)',

        'select-border-color': 'var(--p-select-border-color)',
        'select-text-color': 'var(--p-select-text-color)',

        'input-focus-ring': 'var(--p-input-focus-ring)',

        'aside-bg': 'var(--p-aside-bg)',
        'panel-bg': 'var(--p-panel-bg)',
        'text-color': 'var(--p-text-color)',
        'content-border': 'var(--p-content-border-color)',
        'aside-btn-bg': 'var(--p-aside-btn-bg)',
        'aside-input-bg': 'var(--p-aside-input-bg)',
        'aside-input-border': 'var(--p-aside-input-border)',
        'highlight-bg': 'var(--p-highlight-background)',
        'highlight-color': 'var(--p-highlight-color)',
        'highlight-focus-bg': 'var(--p-highlight-focus-background)',
        'account-bg': 'var(--p-account-bg)',

        'modal-header': '#475569',
        'modal-header-hover': '#1e293b',
        'modal-body-bg': 'var(--p-modal-body-bg)',
        'modal-panel-bg': 'var(--p-modal-panel-bg)',

        'dark-200': 'var(--dark-200)',
        'dark-600': 'var(--dark-600)',
        'dark-800': 'var(--dark-800)',

        'btn-accent-bg': colors.emerald[500],
        'btn-accent-bg-hover': colors.emerald[700],

      },      
      height: {
        screen: '100dvh',
        content: 'calc(100% - var(--header-height))',
        header: 'var(--header-height)'
      },      
      fontSize: {
        'aside-base': ['14px', { lineHeight: '1.25' }],
        'aside-caption-field': ['14px', { lineHeight: '1' }]
      },
      padding: {
        'aside-input-px': '12px',
        'aside-input-py': '7px'
      },
    },
  },
  plugins: [require('tailwindcss-primeui')]
}
