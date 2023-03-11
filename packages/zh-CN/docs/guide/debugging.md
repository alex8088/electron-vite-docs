# 调试

electron-vite 支持调试主进程和渲染进程代码。

## VSCode

添加文件 `.vscode/launch.json`，配置内容为：

```json
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
      "webRoot": "${workspaceFolder}"
    }
  ],
  "compounds": [
    {
      "name": "Debug All",
      "configurations": [
        "Debug Main Process",
        "Debug Renderer Process"
      ]
    }
  ]
}
```

然后，在（主进程或渲染进程）源代码中设置一些断点。转到“调试”选项卡并确保选择“Debug All”，然后你可以按 F5 开始调试。

## WebStorm

创建 `Npm` 运行配置。使用以下设置进行主进程调试：

| Setting   | Value            |
| :-------- | :--------------- |
| Command   | run              |
| Scripts   | dev              |
| Arguments | --sourcemap --remote-debugging-port=9222 |

同时，创建一个 `Attach to Node.js/Chrome` 运行配置。使用以下设置进行渲染进程调试：

| Setting   | Value            |
| :-------- | :--------------- |
| Host      | localhost        |
| Port      | 9222             |

然后在调试模式下运行这些配置。
