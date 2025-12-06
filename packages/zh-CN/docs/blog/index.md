---
title: electron-vite 5.0 发布了！
author:
  name: alex.wei
date: 2025-12-07
outline: deep
sidebar: false
next: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: electron-vite 5 公告
  - - meta
    - property: og:image
      content: https://cn.electron-vite.org/og-image-announcing-5.png
  - - meta
    - property: og:url
      content: https://cn.electron-vite.org/blog
  - - meta
    - property: og:description
      content: electron-vite 5 发布公告
---

<style>
.content img {
  border-radius: 10px;
}
</style>

# electron-vite 5.0 发布了！

_2025 年 12 月 7 日_

![electron-vite 5 Announcement Cover Image](/og-image-announcing-5.png)

electron-vite 5.0 今日正式发布！这个里程碑式的版本不仅引入了多项新功能，还对核心功能进行深度优化，并重新梳理了文档，为开发者提供更流畅、更高效的开发体验。

- [Github 变更日志](https://github.com/alex8088/electron-vite/blob/master/CHANGELOG.md)

## 隔离构建

[隔离构建](../guide/isolated-build.md) 旨在解决 **多入口** 应用开发中的常见问题，例如输出单文件、高效 tree-shaking 以避免不必要的模块引入，以及减少过多的 chunk 生成。

electron-vite 5.0 引入了 `build.isolatedEntries` 选项，用于 **自动隔离多个入口**，并 **智能处理共享 chunk 和资源输出**。

**适用场景：**

- **主进程：** 通过 `?modulePath` 导入的模块默认启用隔离构建，无需额外配置。
- **预加载脚本：** 若存在多个入口点并共享依赖，则需要启用隔离构建。这是支持 Electron sandbox（允许输出为单文件 bundle）的前置条件。
- **渲染进程：** 减少生成的 chunk 数量，从而提升渲染性能。

当项目中存在大量入口点时，启用 `隔离构建` 会增加构建时间，但通常影响在可接受范围内。这个权衡是非常值得的：`隔离构建`能显著 **提升应用性能**、**增强安全性**、**降低开发复杂度**，并 **提高开发者生产力**。

## 增强字节码的字符串保护

electron-vite 5.0 引入了一个全新的基于 Babel 的字符串保护插件，用于字节码编译，带来以下增强：

- **将每个字符串编译成唯一的 IIFE 函数，实现真正的混淆，使字符串不可读**。
- **支持字符串字面量和模板字面量（仅纯静态）**。

详见 [bytecode.protectedStrings](../guide/source-code-protection.md#bytecode-protectedstrings)

## 弃用项

1. `externalizeDepsPlugin` 已被弃用，请使用 `build.externalizeDeps` 配置项替代。在 electron-vite 5.0 中，这一 **行为默认启用**。

2. `bytecodePlugin` 已被弃用，请使用 `build.bytecode` 配置项替代。

## 迁移至 v5

对于大多数项目而言，升级到 electron-vite 5 应该很简单。但我们建议在升级前先查看 [详细的迁移指南](../guide/migration.md)。
