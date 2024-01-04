# Troubleshooting

See [Vite's troubleshooting guide](https://vitejs.dev/guide/troubleshooting.html) and [Rollup's troubleshooting guide](https://rollupjs.org/troubleshooting/) for more information too.

If the suggestions here don't work, please try checking the [GitHub issue tracker](https://github.com/alex8088/electron-vite/issues) to see if any existing issues match your problem. If you've found a bug, or electron-vite can't meet your needs, please try [raising an issue](https://github.com/alex8088/electron-vite/issues) or posting questions on [GitHub Discussions](https://github.com/alex8088/electron-vite/discussions).

## Skills

Through the following steps, you can quickly find the problems:

1. In development mode, you can debug problem via the `debugger` breakpoint.
2. Before packaging, please run the `preview` command to preview the situation after packaging and find problems early.
3. After packaging, you can append argument `--trace-warnings` to the app to view the error message. e.g. `.\app.exe --trace-warnings`(in Windows), `open app.app --args --trace-warnings`(in MacOS).
4. Usually the preview command works fine, but it is not normal after packaging. The high probability is that the dependent modules have not been packaged into the app. Please check whether the dependent modules are installed in `dependencies`, or it may be a pnpm problem (if it is used).

## Migration

### `The CJS build of Vite's Node API is deprecated`

Since Vite 5, when calling Vite's CJS Node API, you will get a deprecation warning log. electron-vite 2 is now published as ESM, you can update to the latest version.

In addition, you need to ensure:

1. The `electron.vite.config.js` file content is using the ESM syntax.
2. The nearest `package.json` file has `"type": "module"`, or use the `.mjs` extension, e.g. `electron.vite.config.mjs`.

Note that when adding `"type": "module"` in the project `package.json`, if Electron support ESM (Electron 28+), it will be built as ESM and you need to read the [ESM Support in Electron](./dev.md#esm-support-in-electron) guide first. But if ESM is not supported, it will be built as CommonJS and all files will have a `.cjs` extension.

If you don't want to make any changes and keep bundling into CJS, the best way is to rename `electron.vite.config.js` to `electron.vite.config.mjs`.

## Development

### `Unable to load preload scripts -> Error: module not found: 'XXX'`

From Electron 20, preload scripts are sandboxed by default and no longer have access to a full Node.js environment.

You will need to either:

1. Specify `sandbox: false` for `BrowserWindow`.
2. Refactor preload scripts to remove Node usage from the renderer and bundle into one file (does not support to require multiple files).

### `Uncaught Error: Module "XXX" has been externalized for browser compatibility.` or `Uncaught ReferenceError: __dirname is not defined`

Currently, electorn-vite not support `nodeIntegration`. One of the important reasons is that vite's HMR is implemented based on native ESM.

It is recommended to use `preload scripts` for development and avoiding Node.js modules for renderer code. if you want to do this，you can add polyfills manually， see [nodeIntegration](/guide/dev#nodeintegration) for more details.

- Related: [nodeIntegration](/guide/dev#nodeintegration)
- Related: [Module externalized for browser compatibility](https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility)

## Build

###  `Error [ERR_REQUIRE_ESM]: require() of ES Module`

Electron doesn't support `ESM`, so the build standard for the main process and preload scripts is still `CJS`. This error occurs because the module is externalized. For modules that support CJS, we'd better externalize it. For modules that only support ESM (e.g. lowdb, execa, node-fetch, etc.), we should not externalize it. We should let electron-vite bundle it into a CJS standard module to support Electron.

To solve this:

```js
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin({ exclude: ['foo'] })] // <- Add related modules to 'exclude' option
  },
  // ...
})
```

Related issue: [#35](https://github.com/alex8088/electron-vite/issues/35)

### `vue-router` or `react-router-dom` works in development but not production

Electron does not handle (browser) history and works with the synchronized URL. So only `hash router` can work.

- For `vue-router`, you should use `createWebHashHistory` instead of `createWebHistory`.
- For `react-router-dom`, you should use `HashRouter` instead of `BrowserRouter`.

When using hash router, you can set the hash value through the second argument of `BrowserWindow.loadFile` to load the page.

```js
win.loadFile(path.join(__dirname, '../renderer/index.html'), { hash: 'home' })
```

## Distribution

### `A JavaScript error occurred in the main process -> Error: Cannot find module 'XXX'`

Dependent modules are not packaged into the application. To solve this:

- If the related module is installed in `devDependencies`, please reinstall it in `dependencies`. This is because packaging tools (e.g. `electron-builder`, `electron-force`) usually exclude modules in devDependencies.
- If you are using the `pnpm` package manager, you’ll need to add a file `.npmrc` with `shamefully-hoist=true` in project root directory (in order for your dependencies to be bundled correctly). Also, you need to delete `node_modules` and `pnpm-lock.yaml`, then reinstall the modules. Of course you can switch to other package manager (e.g. `npm`, `yarn`) to avoid this problem.

### `A JavaScript error occurred in the main process -> Error: Invaild or incompatible cached data (cachedDataRejected)`

This problem occurs when bytecode plugin is enabled. The bytecode is compiled according to the Electorn Node.js version and system architecture (e.g. x86, x64, ARM, etc.).

Usually, the Node.js version that compiles the bytecode with local Electron is the same as the version packaged into the application, unless a different Electron version is specified for packaging tools such as electron-builder, which may cause this error. If this is the case, please make sure that the Electorn Node.js version when compiling the bytecode is the same as when running it after packaging.

In fact, this error is mostly caused by the incompatibility between the system architecture at compile time and the specified architecture Electron application. For example, building a 64-bit app for MacOS in arm64 MacOS, it will run with this error. Because the arm64-based bytecode built by default cannot run in 64-bit app. Therefore, we need to ensure that the system architecture when compiling bytecode is consistent with that at runtime after packaging. For how to package target applications of different architectures on the same platform, please refer to the [Multi Platform Build](/guide/source-code-protection#multi-platform-build) section.

- Related: [Source Code Protection](/guide/source-code-protection)
