# Debugging in VSCode

Add a file `.vscode/launch.json` with the following configuration:

```json{9,11,13}
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
      "runtimeArgs": ["--sourcemap"]
    }
  ]
}
```

Then, set some breakpoints in `main.ts` (source code), and start debugging in the `VSCode Debug View`.

::: tip NOTE
Before electron-vite 1.0.7, the `sourcemap` CLI option was not supported. For debugging, you can set `build.sourcemap` options to `true` in `electron.vite.config.js` and remove the `runtimeArgs` option for the above configuration.
:::
