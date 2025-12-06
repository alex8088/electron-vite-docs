# HMR and Hot Reloading

## Using HMR

In order to use HMR in the renderer process, you need to use the `environment variables` to determine whether the window browser loads a local html file or a local URL.

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

For **multi-page** applications, you can use it like this:

```js
if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
  mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/view.html`)
} else {
  mainWindow.loadFile(path.join(__dirname, '../renderer/view.html'))
}
```

::: tip NOTE
- For development, the renderer `index.html` file needs to reference your script code via `<script type="module">`.

- For production, the `BrowserWindow` should load the `index.html` file from the output directory, not the html file of the source code.
:::

## Enabling Hot Reloading

**Hot reloading** refers to automatically rebuilding and restarting the Electron app whenever the main process or preload script files change. While it's not true hot reloading (which updates code without restart), it provides a similar development experience.

How electron-vite implements it:

- Enables Rollup watcher to monitor main process and preload script files
- Rebuilds and restarts the Electron app when main process files are modified
- Rebuilds and triggers renderer reload when preload script files are modified

There are two ways to enable it:

1. Use CLI option `-w` or `--watch`, e.g. `electron-vite dev --watch`. This is the preferred way, it's more flexible.
2. Use configuration option `build.watch` and set to `{}`. In addition, more watcher options can be configured, see [WatcherOptions](https://rollupjs.org/guide/en/#watch-options).

::: tip NOTE
Hot reloading can only be used during development.
:::

::: warning When to use hot reloading
Because the timing of reloading is uncontrollable, hot reloading cannot be perfectly implemented. In practice, hot reloading is not always beneficial, so it is recommended to use the CLI option to flexibly decide whether to enable or not.
:::
