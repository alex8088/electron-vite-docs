# 故障排除

请参阅 [Vite 的故障排除指南](https://cn.vitejs.dev/guide/troubleshooting.html) 和 [Rollup 的故障排除指南](https://rollupjs.org/troubleshooting/) 了解更多信息。

如果这里的建议并未帮助到你，你可以去 [GitHub issue tracker](https://github.com/alex8088/electron-vite/issues) 查看是否有人已经遇到相同的问题。如果你发现了 bug，或者 electron-vite 不能满足你的需求，欢迎提交 [issue](https://github.com/alex8088/electron-vite/issues) 或在 [GitHub 讨论区](https://github.com/alex8088/electron-vite/discussions) 发帖提问。

## 技巧

通过以下步骤，你可以快速定位并解决问题：

1. **开发阶段** — 使用 `debugger` 语句或断点来定位问题。
2. **打包前** — 运行 `preview` 命令以模拟打包环境，及早发现潜在问题。
3. **打包后** — 在应用程序的启动命令后附加 `--trace-warnings` 参数，以查看详细的错误信息。例如：
   - **Windows:** `.\app.exe --trace-warnings`
   - **macOS:** `open app.app --args --trace-warnings`
4. **如果在预览打包中运行正常但打包后出现异常** — 通常是因为某些依赖模块没有被正确打包进去。请检查所有必要模块是否安装在 `dependencies`（而非 `devDependencies`）中。
   或者可能是 **pnpm** 的问题（如果使用了 pnpm）。

## 迁移

### `The CJS build of Vite's Node API is deprecated`

从 Vite 5 开始，调用 Vite 的 CJS Node API 会触发弃用警告。`electron-vite` v2 已作为 ESM 包发布，你可以升级到最新版以解决该问题。

此外，请确保：

1. `electron.vite.config.js` 使用 **ESM 语法**。
2. 最近的 `package.json` 文件中包含 `"type": "module"`；或者，将配置文件重命名为 `.mjs` 扩展名（例如：`electron.vite.config.mjs`）。

注意：如果在项目的 `package.json` 中添加 `"type": "module"` 且 Electron 版本支持 ESM（Electron 28+），则项目会被构建为 ESM。迁移前，请阅读 [Electron 的 ESM 支持](./dev.md#electron-的-esm-支持) 指南。但如果不支持 ESM，则项目会被构建为 CommonJS，并且所有文件将使用 `.cjs` 扩展名。

如果你不想进行任何改动并希望继续以 CJS 方式构建，最简单的方式是将 `electron.vite.config.js` 重命名为 `electron.vite.config.mjs`。

## 开发

### `Unable to load preload scripts -> Error: module not found: 'XXX'`

从 Electron 20 开始，预加载脚本默认沙盒化，不再拥有完整 Node.js 环境的访问能力。

你需要在以下两种方案中进行选择：

1. 在 `BrowserWindow` 选项中设置 `sandbox: false`。
2. 将所有依赖全量打包到同一个预加载脚本中（因为处于沙盒模式的脚本无法 `require` 多个独立文件）。

- 相关：[沙盒的限制](./dev.md#沙盒的限制)
- 相关：[全量打包](./dependency-handling.md#全量打包)
- 相关：[隔离构建](./isolated-build.md)

### `Uncaught Error: Module "XXX" has been externalized for browser compatibility.` or `Uncaught ReferenceError: __dirname is not defined`

你不应该在渲染进程中使用 Node.js 模块。`electron-vite` 也不支持 `nodeIntegration`。

- 相关：[nodeIntegration](/guide/dev#nodeintegration)
- 相关：[Module externalized for browser compatibility](https://cn.vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility)

## 构建

### `Error [ERR_REQUIRE_ESM]: require() of ES Module`

出现该问题的原因是，许多库（例如 `lowdb`、`execa`、`node-fetch`）只以 **ESM 模块** 的形式发布，因此无法在 CJS 代码中通过 `require` 使用。

你可以通过以下两种方式解决：

1. **切换到 ESM** — electron-vite 提供了出色的 [ESM 支持](./dev.md#electron-的-esm-支持)，迁移过程也相对简单。
2. **将 ESM 库打包为 CJS** — 通过配置 electron-vite，将这些“仅支持 ESM”的依赖项打包，使其能够在 `CJS` 环境中正常使用。

```js [electron.vite.config.js] {7}
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    build: {
      externalizeDeps: {
        exclude: ['foo'] // <- 将相关模块添加到 'exclude' 选项中
      }
    }
  }
  // ...
})
```

相关 issue: [#35](https://github.com/alex8088/electron-vite/issues/35)

### `vue-router` 或 `react-router-dom` 开发模式正常，但在构建后无效

Electron 不管理浏览器历史记录，而是依赖同步的 URL。因此，在生产环境中，只有 **基于 hash 的路由** 才能正常工作。

- 对于 `vue-router`，请使用 `createWebHashHistory` 而不是 `createWebHistory`。
- 对于 `react-router-dom`，请使用 `HashRouter` 而不是 `BrowserRouter`。

在使用 hash 路由时，你可以在 `BrowserWindow.loadFile` 的第二个参数中指定 hash 值，来加载对应的页面。

```js
win.loadFile(path.join(import.meta.dirname, '../renderer/index.html'), {
  hash: 'home'
})
```

## 分发

### `A JavaScript error occurred in the main process -> Error: Cannot find module 'XXX'`

此错误通常是由于依赖模块未被正确打包进应用程序所导致。你可以通过以下方式解决：

- **检查依赖：**

  如果缺失的模块被放在 `devDependencies` 中，请将其重新安装到 `dependencies` 中。因为打包工具（如 `electron-builder` 或 `electron-forge`）通常会排除 `devDependencies` 下的模块。

- **针对 pnpm 用户：**

  你可以在项目根目录添加 `.npmrc` 文件，并写入 `shamefully-hoist=true` 以确保依赖被正确打包。然后删除 `node_modules` 和 `pnpm-lock.yaml`，重新安装依赖。或者，你也可以切换到其他包管理器（如 `npm` 或 `yarn`）来避免此问题。

### `A JavaScript error occurred in the main process -> Error: Invaild or incompatible cached data (cachedDataRejected)`

当启用 `build.bytecode` 时，可能会出现此问题。

为了防止此运行时错误，你需要为目标平台和架构编译对应的字节码缓存。

详细信息请参阅 [源码保护](./source-code-protection.md) 指南中的 [构建限制](./source-code-protection.md#构建限制) 部分。
