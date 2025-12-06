# Troubleshooting

See [Vite's troubleshooting guide](https://vitejs.dev/guide/troubleshooting.html) and [Rollup's troubleshooting guide](https://rollupjs.org/troubleshooting/) for more information too.

If the suggestions here don't work, please try checking the [GitHub issue tracker](https://github.com/alex8088/electron-vite/issues) to see if any existing issues match your problem. If you've found a bug, or electron-vite can't meet your needs, please try [raising an issue](https://github.com/alex8088/electron-vite/issues) or posting questions on [GitHub Discussions](https://github.com/alex8088/electron-vite/discussions).

## Skills

Through the following steps, you can quickly identify and resolve problems:

1. **During development** - Use the `debugger` statement or breakpoints to locate problems.
2. **Before packaging** - Run the `preview` command to simulate the packaged environment and detect potential problems early.
3. **After packaging** - Append argument `--trace-warnings` to your app’s launch command to view detailed error messages. For example:
    - **Windows:** `.\app.exe --trace-warnings`
    - **macOS:** `open app.app --args --trace-warnings`
4. **If the app works in preview but not after packaging** - This usually indicates that some dependent modules were not included in the package. Check that all necessary modules are listed under `dependencies` (not `devDependencies`). Or it may be a **pnpm** problem (if it is used).

## Migration

### `The CJS build of Vite's Node API is deprecated`

Since Vite 5, calling Vite’s CJS Node API will trigger a deprecation warning. `electron-vite` v2 is now published as an ESM package, so you can update to the latest version.

In addition, make sure that:

1. The `electron.vite.config.js` file uses **ESM syntax**.
2. The nearest `package.json` file has `"type": "module"`, or alternatively, rename the config file to use the `.mjs` extension (e.g. `electron.vite.config.mjs`).

Note that when adding `"type": "module"` to your project's `package.json`, if Electron supports ESM (Electron 28+), it will be built as ESM. Read the [ESM Support in Electron](./dev.md#esm-support-in-electron) guide before migrating. But if ESM is not supported, it will be built as CommonJS and all files will have the `.cjs` extension.

If you prefer not to make any changes and want to continue bundling as CJS, the simplest solution is to rename `electron.vite.config.js` to `electron.vite.config.mjs`.

## Development

### `Unable to load preload scripts -> Error: module not found: 'XXX'`

From Electron 20, preload scripts are sandboxed by default and no longer have access to the full Node.js environment.

You will need to either:

1. Set `sandbox: false` in the `BrowserWindow` options.
2. Fully bundle all dependencies into a single preload script (since sandboxed scripts cannot `require` multiple separate files).

- Related: [Limitations of Sandboxing](./dev.md#limitations-of-sandboxing)
- Related: [Fully Bundling](./dependency-handling.md#fully-bundling)
- Related: [Isolated Build](./isolated-build.md)

### `Uncaught Error: Module "XXX" has been externalized for browser compatibility.` or `Uncaught ReferenceError: __dirname is not defined`

You should not use Node.js modules in renderer processes. `electron-vite` also does not support `nodeIntegration`.

- Related: [nodeIntegration](/guide/dev#nodeintegration)
- Related: [Module externalized for browser compatibility](https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility)

## Build

###  `Error [ERR_REQUIRE_ESM]: require() of ES Module`

This happens because many libraries (e.g. `lowdb`, `execa`, `node-fetch`) are distributed only as **ES modules** and therefore cannot be required from CJS code.

There are two ways to resolve this issue:

1. **Switch to ESM** — electron-vite provides excellent [support for ESM](./dev.md#esm-support-in-electron) and makes migration straightforward.
2. **Bundle ESM libraries as CJS** — configure electron-vite to bundle these `ESM-only` dependencies so they can be used in a `CJS` environment.

```js [electron.vite.config.js] {7}
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    build: {
      externalizeDeps: {
        exclude: ['foo'] // <- Add related modules to 'exclude' option
      }
    }
  },
  // ...
})
```

Related issue: [#35](https://github.com/alex8088/electron-vite/issues/35)

### `vue-router` or `react-router-dom` works in development but not production

Electron does not manage browser history and instead relies on a synchronized URL. Therefore, only a **hash-based router** will work properly in production.

- For `vue-router`, use `createWebHashHistory` instead of `createWebHistory`.
- For `react-router-dom`, use `HashRouter` instead of `BrowserRouter`.

When using a hash router, you can specify the hash value in the second argument of `BrowserWindow.loadFile` to load the corresponding page.

```js
win.loadFile(path.join(import.meta.dirname, '../renderer/index.html'), { hash: 'home' })
```

## Distribution

### `A JavaScript error occurred in the main process -> Error: Cannot find module 'XXX'`

This error usually occurs because dependent modules are not included in the packaged application. To resolve this issue:

- **Check dependencies:**

  If the missing module is listed under `devDependencies`, reinstall it under `dependencies` instead. Packaging tools (such as `electron-builder` or `electron-forge`) typically exclude modules in `devDependencies`.

- **For pnpm users:**

  You can add a file named `.npmrc` with `shamefully-hoist=true` in your project root directory (in order for your dependencies to be bundled correctly). Then delete `node_modules` and `pnpm-lock.yaml`, and reinstall your dependencies. Alternatively, you can switch to another package manager (e.g. `npm` or `yarn`) to avoid this issue.

### `A JavaScript error occurred in the main process -> Error: Invaild or incompatible cached data (cachedDataRejected)`

This issue occurs when `build.bytecode` is enabled.

To prevent this runtime error, you need to compile the bytecode cache for the target platform and architecture.

See the [Limitations of Build](./source-code-protection.md#limitations-of-build) section in the [Source Code Protection](./source-code-protection.md) guide for details.
