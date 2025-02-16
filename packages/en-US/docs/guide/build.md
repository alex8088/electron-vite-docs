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

```js
// electron.vite.config.js
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
It should be pointed out that the best practice is to put the bundled code in **one directory**, as they are all necessary for the Electron app to run, unlike source code. This makes it easy to exclude source code to reduce the size of the package when packaging Electron app.
:::

## Customizing the Build

The build can be customized via various [build config options](https://vitejs.dev/config/build-options.html). Specifically, you can directly adjust the underlying [Rollup options](https://rollupjs.org/guide/en/#big-list-of-options) via `build.rollupOptions`:

```js
// electron.vite.config.js
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

A good chunking strategy is very important to the performance of Electron app.

You can configure how chunks are split using `build.rollupOptions.output.manualChunks` (see [Rollup docs](https://rollupjs.org/configuration-options/#output-manualchunks)).

```js
// electron.vite.config.ts
import { defineConfig, splitVendorChunkPlugin } from 'electron-vite'

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

## Externals

The `build.rollupOptions.external` (see [Rollup docs](https://rollupjs.org/configuration-options/#external)) configuration option provides a way of excluding dependencies from the output bundles. This option is typically most useful to Electron developer.

For example, using `sqlite3` node addon in Electron:

```js
// electron.vite.config.js
export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        external: ['sqlite3']
      }
    }
  },
  // ...
})
```

In the above configuration, it indicates that the module `sqlite3` should excluded from bundling. If you not to do this, you will get an error.

By default, electron-vite will add the `electron` module and all `node` built-in modules as external dependencies. If developers add their own external dependencies, they will be automatically merged with them. Learn more about [Built-in Config](/config/#built-in-config).

Additionally, electron-vite provides an `externalizeDepsPlugin` to automatically externalize `package.json` dependencies. We don't have to add one by one to the `external` option.

```js
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  // ...
})
```

See [`dependencies` vs `devDependencies`](/guide/dev#dependencies-vs-devdependencies) for more details.

::: tip Recommend
For the main process and preload scripts, the best practice is to externalize dependencies. For renderers, it is usually fully bundle, so dependencies are best installed in `devDependencies`. This makes the final package smaller.
:::

## Source Code Protection

See [Source Code Protection](/guide/source-code-protection).
