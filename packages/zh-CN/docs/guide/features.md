# 功能

基于 Vite，设计用于 Electron。

## Vite 支持

继承 Vite 的所有优点，使用方式与 Vite 相同。

请参阅 [Vite 功能](https://cn.vitejs.dev/guide/features.html) 。

## 完全构建

electron-vite 可以智能地为 Electron 的独特环境打包源代码。

- **主进程和预加载脚本：** 无论是在开发还是生产中，这些都会被打包成 CommonJS 模块，并在 Node.js 环境中运行。

- **渲染器：** 在开发过程中，electron-vite 会将 CommonJS / UMD 模块转换为 ES 模块以支持 HMR。在生产过程中，这些将被打包成 IIFE 模块，并在浏览器环境中运行。

## 集中配置和预设配置

当你使用 Vite 来打包你的 Electron 源代码时，项目结构可能是这样的：

```
├──main
│  ├──...
│  └──vite.config.js
├──preload
│  ├──...
│  └──vite.config.js
└──renderer
   ├──...
   └──vite.config.js
```

而在 electron-vite 中，所有的 Vite 配置都合并到一个文件中。项目结构是这样的：

```
├──src/
│  ├──main
│  ├──preload
│  └──renderer
├──electron.vite.config.js
└──package.json
```

此外，electron-vite 内置了很多配置，如`outDir`、`target`、`entry`、`formats`、`external`等，以此进行智能解析和配置检查。

## 渲染进程 HMR

得益于 Vite 极快的 HMR 功能，我们在渲染器开发中使用它。它将极大地提高 Electron 的开发效率。

查阅 [在渲染进程中使用 HMR](/guide/hmr) 部分，了解此功能的更多详细信息。

## 热重载

热重载是指在主进程或预加载脚本模块发生变化时快速重新构建并重启 Electron 程序。事实上，并不是真正的热重载，而是类似的。它为开发者带来了很好的开发体验。

查阅 [热重载](/guide/hot-reloading) 部分，了解此功能的更多详细信息。

## 资源处理

除了像 Vite 一样支持 web 应用程序中的 [静态资源处理](https://vitejs.dev/guide/assets.html) 之外，electron-vite 还优化了 Electron 主进程中的资源处理。

查阅 [资源处理](/guide/assets) 部分，了解此功能的更多详细信息。

## Electron 的 ESM 支持

Electron 从 Electron 28 开始支持 ES 模块。 electron-vite（自 2.0 起）同样支持使用 ESM 来开发和构建你的 Electron 应用程序。

查阅 [Electron 的 ESM 支持](../guide/dev.md#electron-的-esm-支持) 部分，了解此功能的更多详细信息。

## 源代码保护

electron-vite 使用 V8 字节码来保护源代码。

查阅 [源代码保护](/guide/source-code-protection) 部分，了解此功能的更多详细信息。

## TypeScript 装饰器

electron-vite 创建了一个可选的由 `swc` 驱动 `swcPlugin` 插件来替代 Vite 的 esbuild 插件以支持 TypeScript 装饰器。

查阅 [TypeScript 装饰器](/guide/typescript-decorator) 部分，了解此功能的更多详细信息。

## Worker Threads

electron-vite 为 Electron 主进程提供 Node.js 工作线程支持。

查阅 [Workers](./assets.md#导入-worker-threads) 部分，了解此功能的更多详细信息。

## 调试

非常容易在 IDE 中调试，例如 `vscode` 或 `webstorm`。

查阅 [VSCode 调试](/guide/debugging) 部分，了解此功能的更多详细信息。
