# 配置

## 配置文件

当以命令行方式运行 `electron-vite` 时，electron-vite 将会自动尝试解析项目根目录下名为 `electron.vite.config.js` 的配置文件。最基本的配置文件如下所示：

```js
// electron.vite.config.js
export default {
  main: {
    // vite config options
  },
  preload: {
    // vite config options
  },
  renderer: {
    // vite config options
  }
}
```

你可以显式地通过 `--config` 命令行选项指定一个配置文件（相对于 `cwd`路径进行解析）：

```sh
electron-vite --config my-config.js
```

::: tip 提示
`electron-vite` 还支持 `.ts`、`.mjs`、`.cjs`、`.mts` 和 `.cts` 后缀的配置文件。
:::

## 配置智能提示

因为 electron-vite 本身附带 TypeScript 类型，所以你可以通过 IDE 和 jsdoc 的配合来实现智能提示：

```js
/**
 * @type {import('electron-vite').UserConfig}
 */
const config = {
  // ...
}

export default config
```

另外，你可以使用 `defineConfig` 工具函数，这样不用 jsdoc 注解也可以获取类型提示：

```js
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    // ...
  },
  preload: {
    // ...
  },
  renderer: {
    // ...
  }
})
```

## 情景配置

如果配置文件需要基于（`dev`/`serve` 或 `build`）命令或者不同的模式 (`development` 或 `production`) 来决定选项，则可以选择导出这样一个函数：

```js
import { defineConfig } from 'electron-vite'

export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return {
      // dev specific config
      main: {
        // ...
      },
      preload: {
        // ...
      },
      renderer: {
        // ...
      }
    }
  } else {
    // command === 'build'
    return {
      // build specific config
    }
  }
})
```

你还可以使用 `defineViteConfig` 函数来导出：

```js
import { defineConfig, defineViteConfig } from 'electron-vite'

export default defineConfig({
  main: {
    // ...
  },
  preload: {
    // ...
  },
  renderer: defineViteConfig(({ command, mode }) => {
    if (command === 'dev') {
      return {
        // dev specific config
      }
    } else {
      return {
        // build specific config
      }
    }
  })
})
```

::: tip 提示
`defineViteConfig` 从 Vite 导出。
:::

## 环境变量

注意 electron-vite 默认是不加载 `.env` 文件的，因为这些文件需要在执行完 electron-vite 配置后才能确定加载哪一个。不过当你的确需要时，你可以使用 electron-vite 导出的 `loadEnv` 函数来加载特定的 `.env` 文件。

```js
import { defineConfig, loadEnv } from 'electron-vite'

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // By default, only env variables prefixed with `MAIN_VITE_`,
  // `PRELOAD_VITE_` and `RENDERER_VITE_` are loaded,
  // unless the third parameter `prefixes` is changed.
  const env = loadEnv(mode)
  return {
    // electron-vite config
  }
})
```

## 内置配置

### `main` 内置配置：

| 选项                      | 默认值                   |
| ------------------------- | ------------------------  |
| `build.target`        | `node*`，自动匹配 Electron 的 Node 兼容目标（例如：Electron 20 为 `node16.15`） |
| `build.outDir`        | `out\main`（相对于项目根目录） |
| `build.lib.entry`     | `src\main\{index\|main}.{js\|ts\|mjs\|cjs}`，找不到则为空字符串 |
| `build.lib.formats`   | `cjs` |
| `build.reportCompressedSize`   | `false`, 禁用 gzip 压缩大小报告， 提高构建性能 |
| `build.rollupOptions.external` | `electron` 和所有 `node` 内置模块 |
| `build.assetDir`               | `chunks` |
| `build.minify`                 | `false` |
| `build.copyPublicDir`          | `false`, 不可改写 |
| `publicDir`                    | `resources` |
| `envPrefix`                    | `MAIN_VITE_` |

### `preload` 内置配置：

| 选项                      | 默认值                   |
| ------------------------- | ------------------------  |
| `build.target`        | `node*`，自动匹配 Electron 的 Node 兼容目标（例如：Electron 20 为 `node16.15`） |
| `build.outDir`        | `out\preload`（相对于项目根目录） |
| `build.lib.entry`     | `src\preload\{index\|preload}.{js\|ts\|mjs\|cjs}`，找不到则为空字符串 |
| `build.lib.formats`   | `cjs` |
| `build.reportCompressedSize`   | `false`, 禁用 gzip 压缩大小报告， 提高构建性能 |
| `build.rollupOptions.external` | `electron` 和所有 `node` 内置模块 |
| `build.assetDir`               | `chunks` |
| `build.minify`                 | `false` |
| `build.copyPublicDir`          | `false`, 不可改写 |
| `publicDir`                    | `resources` |
| `envPrefix`                    | `PRELOAD_VITE_` |

### `renderer` 内置配置：

| 选项                      | 默认值                   |
| ------------------------- | ------------------------  |
| `root`             | `src\renderer` |
| `build.target`     | `chrome*`，自动匹配 Electron 的 Chrome 兼容目标（例如：Electron 20 为 `chrome104`） |
| `build.outDir`     | `out\renderer`（相对于项目根目录） |
| `build.lib.entry`  | `\src\renderer\index.html`，找不到则为空字符串 |
| `build.modulePreload.polyfill` | `false`, 无需为 Electron 渲染器注入 `Module Preload` 的 polyfill |
| `build.reportCompressedSize`   | `false`, 禁用 gzip 压缩大小报告， 提高构建性能 |
| `build.minify`                 | `false` |
| `envPrefix`                    | `RENDERER_VITE_` |

### `main` and `preload` 的 define 项设置：

在 Web 开发中，Vite 会将 `'process.env.'` 替换为 `'({}).'`，这是合理和正确的。但在 Nodejs 开发中，我们有时候需要使用 `process.env` ，所以 `electron-vite` 重新预设全局变量替换，恢复其使用，预设如下：

```js
export default {
  main: {
    define: {
      'process.env': 'process.env'
    }
  }
}
```

::: tip 提示
如果你想在已有的项目中使用这些预设配置，可以使用 Vite 的插件 [vite-plugin-electron-config](https://github.com/alex8088/vite-plugin-electron-config)
:::

## Vite 配置参考

请参阅 [Vite 配置](https://cn.vitejs.dev/config).
