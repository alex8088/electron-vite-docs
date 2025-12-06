# Env Variables and Modes

::: tip TIPS
It is recommended to go through [Vite's Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html) documentation first before reading the sections below.
:::

## Global Env Variables

electron-vite will load environment variables from the project root like Vite, and use different prefixes to limit the available scope.

By default, variables prefixed with `MAIN_VITE_` are exposed to the main process, `PRELOAD_VITE_` to preload scripts, `RENDERER_VITE_` to renderers and `VITE_` to all.

``` [.env]
KEY=123                # not available
MAIN_VITE_KEY=123      # only main process available
PRELOAD_VITE_KEY=123   # only preload scripts available
RENDERER_VITE_KEY=123  # only renderers available
VITE_KEY=123           # all available
```

If you want to customize env variables prefix, you can use `envPrefix` option.

```js [electron.vite.config.js]
export default defineConfig({
  main: {
    envPrefix: 'M_VITE_'
  }
  // ...
})
```

If you are a TypeScript user, make sure to add type definitions for `import.meta.env` in `env.d.ts` to get type checks and intellisense for user-defined env variables.

```js
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_SOME_KEY: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

## Modes

By default, `dev` command runs in `development` mode, the `build` and `preview` command runs in `production` mode.

You can overwrite the default mode used for a command by passing the `--mode` option flag. See [Vite Modes](https://vitejs.dev/guide/env-and-mode.html#modes).
