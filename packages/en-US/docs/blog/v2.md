---
title: electron-vite 2.0 is out!
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
      content: Announcing electron-vite 2
  - - meta
    - property: og:image
      content: https://electron-vite.org/og-image-announcing-2.png
  - - meta
    - property: og:url
      content: https://electron-vite.org/blog
  - - meta
    - property: og:description
      content: electron-vite 2 Release Announcement
---

<style>
.content img {
  border-radius: 10px;
}
</style>

# electron-vite 2.0 is out!

_January 09, 2024_

![electron-vite 2 Announcement Cover Image](/og-image-announcing-2.png)

electron-vite is a build tool that aims to provide a faster and leaner development experience for [Electron](https://www.electronjs.org).

electron-vite 1.0 was released more then a year, and has gradually become a part of the Electron development ecosystem. Thanks to [Vite](https://vitejs.dev)'s excellent performance and development experience. On this basis, electron-vite has done a lot of design and optimization work to make it more friendly to Electron development, such as [Hot Reloading](../guide/hot-reloading.md), [Source Code Protection](../guide/source-code-protection.md), [Debugging](../guide/debugging.md) and [Asset Handling Optimization](../guide/assets.md), etc. In addition, new documentation is released to help developers, you can go to [electron-vite.org](../index.md) to enjoy the docs, and [create-electron](https://github.com/alex8088/quick-start/tree/master/packages/create-electron) templates are also provided to help you use your favorite frameworks (such as [Vue](https://vuejs.org), [React](https://react.dev), [Svelte](https://svelte.dev) and [Solid](https://www.solidjs.com)) to scaffold an Electron project.

Today, electron-vite 2.0 is out! electron-vite now properly supports Vite 5 and supports ESM in Electron.

Quick links:

- [Docs](../index.md)
- [Changelog](https://github.com/alex8088/electron-vite/blob/master/CHANGELOG.md#v200-2024-01-09)

If you're new to electron-vite, we recommend reading first the [Getting Started](../guide/index.md) and [Development](../guide/dev.md) guides.

## Quick Start with electron-vite 2

You can use `npm create @quick-start/electron` to scaffold an Electron project with your preferred framework.

## Compatibility Notes

- electron-vite no longer supports Node.js 14 / 16 / 17 / 19, which reached its EOL. Node.js 18 / 20+ is now required.

- electron-vite is now published as ESM, and the CJS export will be removed in version 3.0 as vite 6 will no longer support CJS.

For most projects, the update to electron-vite 2 should be straight forward. If you run into trouble, you can read the [Troubleshooting Guide](../guide/troubleshooting.md).

## Vite 5 Support

electron-vite 2 now properly supports Vite 5. If you are upgrading to Vite 5, it is recommended to review [Vite's Migration Guide](https://vitejs.dev/guide/migration.html) before upgrading. Additionally, electron-vite 2 removes compatibility support for Vite 3.

## Performances

On top of Vite 5's build performance improvements, electron-vite 2 enables Vite's SSR build for the main process and preload scripts, skips some plugins for the modern web, and makes some optimizations such as `package.json` caching, which improves build performance and is more suitable for Electron.

## ESM Support in Electron

Electron supports ES modules beginning in Electron 28. electron-vite 2.0 also supports using ESM to develop and build your Electron applications.

There are two ways to enable ESM for electron-vite, add `"type": "module"` to the nearest `package.json`, or set `build.rollupOptions.output.format` to `es` in the config file. But before that, you need to read [Migrating to ESM](../guide/dev.md#migrating-to-esm) guide.

electron-vite has made some compatibility with ES Modules and CommonJS syntax, allowing developers to freely switch between the two syntaxes with minimal migration work. But it should be noted that [Source Code Protection](../guide/source-code-protection.md) currently only supports CommonJS.

## Passing Arguments to Electron

In electron-vite 2.0, passing arguments to Electron applications is very simple. You can append a `--` after electron-vite CLI with the arguments to be passed.

```json
"scripts": {
  "dev": "electron-vite dev -- p1 p2"
}
```

Learn more about [Passing Arguments to Electron App](../guide/dev.md#passing-arguments-to-electron-app).

## Environment Variables

electron-vite can now share environment variables between the main process and renderers. Variables prefixed with `VITE_` are exposed to all processes.

```
SOME_KEY=123           # not available
MAIN_VITE_KEY=123      # only main process available
PRELOAD_VITE_KEY=123   # only preload scripts available
RENDERER_VITE_KEY=123  # only renderers available
VITE_KEY=123           # all available // [!code warning]
```
