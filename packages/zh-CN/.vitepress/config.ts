import { defineConfig, DefaultTheme } from 'vitepress'

const sidebar: DefaultTheme.Sidebar = {
  '/': [
    {
      text: '指南',
      items: [
        { text: '简介', link: '/guide/introduction' },
        { text: '快速开始', link: '/guide/' },
        { text: '功能', link: '/guide/features' },
        { text: '命令行界面', link: '/guide/cli' },
        { text: '开发', link: '/guide/dev' },
        { text: '资源处理', link: '/guide/assets' },
        { text: '渲染进程 HMR', link: '/guide/hmr' },
        { text: '热重载', link: '/guide/hot-reloading' },
        { text: '构建生产版本', link: '/guide/build' },
        { text: '分发', link: '/guide/distribution' },
        { text: '源代码保护', link: '/guide/source-code-protection' },
        { text: 'TS 装饰器', link: '/guide/typescript-decorator' },
        { text: '环境变量和模式', link: '/guide/env-and-mode' },
        { text: '调试', link: '/guide/debugging' },
        { text: '故障排除', link: '/guide/troubleshooting' }
      ]
    },
    {
      text: '配置',
      items: [{ text: '配置参考', link: '/config/' }]
    },
    {
      text: 'API',
      items: [{ text: 'API 索引', link: '/api/' }]
    }
  ]
}

const nav: DefaultTheme.NavItem[] = [
  {
    text: '指南',
    link: '/guide/',
    activeMatch: '^/guide|api|about/'
  },
  { text: '配置', link: '/config/', activeMatch: '^/config/' },
  {
    text: '链接',
    items: [
      { text: 'Blog', link: '/blog/', activeMatch: '^/blog/' },
      { text: '赞助', link: '/sponsor/', activeMatch: '^/sponsor/' },
      {
        items: [
          { text: 'Vite', link: 'https://cn.vitejs.dev/' },
          {
            text: 'create-electron',
            link: 'https://github.com/alex8088/quick-start/tree/master/packages/create-electron'
          }
        ]
      }
    ]
  },
  {
    text: 'v3.0.0',
    items: [
      {
        text: '更新日志',
        link: 'https://github.com/alex8088/electron-vite/blob/master/CHANGELOG.md'
      }
    ]
  }
]

export default defineConfig({
  lang: 'zh-CN',
  title: 'electron-vite',
  description: 'Next generation Electron build tooling based on Vite.',
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'icon', href: '/favicon.png', type: 'image/png' }]
  ],
  srcDir: 'docs',
  lastUpdated: true,
  cleanUrls: true,
  locales: {
    root: { label: '简体中文' },
    en: { label: 'English', link: 'https://electron-vite.org/' }
  },
  themeConfig: {
    logo: '/favicon.svg',
    outline: {
      label: '本页目录'
    },
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    lastUpdatedText: '最后更新时间',
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    search: {
      provider: 'algolia',
      options: {
        appId: 'MP97N8JN52',
        apiKey: 'fdeec9a7ea376e3133d94ccc832bd5aa',
        indexName: 'cn-evite',
        placeholder: '搜索文档',
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索'
          },
          modal: {
            searchBox: {
              resetButtonTitle: '清除查询条件',
              resetButtonAriaLabel: '清除查询条件',
              cancelButtonText: '取消',
              cancelButtonAriaLabel: '取消'
            },
            startScreen: {
              recentSearchesTitle: '搜索历史',
              noRecentSearchesText: '没有搜索历史',
              saveRecentSearchButtonTitle: '保存到搜索历史',
              removeRecentSearchButtonTitle: '从搜索历史中移除',
              favoriteSearchesTitle: '收藏',
              removeFavoriteSearchButtonTitle: '从收藏中移除'
            },
            errorScreen: {
              titleText: '无法获取结果',
              helpText: '你可能需要检查你的网络连接'
            },
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
              searchByText: '搜索供应商'
            },
            noResultsScreen: {
              noResultsText: '无法找到相关结果',
              suggestedQueryText: '你可以尝试查询',
              reportMissingResultsText: '你认为这个查询应该有结果？',
              reportMissingResultsLinkText: '向我们反馈'
            }
          }
        }
      }
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/alex8088/electron-vite'
      }
    ],
    footer: {
      message: 'Released under the MIT License',
      copyright: 'Copyright © 2022-present Alex Wei & Powered by Vite'
    },
    nav,
    sidebar
  }
})
