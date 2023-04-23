# Command Line Interface

## `electron-vite`

Aliases: `electron-vite dev`, `electron-vite serve`.

The command will build the main process and preload scripts source code, and start a dev server for the renderer, and finally start the Electron app.

## `electron-vite preview`

The command will build the main process, preload scripts and renderer source code, and start the Electron app to preview.


## `electron-vite build`

The command will build the main process, preload scripts and renderer source code. Usually before packaging the Electron application, you need to execute this command.

## Options

| Options                   | Description                   |
| ------------------------- | ----------------------------  |
| `-c, --config <file>`     | Path to config file |
| `-l, --logLevel <level>`  | Set log level (optional: `info`, `warn`, `error`, `silent`) |
| `-m, --mode <mode>`       | Set env mode |
| `--ignoreConfigWarning`   | Ignore config warning (default: `false`) |
| `--sourcemap`             | Output source maps for debug (default: `false`) |
| `-w, --watch`             | Watch mode for hot reloading (default: `false`) |
| `--outDir <dir>`          | Output directory (default: `out`)  |
| `-v, --version`	          | Display version number |
| `-h, --help`	            | Display available CLI options |
| `--skipBuild`	            | Skip build for `preview` command |
| `--remoteDebuggingPort`	  | Port for remote debugging |
| `--rendererOnly`	        | Only dev server for the renderer |

::: tip NOTE
The `--ignoreConfigWarning` option allows you to ignore warnings when config missing. For example, do not use preload scripts.

The `--skipBuild` option is only used for `preview` command to skip build and start the Electron app to preview.

The `--remoteDebuggingPort` option is only used for debugging in dev mode.

The `--rendererOnly` option is only used for `dev` command to skip the main process and preload scripts builds, and start dev server for renderer only. This option will greatly increase dev command speed.
:::

::: warning WARNING
When using the `--rendererOnly` option, the electron-vite command must be run at least once. In addition, you need to use it without changing the main process and preload scripts source code.
:::
