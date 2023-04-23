# 命令行界面

## `electron-vite`

别名：`electron-vite dev`、 `electron-vite serve`。

该命令将构建主进程和预加载脚本源代码，并为渲染器启动一个开发服务器，最后启动 Electron 应用程序。

## `electron-vite preview`

该命令将构建主进程、渲染器和预加载脚本源代码，并启动 Electron 应用程序进行预览。

## `electron-vite build`

该命令将构建主进程、渲染器和预加载脚本源代码。通常在打包 Electron 应用程序之前，需要执行此命令。

## 选项

| 选项                       | 描述                   |
| ------------------------- | ----------------------------  |
| `-c, --config <file>`     | 定义配置文件路径 |
| `-l, --logLevel <level>`  | 设置日志级别 (optional: `info`, `warn`, `error`, `silent`) |
| `-m, --mode <mode>`       | 设置环境模式 |
| `--ignoreConfigWarning`   | 忽略配置缺失警告 (default: `false`) |
| `--sourcemap`             | 输出 source maps 支持 debug (default: `false`) |
| `-w, --watch`             | 用于热重载的监视模式 (default: `false`) |
| `--outDir <dir>`          | 设置输出目录 (default: `out`)  |
| `-v, --version`	          | 显示版本号 |
| `-h, --help`	            | 显示可用的 CLI 选项 |
| `--skipBuild`	            | 为 `preview` 命令跳过构建 |
| `--remoteDebuggingPort`	  | 远程调试端口 |
| `--rendererOnly`	        | 仅为渲染器启动开发服务 |

::: tip 提示
`--ignoreConfigWarning` 选项允许你在配置缺失时忽略警告。例如，不需要使用预加载脚本。

`--skipBuild` 选项仅用于 `preview` 命令跳过构建并启动 Electron 应用程序进行预览。

`--remoteDebuggingPort` 选项仅用于开发模式下的调试。

`--rendererOnly` 选项仅用于 `dev` 命令以跳过主进程和预加载脚本构建，并仅为渲染器启动开发服务。此选项将大大提高 dev 命令速度。
:::

::: warning 警告
使用 `--rendererOnly` 选项时，electron-vite 命令必须至少运行过一次。此外，你需要在不更改主进程和预加载脚本源代码的情况下使用它。
:::
