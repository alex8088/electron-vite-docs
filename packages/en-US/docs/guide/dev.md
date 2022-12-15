# Development

## Using Preload Scripts

Preload scripts are injected before a web page loads in the renderer. To add features to your renderer that require privileged access, you can define [global](https://developer.mozilla.org/en-US/docs/Glossary/Global_object) objects through the [contextBridge](https://www.electronjs.org/docs/latest/api/context-bridge) API.

The role of preload scripts:

- **Augmenting the renderer**: preload scripts run in a context that has access to the HTML DOM APIs and a limited subset of Node.js and Electron APIs.
- **Communicating between main and renderer processes**: use Electron's `ipcMain` and `ipcRenderer` modules for inter-process communication (IPC).

<script setup>
import { withBase } from 'vitepress'
</script>

<p>
  <img :src="withBase('/electron-processes.png')" class="ev-dev" alt="eproc">
</p>

Learn more about [preload scripts](https://www.electronjs.org/docs/latest/tutorial/tutorial-preload).

### Example

1. Create a preload script to expose `functions` and `variables` into renderer via `contextBridge.exposeInMainWorld`.

```js
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  ping: () => ipcRenderer.invoke('ping')
})
```

2. To attach this script to your renderer process, pass its path to the `webPreferences.preload` option in the `BrowserWindow` constructor:

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

3. Use exposed functions and variables in the renderer process:

```js{2}
const func = async () => {
  const response = await window.electron.ping()
  console.log(response) // prints out 'pong'
}

func()
```

### When to Use

- Use Node.js APIs, e.g. `fs`.
- Use Electron Renderer Modules, e.g. `ipcRenderer`, `webFrame`.
- Communicate and exchange data with the main process.

### About Development Efficiency

Perhaps some developers think that using preload scripts is inconvenient and inflexible. But why we recommend:

- It's safe practice, most popular Electron apps (slack, visual studio code, etc.) do this.
- Avoid mixed development (nodejs and browser), make renderer as a regular web app and easier to get started for web developers.

Based on efficiency considerations, it is recommended to use [@electron-toolkit/preload](https://github.com/alex8088/electron-toolkit/tree/master/packages/preload). It's very easy to expose Electron APIs (ipcRenderer, webFrame, process) into renderer.

First, use `contextBridge` to expose Electron APIs into renderer only if context isolation is enabled, otherwise just add to the DOM global.

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

Or

```js
import { exposeElectronAPI } from '@electron-toolkit/preload'

exposeElectronAPI()
```

Then, use the Electron APIs directly in the renderer process：

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

Learn more about [@electron-toolkit/preload](https://github.com/alex8088/electron-toolkit/tree/master/packages/preload).

::: warning IPC SECURITY
The safest way is to use a helper function to wrap the `ipcRenderer` call rather than expose the ipcRenderer module directly via context bridge.
:::

## `nodeIntegration`

Currently, electorn-vite not support `nodeIntegration`. One of the important reasons is that vite's  HMR is implemented based on native ESM. But there is also a way to support that is to use `require` to import the node module which is not very elegant. Or you can use plugin [vite-plugin-commonjs-externals](https://github.com/xiaoxiangmoe/vite-plugin-commonjs-externals) to handle.

Perhaps there's a better way to support this in the future. But It is important to note that  using preload scripts is a better and safer option.

## `dependencies` vs `devDependencies`

**For the main process and preload scripts**, the best practice is to externalize dependencies and only bundle our own code.

**We need to install the dependencies required by the app into the `dependencies` of `package.json`**. Then use `externalizeDepsPlugin` to externalize them without bundle them.

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

When packaging the app, these dependencies will also be packaged together, such as `electron-builder`. Don't worry about them being lost. On the other hand, `devDependencies` will not be packaged.

It is important to note that some modules that only support `ESM` (e.g. `lowdb`, `execa`, `node-fetch`), we should not externalize it. We should let `electron-vite` bundle it into a `CJS` standard module to support Electron.

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

**For renderers**, it is usually fully bundle, so dependencies are best installed in `devDependencies`. This makes the final package more smaller.

## Public Directory

### For Main Process and Preload Scripts

Sometimes the main process and the preload script need to use some public resources, such as tray icons, third-party executable programs that can be called, etc. We just need to create arbitrary directories (not output dir) in the root and properly reference these resources in the code.

### For Renderes

By default, the working directory of renderers are located in `src/renderer`, so the static public assets directory needs to be created in this directory. The default public directory is named `public`, which can also be specified by [publicDir](https://vitejs.dev/config/shared-options.html#publicdir).
