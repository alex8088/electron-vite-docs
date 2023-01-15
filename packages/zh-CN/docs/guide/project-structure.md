# 项目结构

::: tip 提示
通过本节，您可以了解 electron-vite 是如何智能工作的。
:::

## 推荐项目结构

一个典型的 Electron 应用程序将具有以下项目文件结构：

```
├──src/
│  ├──main      # 主进程代码
│  ├──preload   # 预加载脚本
│  └──renderer  # 渲染器基于 Vue, React 等开发
└──package.json
```

这也是 Electron 官方推荐的。 electron-vite 也使用这种项目结构，并通过 [内置配置](/config/#built-in-config) 智能工作。强烈推荐如下项目结构：

```{4,7,11}
.
├──src
│  ├──main
│  │  ├──index.ts
│  │  └──...
│  ├──preload
│  │  ├──index.ts
│  │  └──...
│  └──renderer
│     ├──src   # with vanilla/vue/react/...
│     ├──index.html
│     └──...
├──electron.vite.config.ts
├──package.json
└──...
```

当运行 electron-vite 时，它会自动寻找主进程、渲染器和预加载脚本的入口文件。默认的入口配置：

- **主进程：** `<root>/src/main/{index|main}.{js|ts|mjs|cjs}`

- **预加载脚本：** `<root>/src/preload/{index|preload}.{js|ts|mjs|cjs}`

- **渲染器** `<root>/src/renderer/index.html`

如果找不到入口点，它将抛出一个错误。你可以通过设置 `build.lib.entry` 选项来修复它。

请在 [下一小节](#customizing-project-structure) 中查看示例。

## 自定义项目结构

尽管我们强烈推荐上面的项目结构，但这不是必需的。你可以对其进行配置以满足你的使用场景。

假设你有下面这样的项目文件结构：

```{4,7,10}
.
├──electron
│  ├──main
│  │  ├──index.ts
│  │  └──...
│  └──preload
│     ├──index.ts
│     └──...
├──src # with vanilla/vue/react/...
├──index.html
├──electron.vite.config.ts
├──package.json
└──...
```

你的 `electron.vite.config.js` 文件应该是这样：

```js
import { defineConfig } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/main/index.ts')
        }
      }
    }
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/preload/index.ts')
        }
      }
    }
  },
  renderer: {
    root: '.',
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html')
        }
      }
    }
  }
})
```
