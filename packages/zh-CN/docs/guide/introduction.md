# 简介

::: tip 提示
本指南假设你熟悉 Electron 和 Vite。开始阅读之前建议先阅读 [Electron 指南](https://www.electronjs.org/docs/) 和 [Vite 指南](https://cn.vitejs.dev/guide/)。
:::

## 现实问题

得益于 Vite 卓越的前端开发体验，越来越多的 Electron 项目也开始应用它来构建开发。翻阅各种社区资源可以发现很多基于 Vite 搭建的 Electron 开发模板，但都存在着一些共同的问题：

- 配置相对复杂，繁琐

- 需要辅助脚本来配合编译开发

- 无法举一反三，自主选择前端框架（Vue、React 和 Svelte 等）

electron-vite 旨在解决这些问题，为 Electron 提供更快、更精简的开发体验。

## Electron 特性

要解决这些问题，我们需要先了解 Electron。 Electron 是一个基于 Chromium 和 Node.js 构建跨平台桌面应用程序的框架，这意味着打包工具需要同时处理 Node.js 和浏览器两种环境。

Vite 有能力同时处理这两种环境。electron-vite 在运行时会直接打包主进程和预加载脚本源码，但是对于渲染器来说，会启动一个 dev server 来使用 Vite 的 HMR，这将极大地提高 Electron 的开发效率。

<script setup>
import { withBase } from 'vitepress'
</script>

<p>
  <img :src="withBase('/ev-dev.svg')" class="ev-dev" alt="evd">
</p>

## 最佳实践

很多开发者和社区模板，都会通过开启node集成（`nodeIntegration`）和关闭上下文隔离（`contentIsolation`）的方式来开发。尽管这可以获得一点点的开发效率，但不应该被推荐，这是很不安全的做法。在 Electron 中，不仅仅是浏览器，它还提供很多强大的原生能力，如文件系统访问，shell等。事实上，最流行的 Electron 应用程序（slack、visual studio code 等）都不会这样做。

所以，electron-vite 的设计思路也会遵循这一点，包括推荐的项目结构、内置配置等。
