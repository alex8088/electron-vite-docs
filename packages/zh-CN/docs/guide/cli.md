# 命令行界面

## `electron-vite`

别名：`electron-vite dev`、 `electron-vite serve`。

该命令将构建主进程和预加载脚本源代码，并为渲染器启动一个开发服务器，最后启动 Electron 应用程序。

## `electron-vite preview`

该命令将构建主进程、渲染器和预加载脚本源代码，并启动 Electron 应用程序进行预览。

## `electron-vite build`

该命令将构建主进程、渲染器和预加载脚本源代码。通常在打包 Electron 应用程序之前，需要执行此命令。

## 选项

### 通用选项

| 选项                       | 描述                   |
| ------------------------- | ----------------------------  |
| `-c, --config <file>`     | 定义配置文件路径 |
| `-l, --logLevel <level>`  | 设置日志级别 (optional: `info`, `warn`, `error`, `silent`) |
| `-m, --mode <mode>`       | 设置环境模式 |
| `-w, --watch`             | 用于热重载的监视模式 (default: `false`) |
| `--ignoreConfigWarning`   | 忽略配置缺失警告 (default: `false`) |
| `--sourcemap`             | 输出 source maps 支持 debug (default: `false`) |
| `--outDir <dir>`          | 设置输出目录 (default: `out`)  |
| `--entry <file>`          | 指定 Electron 入口文件  |
| `-v, --version`	          | 显示版本号 |
| `-h, --help`	            | 显示可用的 CLI 选项 |

::: tip 提示
`--ignoreConfigWarning` 选项允许你在配置缺失时忽略警告。例如，不需要使用预加载脚本。
:::

### Dev 选项

| 选项                       | 描述                   |
| ------------------------- | ----------------------------  |
| `--inspect [port]`	    | 指定端口启用 V8 inspector (default: `5858`) |
| `--inspectBrk [port]`	    | 和`--inspect` 一样，但会暂停运行 |
| `--remoteDebuggingPort`	| 远程调试端口 |
| `--noSandbox`             | 强制渲染器进程在非沙盒环境下运行 |
| `--rendererOnly`	        | 仅为渲染器启动开发服务 |

::: tip 提示
- `--inspect` 选项允许你在指定的端口上启用 V8 Inspector。外部调试器可以连接到此端口。有关更多详细信息，请参阅 [V8 Inspector](debugging.md#v8-inspector-e-g-chrome-devtools)。

- `--inspectBrk` 选项与 `--inspect` 选项类似，但会在 JavaScript 的第一行暂停执行。

- `--remoteDebuggingPort` 选项用于 IDE 调试。

- `--noSandbox` 选项将强制 Electron 在非沙盒环境下运行。它通常用于使 Electron 在 Linux 上以 root 身份运行。

- `--rendererOnly` 选项仅用于 `dev` 命令以跳过主进程和预加载脚本构建，并仅为渲染器启动开发服务。此选项将大大提高 dev 命令速度。
:::

::: warning 警告
使用 `--rendererOnly` 选项时，electron-vite 命令必须至少运行过一次。此外，你需要在不更改主进程和预加载脚本源代码的情况下使用它。
:::

### Preview 选项

| 选项                       | 描述                   |
| ------------------------- | ----------------------------  |
| `--noSandbox`             | 强制渲染器进程在非沙盒环境下运行 |
| `--skipBuild`	            | 跳过构建 |

::: tip 提示
- `--noSandbox` 选项将强制 Electron 在非沙盒环境下运行。它通常用于使 Electron 在 Linux 上以 root 身份运行。

- `--skipBuild` 选项仅用于 `preview` 命令跳过构建并启动 Electron 应用程序进行预览。
:::
