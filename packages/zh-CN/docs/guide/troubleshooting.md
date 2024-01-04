# 故障排除

请参阅  [Vite 的故障排除指南](https://cn.vitejs.dev/guide/troubleshooting.html) 和 [Rollup 的故障排除指南](https://rollupjs.org/troubleshooting/) 了解更多信息。

如果这里的建议并未帮助到你，你可以去 [GitHub issue tracker](https://github.com/alex8088/electron-vite/issues) 查看是否有人已经遇到相同的问题。如果你发现了 bug，或者 electron-vite 不能满足你的需求，欢迎提交 [issue](https://github.com/alex8088/electron-vite/issues) 或在 [GitHub 讨论区](https://github.com/alex8088/electron-vite/discussions) 发帖提问。

## 技巧

通过以下几个步骤，你可以很快找到问题所在：

1. 在开发模式（dev）下，可以使用 `debugger` 方式断点调试问题。
2. 打包前，先执行 `preview` 命令，预览打包后的情况，更早发现问题。
3. 打包后，可以附加参数 `--trace-warnings` 到应用程序运行，查看错误信息。例如：`.\app.exe --trace-warnings`（在 Windows 中），`open app.app --args --trace-warnings`（在 MacOS 中）。
4. 通常 preview 命令运行正常，而打包后不正常，大概率是依赖模块未被打包进应用程序，请检查依赖模块是否安装在 `dependencies`中，也可能是 pnpm 问题（如果使用了的话）。

## 迁移

### `The CJS build of Vite's Node API is deprecated`

从 Vite 5 开始，调用 Vite 的 CJS Node API 时，会收到弃用警告日志。 electron-vite 2 现已发布为 ESM，你可以更新到最新版本。

此外，你还需要确保：

1. `electro.vite.config.js` 配置文件的内容使用 ESM 语法。
2. 最近的 `package.json` 文件中有 `"type": "module"`，或者使用 `.mjs` 扩展名，例如 `electron.vite.config.mjs`。

请注意，在项目 `package.json` 中添加 `"type": "module"` 时，如果 Electron 支持 ESM (Electron 28+)，则会构建为 ESM，需要先阅读 [Electron 的 ESM 支持](./dev.md#electron-的-esm-支持) 指南。但如果不支持 ESM，它将被构建为 CommonJS，并且所有文件都将具有 `.cjs` 扩展名。

如果你不想进行任何更改并保持打包成 CJS，最好的方式是将 `electro.vite.config.js` 重命名为 `electro.vite.config.mjs`。

## 开发

### `Unable to load preload scripts -> Error: module not found: 'XXX'`

从 Electron 20 开始，预加载脚本默认沙盒化，不再拥有完整 Node.js 环境的访问权。

你可以选择以下两种修改方式：

1. 为 `BrowserWindow` 指定 `sandbox: false`。
2. 重构预加载脚本以从渲染器中删除 Node 使用并将其打包成一个文件（不支持 require 多个文件）。

### `Uncaught Error: Module "XXX" has been externalized for browser compatibility.` or `Uncaught ReferenceError: __dirname is not defined`

目前，electorn-vite 不支持 nodeIntegration。其中一个重要的原因是 Vite 的 HMR 是基于原生 ESM 实现的。

推荐使用`预加载脚本`进行开发，避免将 Node.js 模块用于渲染器代码。如果你想这样做，你可以手动添加 polyfills，更多详情见 [nodeIntegration](/guide/dev#nodeintegration)。

- 相关: [nodeIntegration](/guide/dev#nodeintegration)
- 相关: [Module externalized for browser compatibility](https://cn.vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility)

## 构建

###  `Error [ERR_REQUIRE_ESM]: require() of ES Module`

Electron 不支持 `ESM`，所以主进程和预加载脚本的构建标准仍然是 `CJS`。发生此错误是因为模块被外部化了。对于支持 CJS 的模块，我们最好将其外部化。对于只支持 ESM 的模块（例如 lowdb、execa、node-fetch 等），我们不应该将其外部化。我们应该让 electron-vite 把它打包成一个 CJS 标准模块来支持 Electron。

要解决这个问题：

```js
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin({ exclude: ['foo'] })] // <- Add related modules to 'exclude' option
  },
  // ...
})
```

相关 issue: [#35](https://github.com/alex8088/electron-vite/issues/35)

### `vue-router` 或 `react-router-dom` 开发模式正常，但在构建后无效

Electron 不处理（浏览器）历史并使用同步 URL 加载页面。所以只有 `hash 路由` 可以工作。

- 对于 `vue-router`，你应该使用 `createWebHashHistory` 而不是 `createWebHistory`。
- 对于 `react-router-dom`，你应该使用 `HashRouter` 而不是 `BrowserRouter`。


当使用 hash 路由时，可以通过 `BrowserWindow.loadFile` 的第二个参数设置 hash 值来加载页面。

```js
win.loadFile(path.join(__dirname, '../renderer/index.html'), { hash: 'home' })
```

## 分发

### `A JavaScript error occurred in the main process -> Error: Cannot find module 'XXX'`

依赖模块未打包到应用程序中。要解决这个问题：

- 如果相关模块被安装在 `devDependencies` 中，请重新安装在 `dependencies` 中。这是因为打包工具（例如 `electron-builder`、`electron-force`）通常会排除 devDependencies 中的模块。
- 如果你使用的是 `pnpm` 包管理器，则需要在项目根目录中添加一个带有 `shamefully-hoist=true` 的 `.npmrc` 文件（以便正确打包你的依赖项）。此外，你需要删除  `node_modules` 和 `pnpm-lock.yaml`，然后重新安装模块。当然你可以切换到其他包管理器（例如 `npm`、`yarn`）来避免这个问题。

### `A JavaScript error occurred in the main process -> Error: Invaild or incompatible cached data (cachedDataRejected)`

此问题是启用字节码插件时产生的。字节码是根据 Electorn Node.js 版本和系统架构（例如 x86、x64、ARM 等）编译的。

通常使用本地 Electorn 编译字节码的 Node.js 版本和打包成应用程序的版本是一致的，除非给 electron-builder 等打包工具指定了不同的 Electorn 版本才可能导致此错误。如果有此情况，请确保编译字节码时的 Electorn Node.js 版本和打包后运行时的一致。

实际上，此错误大多数情况是由于编译时的系统架构和指定架构的 Electron 应用程序不兼容导致。例如，在 arm64 MacOS 中构建 MacOS 的 64 位应用程序，它会运行出错。因为默认构建的基于 arm64 的字节码无法在 64 位应用程序中运行。因此我们需要确保编译字节码时的系统架构和打包后运行时的一致。关于如何在同一平台打包不同架构目标应用程序，请参阅 [多平台构建](/guide/source-code-protection#%E5%A4%9A%E5%B9%B3%E5%8F%B0%E6%9E%84%E5%BB%BA) 章节。

- 相关: [源代码保护](/guide/source-code-protection)
