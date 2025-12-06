# Building for Production

When it is time to package your Electron app for production, usually need to run the `electron-vite build` command first.

## Output Dir

By default, the build output will be placed at `out` (relative to project root).

```
├──out/
│  ├──main
│  ├──preload
│  └──renderer
└──...
```

You can specify it via a command line flag, e.g. `electron-vite dev/build/preview --outDir=dist`.

In addition, you can also use `build.outDir` option to specify the output directory of the main process, renderer and preload scripts.

```js [electron.vite.config.js] {4,9,14}
export default defineConfig({
  main: {
    build: {
      outDir: 'dist/main'
    }
  },
  preload: {
    build: {
      outDir: 'dist/preload'
    }
  },
  renderer: {
    build: {
      outDir: 'dist/renderer'
    }
  }
})
```

::: tip NOTE
It is recommended to place all bundled code in a **single directory**, as all of it is required for the Electron app to run. This also makes it easier to exclude source code when packaging the app, reducing the package size.
:::

## Customizing the Build

The build can be customized via various [build config options](https://vitejs.dev/config/build-options.html). Specifically, you can directly adjust the underlying [Rollup options](https://rollupjs.org/guide/en/#big-list-of-options) via `build.rollupOptions`:

```js [electron.vite.config.js]
export default defineConfig({
  main: {
    rollupOptions: {
      // ...
    }
  },
  preload: {
    rollupOptions: {
      // ...
    }
  },
  renderer: {
    rollupOptions: {
      // ...
    }
  }
})
```

## Chunking Strategy

An effective chunking strategy is crucial for optimizing the performance of  of an Electron app.

Chunk splitting can be configured via  `build.rollupOptions.output.manualChunks` (see [Rollup docs](https://rollupjs.org/configuration-options/#output-manualchunks)).

```js [electron.vite.config.ts]
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id): string | void {
            if (id.includes('foo')) {
              return 'foo'
            }
          }
        }
      }
    }
  },
  // ...
})
```
## Dependency Handling

See [Dependency Handling](./dependency-handling.md).

## Isolated Build

See [Isolated Build](./isolated-build.md).

## Source Code Protection

See [Source Code Protection](./source-code-protection.md).
