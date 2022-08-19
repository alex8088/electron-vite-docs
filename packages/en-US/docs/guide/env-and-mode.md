# Env Variables and Modes

::: tip TIPS
It is recommended to go through [Vite's Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html) documentation first before reading the sections below.
:::

## Global Env Variables

electron-vite will load environment variables from the project root like Vite, and use different prefixes to limit the available scope.

By default, variables prefixed with `MAIN_VITE_` are exposed to the main process, `PRELOAD_VITE_` to preload scripts and `RENDERER_VITE_` to renderers.

```
// .env
SOME_KEY=123                # not available
MAIN_VITE_SOME_KEY=123      # for the main process
PRELOAD_VITE_SOME_KEY=123   # for preload scripts
RENDERER_VITE_SOME_KEY=123  # for renderers
```

If you want to customize env variables prefix, you can use `envPrefix` option.

```js
// electron.vite.config.js
export default defineConfig({
  main: {
    envPrefix: 'M_VITE_'
  }
  // ...
})
```

## Modes

By default, `development` mode (`dev` command) only works in renderers. it means that variables from `.env.development` are only available to renderers.
