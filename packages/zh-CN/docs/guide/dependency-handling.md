---
outline: deep
---

# 依赖处理

在使用 `electron-vite` 进行打包时，依赖会被智能处理，以保持最终构建的 **轻量化**。本指南介绍依赖处理的默认行为，以及如何对其进行自定义。

## 默认行为

默认情况下，electron-vite 会将 `electron` 模块和所有 Node.js 内置模块视为外部依赖。

### `dependencies`

- **主进程和预加载脚本** —— `package.json` 中 `dependencies` 下列出的依赖会被视为外部依赖，不会被打包。

  ::: tip 为什么
  这些依赖在应用打包时（例如使用 `electron-builder`）仍会被包含进来。
  :::

- **渲染进程** —— `package.json` 中 `dependencies` 下列出的依赖会被打包。

  ::: tip 为什么
  打包依赖可以减少 chunk 数量，有助于保持渲染进程的高性能。
  :::

  ::: warning 注意
  渲染进程中使用的依赖 **最好安装为 `devDependencies`**，以帮助减小最终安装包的体积。
  :::

### `devDependencies` 和幻影依赖

只有在项目中被实际 **import** 或 **require** 的依赖才会被包含进构建中。无论这些依赖是否列在 `package.json` 的 `devDependencies`下，还是所谓的“幻影依赖”（即存在于 `node_modules` 中，但未在 `package.json` 中显式声明），只要它们在代码中被引用，就会被打包。

::: tip 注意
打包工具（如 `electron-builder`）默认会排除 `devDependencies`。
:::

## 自定义

你可以通过配置 `build.externalizeDeps.exclude` 和 `build.externalizeDeps.include` 来自定义依赖处理方式，从而更精确地控制哪些依赖被打包或外部化。

```js [electron.vite.config.js] {7}
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    build: {
      externalizeDeps: {
        exclude: ['foo']
      }
    }
  }
  // ...
})
```

在此示例中，`foo` 包会被打包。你也可以将其安装到 `devDependencies` 中，也能达到相同的效果。

::: warning 注意
在 electron-vite 5 之前，应使用 `externalizeDepsPlugin` 进行配置。
:::

## 全量打包

如果你想全量打包所有依赖，可以禁用 `build.externalizeDeps` 以关闭 electron-vite 的自动依赖处理功能。

```js [electron.vite.config.js] {6}
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    build: {
      externalizeDeps: false
    }
  }
  // ...
})
```

请注意，全量打包会显著 **增加构建时间**，你应合理规划模块的[分块策略](./build.md#chunking-strategy)，以 **避免影响应用程序的启动性能**。

::: tip 注意
在预加载脚本中，需要禁用依赖外部化以支持 Electron 的沙盒环境。更多详情，请参阅 [沙盒的限制](./dev.md#limitations-of-sandboxing)。
:::

在全量打包的场景下，有些模块无法被完全打包，例如 Node.js addon。这些模块必须保持外部化，可以通过 `build.rollupOptions.external` 进行配置。

```js [electron.vite.config.js] {5}
export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        external: ['sqlite3']
      }
    }
  }
  // ...
})
```
