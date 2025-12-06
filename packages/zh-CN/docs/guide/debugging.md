# 调试

electron-vite 支持调试主进程和渲染进程代码。

::: tip 提示
当你通过 `--outDir` CLI 参数自定义构建输出目录时，调试器配置也需要添加此参数。但通过配置文件的 `build.outDir` 进行自定义时则不需要这样做。
:::

## VSCode

添加文件 `.vscode/launch.json`，配置内容为：

```json [.vscode/launch.json]
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Main Process",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceRoot}",
      "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/electron-vite",
      "windows": {
        "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/electron-vite.cmd"
      },
      "runtimeArgs": ["--sourcemap"],
      "env": {
        "REMOTE_DEBUGGING_PORT": "9222"
      }
    },
    {
      "name": "Debug Renderer Process",
      "port": 9222,
      "request": "attach",
      "type": "chrome",
      "webRoot": "${workspaceFolder}/src/renderer",
      "timeout": 60000,
      "presentation": {
        "hidden": true
      }
    }
  ],
  "compounds": [
    {
      "name": "Debug All",
      "configurations": ["Debug Main Process", "Debug Renderer Process"],
      "presentation": {
        "order": 1
      }
    }
  ]
}
```

然后，在（主进程或渲染进程）源代码中设置一些断点。转到“调试”选项卡并确保选择“Debug All”，然后你可以按 F5 开始调试。

::: tip 提示
你也可以选择 `Debug Main Process` 仅调试主进程。由于渲染进程只能通过附加方式调试，所以无法单独调试渲染进程。
:::

## WebStorm

创建 `Npm` 运行配置。使用以下设置进行主进程调试：

| Setting   | Value            |
| :-------- | :--------------- |
| Command   | run              |
| Scripts   | dev              |
| Arguments | -- --sourcemap --remote-debugging-port=9222 |

同时，创建一个 `Attach to Node.js/Chrome` 运行配置。使用以下设置进行渲染进程调试：

| Setting   | Value            |
| :-------- | :--------------- |
| Host      | localhost        |
| Port      | 9222             |

然后在调试模式下运行这些配置。

## V8 Inspector, e.g. Chrome DevTools

electron-vite 还支持在没有 IDE 的情况下调试。可以使用以下命令之一启动 electron-vite。

```sh
# Electron will listen for V8 inspector.
electron-vite --inspect --sourcemap

# Like --inspect but pauses execution on the first line of JavaScript.
electron-vite --inspect-brk --sourcemap
```

一旦 electron-vite 启动，你可以通过在浏览器上打开 `chrome://inspect` 并连接到 V8 inspector 来使用 `Chrome DevTools` 调试。

::: tip 提示
如果你想调试源代码而不是打包后的代码，则应该附加 `--sourcemap` 选项。
:::
