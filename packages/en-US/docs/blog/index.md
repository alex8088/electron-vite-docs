---
title: electron-vite 5.0 is out!
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
      content: Announcing electron-vite 5
  - - meta
    - property: og:image
      content: https://electron-vite.org/og-image-announcing-5.png
  - - meta
    - property: og:url
      content: https://electron-vite.org/blog
  - - meta
    - property: og:description
      content: electron-vite 5 Release Announcement
---

<style>
.content img {
  border-radius: 10px;
}
</style>

# electron-vite 5.0 is out!

_December 7, 2025_

![electron-vite 5 Announcement Cover Image](/og-image-announcing-5.png)

electron-vite 5.0 is officially released today! This milestone version introduces multiple new features, optimizes core functionality, and thoroughly reorganizes the documentation, providing developers with a smoother and more efficient development experience.

- [Github Changelog](https://github.com/alex8088/electron-vite/blob/master/CHANGELOG.md)

## Isolate Build

[Isolated Build](../guide/isolated-build.md) is designed to address common challenges in **multi-entry** application development, such as outputting a single file, efficient tree-shaking to avoid unnecessary module imports, and reducing excessive chunk generation.

electron-vite 5.0 introduces the `build.isolatedEntries` option, which enables **automatic isolation of multiple entries** and **intelligent handling of shared chunks and asset outputs**.

**Use Cases:**

- **Main process:** modules imported via `?modulePath` have isolated builds enabled by default, with no configuration required.
- **Preload scripts:** if there are multiple entry points with shared imports, enabling isolated builds is necessary. This is a prerequisite for supporting the Electron sandbox (allowing output as a single bundle).
- **Renderer process:** Reduces the number of generated chunks, thereby improving rendering performance.

When there are many entry points in a project, enabling `Isolated Build` will increase build times, but this impact is typically within an acceptable range. The trade-off is well worth it: `Isolated Build` significantly **improves application performance**, **enhances security**, **reduces development complexity**, and **increases developer productivity**.

## Enhanced string protection for Bytecode

In electron-vite 5.0, a brand-new Babel-based string protection plugin has been introduced for bytecode compilation, featuring the following protection enhancements:

- **Compiles each string into a unique IIFE function, providing true obfuscation and making strings unreadable**.
- **Supports both string literals and template literals (static-only)**.

See [bytecode.protectedStrings](../guide/source-code-protection.md#bytecode-protectedstrings)

## Deprecations

1. `externalizeDepsPlugin` is deprecated, use `build.externalizeDeps` config option instead. In electron-vite 5.0, this **behavior is enabled by default**.

2. `bytecodePlugin` is deprecated, use `build.bytecode` config option instead.

## Migrating to v5

For most projects, the update to electron-vite 5 should be straight forward. But we advise reviewing the [detailed Migration Guide](../guide/migration.md) before upgrading.

