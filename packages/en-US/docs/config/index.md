# Configuring electron-vite

## Config File

When running `electron-vite` from the command line, electron-vite will automatically try to resolve a config file named `electron.vite.config.js` inside project root. The most basic config file looks like this:

```js
// electron.vite.config.js
export default {
  main: {
    // vite config options
  },
  preload: {
    // vite config options
  },
  renderer: {
    // vite config options
  }
}
```

You can also explicitly specify a config file to use with the `--config` CLI option (resolved relative to `cwd`):

```sh
electron-vite --config my-config.js
```

::: tip TIP
`electron-vite` also supports config files suffixed with `.ts`, `.mjs`, `.cjs`, `.mts` and `.cts`.
:::

## Config Intellisense

Since `electron-vite` ships with TypeScript typings, you can leverage your IDE's intellisense with jsdoc type hints:

```js
/**
 * @type {import('electron-vite').UserConfig}
 */
const config = {
  // ...
}

export default config
```

Alternatively, you can use the `defineConfig` helper which should provide intellisense without the need for jsdoc annotations:

```js
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    // ...
  },
  preload: {
    // ...
  },
  renderer: {
    // ...
  }
})
```

## Conditional Config

If the config needs to conditionally determine options based on the command (`dev`/`serve` or `build`), the mode (`development` or `production`) being used, it can use `defineViteConfig` helper:

```js
import { defineConfig, defineViteConfig } from 'electron-vite'

export default defineConfig({
  main: {
    // ...
  },
  preload: {
    // ...
  },
  renderer: defineViteConfig(({ command, mode }) => {
    if (command === 'dev') {
      return {
        // dev specific config
      }
    } else {
      return {
        // build specific config
      }
    }
  })
})
```

::: tip TIP
The `defineViteConfig` exports from `Vite`.
:::

## Built-in Config

### Build options for `main`:

| Build options             | Default                   |
| ------------------------- | ------------------------  |
| `target`        | `node*`, automatically match Node compatible target for Electron (e.g. Electron 20 is `node16.15`) |
| `outDir`        | `out\main` (relative to project root) |
| `lib.entry`     | `src\main\{index\|main}.{js\|ts\|mjs\|cjs}`, empty string if not found |
| `lib.formats`   | `cjs` |
| `reportCompressedSize` | `false`, disable gzip-compressed size reporting, increase build performance |
| `rollupOptions.external` | `electron` and all `node` built-in modules |

### Build options for `preload scripts`:

| Build options             | Default                   |
| ------------------------- | ------------------------  |
| `target`        | `node*`, automatically match Node compatible target for Electron (e.g. Electron 20 is `node16.15`) |
| `outDir`        | `out\preload` (relative to project root) |
| `lib.entry`     | `src\preload\{index\|preload}.{js\|ts\|mjs\|cjs}`, empty string if not found |
| `lib.formats`   | `cjs` |
| `reportCompressedSize` | `false`, disable gzip-compressed size reporting, increase build performance |
| `rollupOptions.external` | `electron` and all `node` built-in modules |

### Build options for `renderers`:

| Build options             | Default                   |
| ------------------------- | ------------------------  |
| `root`        | `src\renderer` |
| `target`        | `chrome*`, automatically match Chrome compatible target for Electron (e.g. Electron 20 is `chrome104`) |
| `outDir`        | `out\renderer` (relative to project root) |
| `lib.entry`     | `\src\renderer\index.html`, empty string if not found |
| `polyfillModulePreload` | `false`, there is no need to polyfill `Module Preload` for the Electron renderers |
| `reportCompressedSize` | `false`, disable gzip-compressed size reporting, increase build performance |
| `rollupOptions.external` | `electron` and all `node` built-in modules |

### Define option for `main` and `preload scripts`

In web development, Vite will transform `'process.env.'` to `'({}).'`. This is reasonable and correct. But in nodejs development, we sometimes need to use `process.env`, so `electron-vite` will automatically add config define field to redefine global variable replacements like this:

```js
export default {
  main: {
    define: {
      'process.env': 'process.env'
    }
  }
}
```

::: tip TIPS
If you want to use these configurations in an existing project, please see the Vite plugin [vite-plugin-electron-config](https://github.com/alex8088/vite-plugin-electron-config)
:::

## Vite Config Reference

See [Vite config](https://vitejs.dev/config).
