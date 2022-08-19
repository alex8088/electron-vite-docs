# Multiple Windows

When your electron app has multiple windows, it means there are multiple html files or preload files. You can modify your config file like this:

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
