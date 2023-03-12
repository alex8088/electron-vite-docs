# Debugging

electron-vite supports debugging both the main process and the renderer process code.

## VSCode

Add a file `.vscode/launch.json` with the following configuration:

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
      "webRoot": "${workspaceFolder}/src/renderer",
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

Then set some breakpoints in (main process or renderer process) source code. And go to the Debug view and ensure `Debug All` is selected. You can then press F5 to start debugging.

::: tip NOTE
You can also choose `Debug Main Process` to only debug the main process. Since renderer debugging can only be attached, so it is not possible to debug renderer alone.
:::

## WebStorm

Create a `Npm` run configuration. Use the following settings for main process debugging:

| Setting   | Value            |
| :-------- | :--------------- |
| Command   | run              |
| Scripts   | dev              |
| Arguments | --sourcemap --remote-debugging-port=9222 |

Also Create a `Attach to Node.js/Chrome` run configuration. Use the following settings for renderer process debugging:

| Setting   | Value            |
| :-------- | :--------------- |
| Host      | localhost        |
| Port      | 9222             |

Then run these configuration in debug mode.
