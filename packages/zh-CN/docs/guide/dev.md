---
outline: deep
---

# 开发

## 项目结构

### 约定

推荐使用如下项目结构：

```
.
├──src
│  ├──main
│  │  ├──index.ts
│  │  └──...
│  ├──preload
│  │  ├──index.ts
│  │  └──...
│  └──renderer    # with vue, react, etc.
│     ├──src
│     ├──index.html
│     └──...
├──electron.vite.config.ts
├──package.json
└──...
```

遵循此约定，electron-vite 可以用**最少的配置**进行工作。

当运行 electron-vite 时，它会自动寻找主进程、渲染器和预加载脚本的入口文件。默认的入口配置：

- **主进程：** `<root>/src/main/{index|main}.{js|ts|mjs|cjs}`
- **预加载脚本：** `<root>/src/preload/{index|preload}.{js|ts|mjs|cjs}`
- **渲染器：** `<root>/src/renderer/index.html`

如果找不到入口点，它将抛出一个错误。你可以通过设置 `build.rollupOptions.input` 选项来修复它。

请在 [下一小节](#customizing) 中查看示例。

### 自定义

尽管我们强烈推荐上面的项目结构，但这不是必需的。你可以对其进行配置以满足你的使用场景。

假设你有下面这样的项目文件结构：

```
.
├──electron
│  ├──main
│  │  ├──index.ts
│  │  └──...
│  └──preload
│     ├──index.ts
│     └──...
├──src   # with vue, react, etc.
├──index.html
├──electron.vite.config.ts
├──package.json
└──...
```

你的 `electron.vite.config.ts` 文件应该是这样：

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

::: warning 提示
默认情况下，渲染器的工作目录位于 `src/renderer` 中。在此示例中，渲染器的 `root` 选项应设置为 `“.”`。
:::

## 使用预加载脚本

预加载脚本会在渲染器的网页加载之前注入。 如果你想向渲染器加入需要特殊权限的功能，你可以通过 [contextBridge](https://www.electronjs.org/docs/latest/api/context-bridge) 接口定义 [全局对象](https://developer.mozilla.org/en-US/docs/Glossary/Global_object)。

预加载脚本的作用：

- **增强渲染器**：预加载脚本运行在具有 HTML DOM APIs 和 Node.js、Electron APIs 的有限子集访问权限的环境中。
- **在主进程和渲染进程之间通信**：使用 Electron 的 `ipcMain` 和 `ipcRenderer` 模块进行进程间通信（IPC）。

<script setup>
import { withBase } from 'vitepress'
</script>

<p>
  <img :src="withBase('/electron-processes.png')" class="ev-dev" alt="eproc">
</p>

了解更多有关 [预加载脚本](https://www.electronjs.org/docs/latest/tutorial/tutorial-preload)。

### 例子

1. 创建一个预加载脚本并通过 `contextBridge.exposeInMainWorld` 将 `方法` 或 `变量` 暴露给渲染器。

```js
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  ping: () => ipcRenderer.invoke('ping')
})
```

2. 将脚本附在渲染进程上，在 `BrowserWindow` 构造器中使用 `webPreferences.preload` 传入脚本的路径。

```js {7,11}
import { app, BrowserWindow } from 'electron'
import path from 'path'

const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  ipcMain.handle('ping', () => 'pong')

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})
```

3. 在渲染器进程中使用暴露的函数和变量：

```js{2}
const func = async () => {
  const response = await window.electron.ping()
  console.log(response) // prints out 'pong'
}

func()
```

### 沙盒的限制

从 Electron 20 开始，预加载脚本默认沙盒化，不再拥有完整 Node.js 环境的访问权。实际上，这意味着你只拥有一个 polyfilled 的 require 函数（类似于 Node 的 require 模块），它只能访问一组有限的 API。

| 可用的 API | 详细信息 |
| :--------------- | :--------------- |
| Electron 模块  | 仅 [渲染进程模块](https://www.electronjs.org/zh/docs/latest/api/context-bridge)  |
| Node.js 模块   | `events`, `timers`, `url`     |
| Polyfilled 的全局模块 | `Buffer`, `process`, `clearImmediate`, `setImmediate` |

::: tip 提示
因为 `require` 函数是一个功能有限的 polyfill，你无法把 preload 脚本拆成多个文件并作为 CommonJS 模块来加载，除非指定了 `sandbox: false`。
:::

在 Electron 中，可以使用 [BrowserWindow](https://www.electronjs.org/zh/docs/latest/api/browser-window) 构造函数中的 `sandbox: false` 选项在每个进程的基础上禁用渲染器沙盒。

```ts
const win = new BrowserWindow({
  webPreferences: {
    sandbox: false
  }
})
```

了解有关 [Electron 进程沙盒](https://www.electronjs.org/zh/docs/latest/tutorial/sandbox) 的更多信息。

### 高效

也许有些开发人员认为使用预加载脚本不方便且不灵活。但我们为什么要推荐：

- 这是安全的做法，大多数流行的 Electron 应用程序（slack、visual studio code 等）都这样做。
- 避免混合开发（nodejs 和浏览器），让渲染器成为一个常规的 web 应用程序，让 web 开发人员更容易上手。

基于效率考虑，推荐使用 [@electron-toolkit/preload](https://github.com/alex8088/electron-toolkit/tree/master/packages/preload)。非常容易将 Electron APIs（ipcRenderer、webFrame、process）暴露​给渲染器。

首先，在启用上下文隔离的情况下，使用 `contextBridge` 将 Electron APIs 暴露给渲染器，否则将其添加到全局 DOM。

```js
import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
}
```

然后，在渲染进程中直接使用 Electron APIs：

```js
// Send a message to the main process with no response
window.electron.ipcRenderer.send('electron:say', 'hello')

// Send a message to the main process with the response asynchronously
window.electron.ipcRenderer.invoke('electron:doAThing', '').then(re => {
  console.log(re)
})

// Receive messages from the main process
window.electron.ipcRenderer.on('electron:reply', (_, args) => {
  console.log(args)
})
```

了解更多有关 [@electron-toolkit/preload](https://github.com/alex8088/electron-toolkit/tree/master/packages/preload)。

::: tip 提示
`@electron-toolkit/preload` 需要禁用 `sandbox`。
:::

::: warning IPC 安全问题
最安全的方法是使用辅助函数来包装 `ipcRenderer` 调用，而不是直接通过 context bridge 暴露 ipcRenderer 模块。
:::

### Webview

将预加载脚本附加到 webview 的最简单方法是通过 webContents 的 `will-attach-webview` 事件处理。

```ts
mainWindow.webContents.on('will-attach-webview', (e, webPreferences) => {
  webPreferences.preload = join(__dirname, '../preload/index.js')
})
```

## `nodeIntegration`

目前，electorn-vite 不支持 `nodeIntegration`。其中一个重要的原因是 Vite 的 HMR 是基于原生 ESM 实现的。但是还有一种支持方式就是使用 `require` 导入 node 模块，不太优雅。或者你可以使用插件 [vite-plugin-commonjs-externals](https://github.com/xiaoxiangmoe/vite-plugin-commonjs-externals) 来处理。

也许将来会有更好的方法来支持。但需要注意的是，使用预加载脚本是一个更好、更安全的选择。

## `dependencies` vs `devDependencies`

- **对于主进程和预加载脚本**，最佳实践是将依赖项外部化，只打包自己的代码。

  我们需要将应用程序需要的依赖安装到 `package.json` 的 `dependencies` 中。然后使用 `externalizeDepsPlugin` 将它们外部化而不打包它们。

  ```js{5,8}
  import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

  export default defineConfig({
    main: {
      plugins: [externalizeDepsPlugin()]
    },
    preload: {
      plugins: [externalizeDepsPlugin()]
    },
    // ...
  })
  ```

  在打包应用程序的时候，这些依赖也会一起打包，比如 `electron-builder`。不用担心他们会丢失。另一方面，`devDependencies` 则不会被打包。

  值得注意的是一些只支持 `ESM` 的模块（例如 `lowdb`、`execa`、`node-fetch`），我们不应该将其外部化。我们应该让 `electron-vite` 把它打包成一个 `CJS` 标准模块来支持 Electron。

  ```js {5}
  import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

  export default defineConfig({
    main: {
      plugins: [externalizeDepsPlugin({ exclude: ['lowdb'] })],
      build: {
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('lowdb')) {
                return 'lowdb'
              }
            }
          }
        }
      }
    },
    // ...
  })
  ```

- **对于渲染器**，它通常是完全打包的，所以依赖项最好安装在 `devDependencies` 中。这使得最终的分发包更小。

## 多窗口应用程序

当 Electron 应用程序具有多窗口时，这意味着可能有多个 html 页面和预加载脚本，你可以像下面一样修改你的配置文件：

```js
// electron.vite.config.js
export default {
  main: {},
  preload: {
    build: {
      rollupOptions: {
        input: {
          browser: resolve(__dirname, 'src/preload/browser.js'),
          webview: resolve(__dirname, 'src/preload/webview.js')
        }
      }
    }
  },
  renderer: {
    build: {
      rollupOptions: {
        input: {
          browser: resolve(__dirname, 'src/renderer/browser.html'),
          webview: resolve(__dirname, 'src/renderer/webview.html')
        }
      }
    }
  }
}
```

::: tip 如何加载多页
查阅 [渲染进程 HMR](./hmr.md) 章节，了解更多详细信息。
:::

##  传递 CLI 参数给 Electron 应用程序

建议通过[环境变量和模式](./env-and-mode.md)来处理命令行参数：

- 对于 Electron CLI 命令：

```ts
import { app } from 'electron'
if (import.meta.env.MAIN_VITE_LOG === 'true') {
  app.commandLine.appendSwitch('enable-logging', 'electron_debug.log')
}
```

在开发中，可以使用上面的方法来处理。分发后，你可以直接附加 Electron 支持的参数。例如 `.\app.exe --enable-logging`。

- 对于应用程序参数：

```ts
const param = import.meta.env.MAIN_VITE_MY_PARAM === 'true' || /--myparam/.test(process.argv[2])
```

  1. 在开发中，使用 ` import.meta.env` 和 `Modes` 来决定是否使用。
  2. 在生产中，使用 `process.argv` 来处理。
