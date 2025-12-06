---
layout: home
title: electron-vite
titleTemplate: 下一代 Electron 开发构建工具
hero:
  name: electron-vite
  text: 卓越的 Electron 开发构建工具
  tagline: 基于 Vite，快速、简单且功能强大！
  image:
    src: /logo.svg
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
    details: 针对 Electron 优化，并预设合理的默认配置。
  - icon: 🚀
    title: 热替换 HMR 和热重载
    details: 渲染进程采用模块热替换（HMR），主进程和预加载脚本采用热重载。
  - icon: 💡
    title: 优化资源处理
    details: 优化 Electron 主进程的资源处理。
  - icon: 🔥
    title: 隔离构建
    details: 专为多入口应用设计，消除开发复杂性，并提升程序的性能和安全性。
  - icon: ✨
    title: 简化多进程开发
    details: 通过简单的导入后缀支持 Worker Threads、Child Process 和 Utility Process。
  - icon: 🔒
    title: 源代码保护
    details: 将代码编译为 V8 字节码以保护源代码。
  - icon: 🔌
    title: 易于调试
    details: 易于在 VS Code 和 WebStorm 等 IDE 中进行调试。
  - icon: 📦
    title: 开箱即用
    details: 开箱即用，支持 Typescript、Vue、React、Svelte 和 SolidJS 等框架。
---

<script lang="ts" setup>
import Sponsor from '../.vitepress/theme/components/Sponsor.vue'
</script>

<Sponsor />
