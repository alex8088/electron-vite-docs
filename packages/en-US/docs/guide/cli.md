# Command Line Interface

## `electron-vite`

Aliases: `electron-vite dev`, `electron-vite serve`.

The command will build the main process and preload scripts source code, and start a dev server for the renderer, and finally start the Electron app.

## `electron-vite preview`

The command will build the main process, renderers and preload scripts source code, and start the Electron app to preview.


## `electron-vite build`

The command will build the main process, renderers and preload scripts source code. Usually before packaging the Electron application, you need to execute this command.

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

::: tip NOTE
The `--ignoreConfigWarning` option allows you to ignore warnings when config missing. For example, do not use preload scripts.
:::
