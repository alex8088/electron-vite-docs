# 使用 VSCode 调试

添加文件 `.vscode/launch.json`，配置内容为：

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

然后，在 `main.ts`（源代码）中设置一些断点，并在 `VSCode 调试视图` 中开始调试。

::: tip NOTE
在 electron-vite 1.0.7 之前，不支持 `sourcemap` CLI 选项。你可以在 `electron.vite.config.js` 中将 `build.sourcemap` 选项设置为 `true` 来支持调试，并删除上述配置的 `runtimeArgs` 选项。
:::
