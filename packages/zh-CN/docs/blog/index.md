---
title: electron-vite 2.0 发布了！
author:
  name: alex.wei
date: 2024-01-09
outline: deep
sidebar: false
next: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: electron-vite 2 公告
  - - meta
    - property: og:image
      content: https://cn.electron-vite.org/og-image-announcing-2.png
  - - meta
    - property: og:url
      content: https://cn.electron-vite.org/blog
  - - meta
    - property: og:description
      content: electron-vite 2 发布公告
---

<style>
.content img {
  border-radius: 10px;
}
</style>

# electron-vite 2.0 发布了!

_January 09, 2024_

![electron-vite 2 Announcement Cover Image](/og-image-announcing-2.png)

electron-vite 是一个新型构建工具，旨在为 [Electron](https://www.electronjs.org) 提供更快、更精简的开发体验。

electron-vite 1.0 发布一年多了，已经逐渐成为 Electron 开发生态的一部分。得益于 [Vite](https://cn.vitejs.dev) 优秀的性能和开发体验。在此基础上，electron-vite 做了很多设计和优化工作，使其对 Electron 开发更加友好，例如[热重载](../guide/hot-reloading.md)、[源代码保护](../guide/source-code-protection.md)、[调试](../guide/debugging.md)和[资源处理优化](../guide/assets.md)等。此外，还发布了新的文档来帮助开发者，你可以前往 [cn.electron-vite.org](../index.md) 查看阅读，并且还提供了 [create-electron](https://github.com/alex8088/quick-start/tree/master/packages/create-electron) 模板来帮助你使用你喜欢的框架（例如 [Vue](https://vuejs.org)、[React](https://react.dev)、[Svelte](https://svelte.dev) 和 [Solid](https://www.solidjs.com)）来搭建 Electron 项目。

今天，electron-vite 2.0 正式发布了！ electron-vite 现在可以正确支持 Vite 5 并支持 Electron 的 ESM。

快速链接:

- [文档](../index.md)
- [变更日志](https://github.com/alex8088/electron-vite/blob/master/CHANGELOG.md#v200-2024-01-09)

如果你是 electron-vite 的新手，我们建议你首先阅读[入门](../guide/index.md)和[开发](../guide/dev.md)指南。

## 快速开始使用 electron-vite 2

你可以使用 `npm create @quick-start/electron` 用你喜欢的框架快速搭建 Electron 项目。

## 兼容性说明

- electron-vite 不再支持已 EOL 的 Node.js 14 / 16 / 17 / 19。现在需要 Node.js 18 / 20+。
- electron-vite 现已发布为 ESM，并且 CJS 导出将在 3.0 版本中删除，因为 Vite 6 将不再支持 CJS。

对于大多数项目来说，electron-vite 2 的更新应该是直接的。如果你遇到问题，你可以阅读 [故障排除指南](../guide/troubleshooting.md)。

## Vite 5 支持

electro-vite 2 现在可以正确支持 Vite 5。如果你要升级到 Vite 5，建议在升级之前查看 [Vite 的迁移指南](https://cn.vitejs.dev/guide/migration)。此外，electron-vite 2 删除了对 Vite 3 的兼容性支持。

## 性能

在 Vite 5 的构建性能改进之上，electron-vite 2 为主进程和预加载脚本启用了 Vite 的 SSR 构建，跳过了一些现代 Web 插件，并进行了一些优化，例如 `package.json` 缓存，从而提高了构建性能并且更适合 Electron。
​
## Electron ESM 支持

Electron 从 Electron 28 开始支持 ES 模块。 electron-vite 2.0 同样支持使用 ESM 来开发和构建你的 Electron 应用程序。

要让 electron-vite 启用 ESM 有两种方式，添加 `"type": "module"` 到最近的 `package.json`，或在配置文件中设置 `build.rollupOptions.output.format` 为 `es`。 但在此之前，你需要先阅读 [迁移至 ESM ](../guide/dev.md#迁移至-esm) 指南。

electron-vite 对 ES 模块 和 CommonJS 语法做了一定的兼容性处理，允许开发者以最少的迁移工作在两种语法之间自由切换。但需要注意的是，[源代码保护](../guide/source-code-protection.md) 目前仅支持 CommonJS。

## 传递参数给 Electron

在 electron-vite 2.0 中，向 Electron 应用程序传递参数非常简单。你可以在 electron-vite CLI 之后附加一个 `--` 以及要传递的参数。

```json
"scripts": {
  "dev": "electron-vite dev -- p1 p2"
}
```

了解更多有关 [传递参数给 Electron 应用程序](../guide/dev.md#传递参数给-electron-应用程序) 的信息。

## 环境变量

electron-vite 现在可以在主进程和渲染进程间共享环境变量。以 `VITE_` 为前缀的变量将暴露给所有进程。

```
SOME_KEY=123           # 无效变量
MAIN_VITE_KEY=123      # 仅主进程可用
PRELOAD_VITE_KEY=123   # 仅预加载脚本可用
RENDERER_VITE_KEY=123  # 仅渲染进程可用
VITE_KEY=123           # 所有进程可用 // [!code warning]
```
