import { defineConfig, DefaultTheme } from 'vitepress'

const guideSidebar: DefaultTheme.SidebarGroup[] = [
  {
    text: 'Guide',
    items: [
      { text: 'Introduction', link: '/guide/introduction' },
      { text: 'Getting Started', link: '/guide/getting-started' },
      { text: 'Features', link: '/guide/features' }
    ]
  }
]

const sidebar: DefaultTheme.Sidebar = {
  '/guide': guideSidebar
}

const nav: DefaultTheme.NavItem[] = [
  { text: 'Guide', link: '/guide/getting-started', activeMatch: '^/guide/' },
  {
    text: 'Config',
    link: ''
  }
]

export default defineConfig({
  lang: 'en-US',
  title: 'electron-vite',
  description: 'Next generation Electron build tooling based on Vite.',
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }]
  ],
  srcDir: 'docs',
  lastUpdated: true,
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/alex8088/electron-vite'
      }
    ],
    logo: '/favicon.svg',
    footer: {
      message: 'Released under the MIT License',
      copyright: 'Copyright © 2022-present Alex Wei & Powered by Vite'
    },
    nav,
    sidebar
  }
})
