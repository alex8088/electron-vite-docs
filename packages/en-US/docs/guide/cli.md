# Command Line Interface

## `electron-vite`

Aliases: `electron-vite dev`, `electron-vite serve`.

The command will build the main process and preload scripts source code, and start a dev server for the renderer, and finally start the Electron app.

## `electron-vite preview`

The command will build the main process, preload scripts and renderer source code, and start the Electron app to preview.


## `electron-vite build`

The command will build the main process, preload scripts and renderer source code. Usually before packaging the Electron application, you need to execute this command.

## Options

### Universal Options

| Options                   | Description                   |
| ------------------------- | ----------------------------  |
| `-c, --config <file>`     | Use specified config file |
| `-l, --logLevel <level>`  | Set log level (optional: `info`, `warn`, `error`, `silent`) |
| `-m, --mode <mode>`       | Set env mode |
| `-w, --watch`             | Watch mode for hot reloading (default: `false`) |
| `--ignoreConfigWarning`   | Ignore config warning (default: `false`) |
| `--sourcemap`             | Output source maps for debug (default: `false`) |
| `--outDir <dir>`          | Output directory (default: `out`)  |
| `-v, --version`	          | Display version number |
| `-h, --help`	            | Display available CLI options |

::: tip NOTE
The `--ignoreConfigWarning` option allows you to ignore warnings when config missing. For example, do not use preload scripts.
:::

### Dev Options

| Options                   | Description                   |
| ------------------------- | ----------------------------  |
| `--inspect [port]`	      | Enable V8 inspector on the specified port (default: `5858`) |
| `--inspectBrk [port]`	    | Like `--inspect` but pauses execution on the first line of JavaScript. |
| `--remoteDebuggingPort`	  | Port for remote debugging |
| `--rendererOnly`	        | Only dev server for the renderer |

::: tip NOTE
- The `--inspect` option allows you to enable V8 inspector on the specified port. An external debugger can connect on this port. See [V8 Inspector](debugging.md#v8-inspector-e-g-chrome-devtools) for more details.

- The `--inspectBrk` option like `--inspect` option but pauses execution on the first line of JavaScript.

- The `--remoteDebuggingPort` option is used for debugging with IDEs.

- The `--rendererOnly` option is only used for `dev` command to skip the main process and preload scripts builds, and start dev server for renderer only. This option will greatly increase dev command speed.
:::

::: warning WARNING
When using the `--rendererOnly` option, the electron-vite command must be run at least once. In addition, you need to use it without changing the main process and preload scripts source code.
:::

### Preview Options

| Options                   | Description                   |
| ------------------------- | ----------------------------  |
| `--skipBuild`	            | Skip build |

::: tip NOTE
The `--skipBuild` option is only used for `preview` command to skip build and start the Electron app to preview.
:::
