# 开发

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

### 何时使用

- 使用 Node.js API，例如 `fs`。
- 使用 Electron 渲染器模块，例如 `ipcRenderer`，`webFrame`。
- 与主进程通信和交换数据。

### 关于开发效率

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

或者

```js
import { exposeElectronAPI } from '@electron-toolkit/preload'

exposeElectronAPI()
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

::: warning IPC 安全问题
最安全的方法是使用辅助函数来包装 `ipcRenderer` 调用，而不是直接通过 context bridge 暴露 ipcRenderer 模块。
:::

## `nodeIntegration`

目前，electorn-vite 不支持 `nodeIntegration`。其中一个重要的原因是 Vite 的 HMR 是基于原生 ESM 实现的。但是还有一种支持方式就是使用 `require` 导入 node 模块，不太优雅。或者你可以使用插件 [vite-plugin-commonjs-externals](https://github.com/xiaoxiangmoe/vite-plugin-commonjs-externals) 来处理。

也许将来会有更好的方法来支持。但需要注意的是，使用预加载脚本是一个更好、更安全的选择。

## `dependencies` vs `devDependencies`

**对于主进程和预加载脚本**，最佳实践是将依赖项外部化，只打包自己的代码。

**我们需要将应用程序需要的依赖安装到 `package.json` 的 `dependencies` 中**。然后使用 `externalizeDepsPlugin` 将它们外部化而不打包它们。

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

**对于渲染器**，它通常是完全打包的，所以依赖项最好安装在 `devDependencies` 中。这使得最终的分发包更小。

## 公共目录

### 对于主进程和预加载脚本

有时主进程和预加载脚本需要用到一些公共资源，比如托盘图标，可调用的第三方可执行程序等，我们只需要在根目录下创建任意目录（非输出目录）并在代码中正确引用这些资源即可。

### 对于渲染进程

默认情况下，渲染器的工作目录位于 `src/renderer`，因此需要在该目录下创建静态公共资源目录。默认的公共目录名为 `public`，也可以通过 [publicDir](https://vitejs.dev/config/shared-options.html#publicdir) 指定。
