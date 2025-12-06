# 隔离构建 <Badge type="info">实验性</Badge>

## 设计初衷

在开发具有多个入口点（包括动态入口点）的应用时，我们可能会遇到以下需求或问题：

- 输出为单个文件
- 确保更高效的 **tree-shaking**，以避免引入不必要的模块（通常需要通过重构或添加重复代码来解决）
- 避免生成过多的 chunk，以提升加载性能

在 Rollup 中，你可以在配置文件中导出一个数组，同时为多个互不相关的输入构建产物，例如：

```js [rollup.config.js]
export default [
  {
    input: 'main-a.js',
    output: {
      file: 'dist/bundle-a.js',
      format: 'cjs'
    }
  },
  {
    input: 'main-b.js',
    output: {
      file: 'dist/bundle-b.js',
      format: 'cjs'
    }
  }
]
```

在 electron-vite 中，也可以采用类似的多入口方式。不过我们引入了 `build.isolatedEntries` 选项来简化配置，降低开发者的负担。它主要提供以下功能：

- **自动隔离多个入口**：无需手动为每个入口单独配置。
- **智能处理共享 chunk 和资源输出**：自动管理共享依赖，避免重复打包或冲突。

## 适用场景

- **在主进程开发中**，通过 `?modulePath` 引入的模块在 v5 中默认启用了隔离构建。此行为符合开发者的预期，尤其适用于多线程开发场景，无需额外配置。

- **在预加载脚本开发中**，如果存在多个入口且有共享依赖，则需要启用隔离构建。这也是支持 Electron sandbox 的前置条件（允许输出为单一产物）。通常你还需要关闭 `build.externalizeDeps` 以启用全量打包。

```js [electron.vite.config.ts] {9,10,13,14}
import { defineConfig } from 'electron-vite'

export default defineConfig({
  // ...
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.ts'),
          test: resolve(__dirname, 'src/preload/test.ts')
        }
      },
      isolatedEntries: true，
      externalizeDeps: false
    }
  },
  // ...
})
```

- **在渲染进程开发中**，当存在多个入口时，启用隔离构建可以减少生成的 chunk 数量，从而提升渲染性能。

```js [electron.vite.config.js] {9,10,13}
import { defineConfig } from 'electron-vite'

export default defineConfig({
  // ...
  renderer: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html'),
          test: resolve(__dirname, 'src/renderer/test.html')
        }
      },
      isolatedEntries: true
    }
  },
  // ...
})
```

## 总结

当存在较多入口时，启用 `隔离构建` 会在一定程度上降低构建速度（但仍在可接受范围内）。然而，这种权衡是非常值得的，因为隔离构建不仅能显著提升应用的性能与安全性，还能降低开发复杂度、提升开发效率。

