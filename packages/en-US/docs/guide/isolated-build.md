# Isolated Build <Badge type="info">experimental</Badge>

## Rationale

When developing with multiple entry points (including dynamic ones), we may encounter the following needs or challenges:

- Outputting as a single file
- Ensuring more efficient **tree-shaking** to avoid importing unnecessary modules (which often requires refactoring or duplicating code to address this issue)
- Avoiding the generation of excessive chunks to improve loading performance

In Rollup, you can export an array from your config file to build bundles for multiple unrelated inputs at once, for example:

```js [rollup.config.js]
export default [
  {
    input: 'main-a.js',
    output: {
      file: 'dist/bundle-a.js',
      format: 'cjs'
    }
  },
  {
    input: 'main-b.js',
    output: {
      file: 'dist/bundle-b.js',
      format: 'cjs'
    }
  }
]
```

In electron-vite, a similar multi-entry approach is possible. However, we introduced the `build.isolatedEntries` option to simplify configuration and reduce the developer’s workload. It provides the following features:

- **Automatic isolation of multiple entries:** No need to configure each entry manually.
- **Intelligent handling of shared chunks and assets output:** Automatically manages shared dependencies to avoid duplicate bundling or conflicts.

## Scenarios for Isolated Build

- **In main process development**, modules imported via `?modulePath` have isolated builds enabled by default in v5. This behavior aligns with developers’ expectations and is particularly useful in multi-threading development scenarios, requiring no additional configuration.

- **In preload script development**, if there are multiple entry points with shared imports, enabling isolated builds is necessary. This is a prerequisite for supporting the Electron sandbox (allowing output as a single bundle). Typically, you may also need to disable `build.externalizeDeps` to enable full bundling.

```js [electron.vite.config.ts] {9,10,13,14}
import { defineConfig } from 'electron-vite'

export default defineConfig({
  // ...
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.ts'),
          test: resolve(__dirname, 'src/preload/test.ts')
        }
      },
      isolatedEntries: true，
      externalizeDeps: false
    }
  },
  // ...
})
```

- **In renderer process development**, when there are multiple entry points, enabling isolated builds can reduce the number of generated chunks, thereby improving rendering performance.

```js [electron.vite.config.js] {9,10,13}
import { defineConfig } from 'electron-vite'

export default defineConfig({
  // ...
  renderer: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html'),
          test: resolve(__dirname, 'src/renderer/test.html')
        }
      },
      isolatedEntries: true
    }
  },
  // ...
})
```

## Summary

When there are many entry points, enabling `isolated build` will reduce build speed (within an acceptable range). However, this trade-off is well worth it, as isolated build not only significantly improves application performance and security, but also reduces development complexity and increases developer productivity.
