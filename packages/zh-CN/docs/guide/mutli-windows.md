# 多窗口配置

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
