# HMR 和热重载

## 使用 HMR

为了在渲染进程中使用模块热替换（HMR）功能，需要使用 `环境变量` 来确定窗口浏览器是加载本地 html 文件还是本地 URL。

```js
function createWindow() {
  // 创建窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js')
    }
  })

  // 开发环境加载本地 URL，生产环境加载本地 HTML 文件
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}
```

变量 `ELECTRON_RENDERER_URL` 即为 Vite 运行时的本地 URL。

如果是**多页**应用，可以这样使用：

```js
if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
  mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/view.html`)
} else {
  mainWindow.loadFile(path.join(__dirname, '../renderer/view.html'))
}
```

::: tip 提示

- 在开发环境，渲染进程 `index.html` 文件需要通过 `<script type="module">` 引用脚本。

- 在生产环境，`BrowserWindow` 加载的 `index.html` 文件应该是输出目录下的 html 文件，而不是源代码目录下的 html 文件。
  :::

## 启用热重载

**热重载** 指的是在主进程或预加载脚本文件发生变化时，自动重新构建并重启 Electron 应用。虽然这不是真正意义上的热更新（真正的热重载可以在不重启的情况下更新代码），但它能提供类似的开发体验。

electron-vite 的实现方式：

- 启用 Rollup watcher 以监听主进程和预加载脚本文件
- 当主进程文件被修改时，重新构建并重启 Electron 应用
- 当预加载脚本文件被修改时，重新构建并触发渲染进程重载

有两种启用方式：

1. 使用 CLI 选项 `-w` 或 `--watch`，例如 `electron-vite dev --watch`。这是首选方式，它更加灵活。
2. 使用配置项 `build.watch` 并设为 `{}`。此外，还可以配置更多的 watcher 选项，见 [WatcherOptions](https://rollupjs.org/guide/en/#watch-options)。

::: tip 注意
热重载只能在开发阶段中使用。
:::

::: warning 何时使用热重载
由于重载的时机不可控，热重载无法完美实现。在实践中，热重载并不总是有益的，因此建议使用 CLI 选项来灵活决定是否启用。
:::
