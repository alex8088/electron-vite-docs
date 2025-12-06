# 构建生产版本

当需要打包你的 Electron 应用程序以进行分发时，通常需要先运行 `electron-vite build` 命令。

## 输出目录

默认情况下，构建输出将放置在 `out`（相对于项目根目录）。

```
├──out/
│  ├──main
│  ├──preload
│  └──renderer
└──...
```

你也可以通过命令行来重新指定它，例如 `electron-vite dev/build/preview --outDir=dist`。

此外，还可以使用 `build.outDir` 选项来分别指定主进程、渲染器和预加载脚本的输出目录。

```js [electron.vite.config.js] {4,9,14}
export default defineConfig({
  main: {
    build: {
      outDir: 'dist/main'
    }
  },
  preload: {
    build: {
      outDir: 'dist/preload'
    }
  },
  renderer: {
    build: {
      outDir: 'dist/renderer'
    }
  }
})
```
::: tip 提示
建议将所有打包后的代码放在 **同一个目录** 中，因为这些代码都是 Electron 应用运行所必需的。这样做还可以在打包应用时更容易排除源代码，从而减小最终的包体积。
:::

## 自定义构建

构建过程可以通过多种 [构建配置选项](https://cn.vitejs.dev/config/build-options.html) 来自定义。具体来说，你可以通过 `build.rollupOptions` 直接调整底层的 [Rollup 选项](https://rollupjs.org/guide/en/#big-list-of-options)：

```js [electron.vite.config.js]
export default defineConfig({
  main: {
    rollupOptions: {
      // ...
    }
  },
  preload: {
    rollupOptions: {
      // ...
    }
  },
  renderer: {
    rollupOptions: {
      // ...
    }
  }
})
```

## 分块策略

有效的代码分块策略对于优化 Electron 应用的性能至关重要。

代码分块可以通过 `build.rollupOptions.output.manualChunks` 进行配置（请参阅 [Rollup 文档](https://rollupjs.org/configuration-options/#output-manualchunks)）。

```js [electron.vite.config.ts]
import { defineConfig, splitVendorChunkPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id): string | void {
            if (id.includes('foo')) {
              return 'foo'
            }
          }
        }
      }
    }
  },
  // ...
})
```

## 依赖处理

请参阅 [依赖处理](./dependency-handling.md).

## 隔离构建

请参阅 [隔离构建](./isolated-build.md).

## 源代码保护

请参阅 [源代码保护](./source-code-protection)。
