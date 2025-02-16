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

```js
// electron.vite.config.js
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
应该指出的是，最好的做法是将打包的代码放在**一个目录**中，因为它们都是 Electron 应用程序运行所需要的，这与源代码不同。这使得在打包 Electron 应用程序时可以轻松排除源代码以减小包的体积。
:::

## 自定义构建

构建过程可以通过多种 [构建配置选项](https://cn.vitejs.dev/config/build-options.html) 来自定义构建。具体来说，你可以通过 `build.rollupOptions` 直接调整底层的 [Rollup 选项](https://rollupjs.org/guide/en/#big-list-of-options)：

```js
// electron.vite.config.js
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

一个好的分块策略对 Electron 应用程序的性能非常重要。

你可以通过配置 `build.rollupOptions.output.manualChunks` 来自定义 chunk 的分割策略（请参阅 [Rollup 文档](https://rollupjs.org/configuration-options/#output-manualchunks)）。

```js
// electron.vite.config.ts
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

## 外部依赖

配置选项 `build.rollupOptions.external` (请参阅 [Rollup 文档](https://rollupjs.org/configuration-options/#external)) 提供了一种从输出包中排除依赖项的方法。此选项通常对 Electron 开发人员是非常有用。

例如，在 Electron 中使用 `sqlite3` node 插件：

```js
// electron.vite.config.js
export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        external: ['sqlite3']
      }
    },
  }
  // ...
})
```

在上面的配置中，它指示模块 sqlite3 应该从打包代码中排除。如果你不这么做，你会得到一个错误。

默认情况下，electron-vite 会将添加 `electron` 模块和所有 `node` 内置模块作为外部依赖项。如果开发人员添加了自己的外部依赖项，它们将自动合并。更多详情可参考 [内置配置](/config/#内置配置)。

此外，electron-vite 提供了一个 `externalizeDepsPlugin` 插件来自动外部化 `package.json` 的依赖项（`dependencies`）。我们不必在 `external` 选项中一一添加。

```js
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  // ...
})
```

了解更多有关信息，请参阅 [`dependencies` vs `devDependencies`](/guide/dev#dependencies-vs-devdependencies) 。

::: tip 推荐
对于主进程和预加载脚本，最好的做法是外部化依赖关系。对于渲染器，它通常是完全打包的，因此最好将依赖项安装在 `devDependencies` 中。这使得最终的分发包更小。
:::

## 源代码保护

请参阅 [源代码保护](/guide/source-code-protection)。
