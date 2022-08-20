# 在渲染进程中使用 HMR

为了在渲染器中使用热重载功能（HMR），需要使用 `环境变量` 来确定窗口浏览器是加载本地 html 文件还是本地 URL。

```js
function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js')
    }
  })

  // Load the local URL for development or the local
  // html file for production
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}
```

变量 `ELECTRON_RENDERER_URL` 是 Vite 开发服务运行的本地 URL。

::: tip 提示
- 在开发阶段，渲染进程 `index.html` 文件需要通过 `<script type="module">` 引用脚本。

- 在生产阶段，`BrowserWindow` 加载的 `index.html` 文件应该是输出目录下的 html 文件，而不是源代码的 html 文件。
:::
