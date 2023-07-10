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

If the config needs to conditionally determine options based on the command (`dev`/`serve` or `build`), the mode (`development` or `production`) being used, it can export a function instead:

```js
import { defineConfig } from 'electron-vite'

export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return {
      // dev specific config
      main: {
        // ...
      },
      preload: {
        // ...
      },
      renderer: {
        // ...
      }
    }
  } else {
    // command === 'build'
    return {
      // build specific config
    }
  }
})
```

You can also use the `defineViteConfig` helper:

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

## Environment Variables

Note that electron-vite doesn't load `.env` files by default as the files to load can only be determined after evaluating the electron-vite config. However, you can use the exported `loadEnv` helper to load the specific `.env` file if needed.

```js
import { defineConfig, loadEnv } from 'electron-vite'

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // By default, only env variables prefixed with `MAIN_VITE_`,
  // `PRELOAD_VITE_` and `RENDERER_VITE_` are loaded,
  // unless the third parameter `prefixes` is changed.
  const env = loadEnv(mode)
  return {
    // electron-vite config
  }
})
```

## Built-in Config

### Built-in Config for `main`:

| Options                   | Default                   |
| ------------------------- | ------------------------  |
| `build.target`        | `node*`, automatically match Node compatible target for Electron (e.g. Electron 20 is `node16.15`) |
| `build.outDir`        | `out\main` (relative to project root) |
| `build.lib.entry`     | `src\main\{index\|main}.{js\|ts\|mjs\|cjs}`, empty string if not found |
| `build.lib.formats`   | `cjs` |
| `build.reportCompressedSize`   | `false`, disable gzip-compressed size reporting, increase build performance |
| `build.rollupOptions.external` | `electron` and all `node` built-in modules |
| `build.assetDir`               | `chunks` |
| `build.minify`                 | `false` |
| `build.copyPublicDir`          | `false`, alway |
| `resolve.browserField`        | `false`, disable resolving to `browser` field |
| `resolve.mainFields`          | `['module', 'jsnext:main', 'jsnext']` |
| `resolve.conditions`          | `['node']`, first resolve `require` exports |
| `publicDir`                    | `resources` |
| `envPrefix`                    | `MAIN_VITE_` |

### Built-in Config for `preload`:

| Options                   | Default                   |
| ------------------------- | ------------------------  |
| `build.target`        | `node*`, automatically match Node compatible target for Electron (e.g. Electron 20 is `node16.15`) |
| `build.outDir`        | `out\preload` (relative to project root) |
| `build.lib.entry`     | `src\preload\{index\|preload}.{js\|ts\|mjs\|cjs}`, empty string if not found |
| `build.lib.formats`   | `cjs` |
| `build.reportCompressedSize` | `false`, disable gzip-compressed size reporting, increase build performance |
| `build.rollupOptions.external` | `electron` and all `node` built-in modules |
| `build.assetDir`               | `chunks` |
| `build.minify`                 | `false` |
| `build.copyPublicDir`          | `false`, alway |
| `publicDir`                    | `resources` |
| `envPrefix`                    | `PRELOAD_VITE_` |

### Built-in Config for `renderer`:

| Options                   | Default                   |
| ------------------------- | ------------------------  |
| `root`             | `src\renderer` |
| `build.target`     | `chrome*`, automatically match Chrome compatible target for Electron (e.g. Electron 20 is `chrome104`) |
| `build.outDir`     | `out\renderer` (relative to project root) |
| `build.lib.entry`  | `\src\renderer\index.html`, empty string if not found |
| `build.modulePreload.polyfill` | `false`, there is no need to polyfill `Module Preload` for the Electron renderers |
| `build.reportCompressedSize`   | `false`, disable gzip-compressed size reporting, increase build performance |
| `build.minify`                 | `false` |
| `envPrefix`                    | `RENDERER_VITE_` |

## Vite Config Reference

See [Vite config](https://vitejs.dev/config).
