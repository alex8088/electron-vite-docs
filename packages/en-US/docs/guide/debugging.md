# Debugging

electron-vite supports debugging both the main process and the renderer process code.

::: tip TIP
When you customize the build output directory via the `--outDir` CLI argument, the debugger configuration should also add this argument. But this is not needed when customizing via `build.outDir` of the configuration file.
:::

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

## V8 Inspector, e.g. Chrome DevTools

electron-vite also supports debugging without IDEs. Use one of the following commands to launch electron-vite.

```sh
# Electron will listen for V8 inspector.
electron-vite --inspect --sourcemap

# Like --inspect but pauses execution on the first line of JavaScript.
electron-vite --inspect-brk --sourcemap
```

Once electron-vite starts, you can use `Chrome DevTools` for this by opening `chrome://inspect` on browser and connecting to V8 inspector.

::: tip NOTE
If you want to debug the source code instead of the bundled code, you should append the `--sourcemap` option.
:::
