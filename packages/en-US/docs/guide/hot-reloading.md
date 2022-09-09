# Hot Reloading

::: tip NOTE
Hot reloading is available since electron-vite 1.0.8
:::

## What is Hot Reloading

Hot reloading refers to quickly rebuilding and restarting the Electron app when the main process or preload scripts module changes. In fact, it's not really hot reloading, but similar. It also brings a good development experience to developers.

How electron-vite does it:

- Enable rollup watcher, watch the main process and preload scripts module changes

- Rebuild and restart Electron app when the main process modules have changes

- Rebuild and trigger renderers reload when preload script modules have changes

## Enable Hot Reloading

There are two ways to enable it:

1. Use CLI option `-w` or `--watch`, e.g. `electron-vite dev --watch`. This is the preferred way, it's more flexible.

2. Use configuration option `build.watch` and set to `{}`. In addition, more watcher options can be configured, see [WatcherOptions](https://rollupjs.org/guide/en/#watch-options).

::: tip NOTE
Hot reloading can only be used during the development.
:::

::: warning When to use hot reloading
Because the timing of reloading is uncontrollable, hot reloading cannot be perfectly implemented. In practice, hot reloading is not always beneficial，so it is recommended to use the CLI option to flexibly decide whether to enable or not.
:::
