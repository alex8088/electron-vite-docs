---
layout: home
title: 下一代 Electron 开发构建工具
hero:
  name: electron-vite
  text: 下一代 Electron 开发构建工具
  tagline: 基于 Vite，快速、简单且功能强大！
  image:
    src: /favicon.svg
    alt: logo
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/
    - theme: alt
      text: 查看源码
      link: https://github.com/alex8088/electron-vite
features:
  - icon: ⚡
    title: Vite 支持
    details: 继承 Vite 的所有优点，使用方式与 Vite 相同。
  - icon: 🛠
    title: 预配置
    details: 针对 Electron 预先配置，不用担心配置问题。
  - icon: 💡
    title: 优化资源处理
    details: 优化 Electron 主进程的资源处理。
  - icon: 🚀
    title: 热替换 HMR
    details: 渲染器支持模块热替换（HMR）。
  - icon: 🔥
    title: 热重载
    details: 主进程和预加载脚本支持热重载。
  - icon: 🔌
    title: 易于调试
    details: 非常容易在 IDE 中调试，例如 vscode 或 webstorm。
  - icon: 🏷️
    title: TypeScript 装饰器
    details: 支持 TS 装饰器和元数据特性。
  - icon: 🔒
    title: 源代码保护
    details: 编译为 V8 字节码以保护源代码。
  - icon: 📦
    title: 开箱即用
    details: 开箱即用支持 Typescript、Vue、React、Svelte 和 SolidJS 等。
---

<script lang="ts" setup>
import Sponsor from '../.vitepress/theme/components/Sponsor.vue'
</script>

<Sponsor />
