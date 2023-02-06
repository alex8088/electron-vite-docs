# Use HMR in Renderer

In order to use HMR in renderer, you need to use the `environment variables` to determine whether the window browser loads a local html file or a local URL.

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

The variable `ELECTRON_RENDERER_URL` is the local URL where Vite is running.

If there are multi-page, you can use it like this:

```js
if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
  mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/view.html`)
} else {
  mainWindow.loadFile(path.join(__dirname, '../renderer/view.html'))
}
```

::: tip NOTE
- For development, the renderer `index.html` file needs to reference your script code via `<script type="module">`.

- For production, the `BrowserWindow` load `index.html` file should be html file in the output directory, not the html file of the source code.
:::
