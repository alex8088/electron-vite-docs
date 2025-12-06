---
outline: deep
---

# Dependency Handling

When bundling with `electron-vite`, dependencies are intelligently handled to keep the final build **lightweight**. This guide outlines the default behavior for dependency handling and how it can be customized.

## Default Behavior

By default, electron-vite treats the `electron` module and all Node.js built-in modules as external dependencies.

### `dependencies`

- **Main process & preload scripts** - Dependencies listed under `dependencies` in your `package.json` are treated as external and are not bundled.

  ::: tip Why
  These dependencies will still be included when packaging the app (for example, via `electron-builder`).
  :::

- **Renderers** - Dependencies listed under `dependencies` in your `package.json` are bundled.

  ::: tip Why
  Bundling dependencies reduces the number of chunks, which helps maintain fast renderer performance.
  :::

  ::: warning NOTE
  Dependencies used in the renderer process should preferably be installed as `devDependencies` to help **keep the final package size smaller**.
  :::

### `devDependencies` and Phantom Dependencies

Only the dependencies that are actually **imported** or **required** in the project will be included in the bundle. Regardless of whether these dependencies are listed under `devDependencies` in the `package.json`, or are “phantom dependencies” (present in the `node_modules` folder but not explicitly declared in `package.json`), they will be bundled as long as they are referenced in the code.

::: tip NOTE
Packaging tools (such as `electron-builder`) exclude `devDependencies` by default.
:::

## Customizing

You can customize how dependencies are handled by configuring the `build.externalizeDeps.exclude` and `build.externalizeDeps.include` options, giving you more control over which dependencies are bundled or externalized.

```js [electron.vite.config.js] {7}
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    build: {
      externalizeDeps: {
        exclude: ['foo']
      }
    }
  }
  // ...
})
```

In this example, `foo` package will be bundled. You can also install this dependency in `devDependencies` and achieve the same effect.

::: warning NOTE
Before `electron-vite 5`, you should configure it using the `externalizeDepsPlugin`.
:::

## Fully Bundling

If you want to fully bundle all dependencies, you can disable `build.externalizeDeps` option to turn off electron-vite's automatic dependency handling.

```js [electron.vite.config.js] {6}
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    build: {
      externalizeDeps: false
    }
  }
  // ...
})
```

Keep in mind that full bundling **increases build time**, and you should plan your module [chunking strategy](./build.md#chunking-strategy) carefully to **avoid impacting application startup performance**.

::: tip NOTE
In preload scripts, disabling dependency externalization is required to support Electron’s sandboxed environment. For more details, see the [Limitations of Sandboxing](./dev.md#limitations-of-sandboxing) section.
:::

In a full-bundle scenario, some modules do not support being fully bundled, such as Node.js addons. These modules must remain external, which can be configured using `build.rollupOptions.external`.

```js [electron.vite.config.js] {5}
export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        external: ['sqlite3']
      }
    }
  }
  // ...
})
```
