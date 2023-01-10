# Static Asset Handling

::: tip NOTE
Static asset handling feature is available since electron-vite 1.0.17.
:::

## Public Directory

### For Main Process and Preload Scripts

If you have assets that are:

- Referenced in source code (e.g. `*.node`, `*.wasm`, `*.exe`, `*.png`)
- Must retain the exact same file name (without hashing)
- Do not want to be bundled into an ASAR archive ([limitations of ASAR](https://www.electronjs.org/docs/latest/tutorial/asar-archives#limitations-of-the-node-api))

Then you can place the asset in a special `public` directory under your project root.

The directory defaults to `<root>/resources`, but can be configured via the [publicDir](https://vitejs.dev/config/shared-options.html#publicdir) option.

Note that:

- All assets in `public` directory are not copied to output directory. So when packaging the app, the `public` directory should be packaged together.
- It is recommended to use the `?asset` suffix to import `public` assets.

### For Renderers

By default, the working directory of renderers are located in `src/renderer`, so the public directory needs to be created in this directory. The default public directory is named `public`, which can also be specified by [publicDir](https://vitejs.dev/config/shared-options.html#publicdir).

It is important to note that public asset handling in renderers is different from main process and preload scripts. See [Public Directory](https://vitejs.dev/guide/assets.html#the-public-directory) for more details.

## ASAR Archives

The Electron app's source code are usually bundled into an ASAR archive, which is a simple extensive archive format designed for Electron apps.

But the ASAR Archive has limitations:

- Some Node APIs require extra unpacking into a temporary file and pass the path of the temporary file to the APIs to make them work. This adds a little overhead for those APIs. Such as `child_process.execFile`, `fs.open`, `process.dlopen`, etc.
- There are some Node APIs that do not support executing binaries in ASAR archives, such as `child_process.exec`, `child_process.spawn`.

As stated above, it is best practice not to pack these assets into ASAR archives.

There are those binaries that should not be packed:

- Some native node modules like `sqlite`, `fluent-ffmpeg`, etc.
- Referenced binaries like `*.node`, `*.app`, `*.exe`, etc.

For example, in `electron-builder` you can configure like this:

```yaml
asarUnpack:
  - node_modules/sqlite3
  - resources/*
  - out/main/chunks/*.node
```

Learn more about [ASAR Archives](https://www.electronjs.org/docs/latest/tutorial/asar-archives).

::: tip NOTE
It is recommended to put these assets in the public directory, which makes it easier to configure exclusions without packing them into the asar archive.
:::

## Importing Asset in Main Process

In main process, assets can be imported as file path using the `?asset` suffix:

```js {2}
import { Tray, nativeImage } from 'electron'
import appIcon from '../../build/icon.ico?asset'

let tray = new Tray(nativeImage.createFromPath(appIcon))
```

In this example, `appIcon` will be resolved to:

```js
const path = require("path");
const appIcon = path.join(__dirname, "./chunks/icon-4363016c.ico");
```

And the `build/icon.ico` will be copied to output dir (`out/main/chunks/icon-4363016c.ico`).

If `appIcon` place in `public directory`:

```js {2}
import { Tray, nativeImage } from 'electron'
import appIcon from '../../resources/icon.ico?asset'

let tray = new Tray(nativeImage.createFromPath(appIcon))
```

Then `appIcon` will be resolved to:

```js
const path = require("path");
const appIcon = path.join(__dirname, "../../resources/icon.ico");
```

And `resources/icon.ico` will not be copied to output dir.

By default, electron-vite provides type definitions for `*?asset` in `electron-vite/node.d.ts`. If you are a TypeScript user, make sure to add type definitions in `env.d.ts` to get type checks and intellisense:

```js
/// <reference types="electron-vite/node" />
```

### `app.asar.unpacked` File Path Problem

We know the limitations of ASAR and do not pack binaries into ASAR archives. Sometimes, this creates a problem as the path to the binary changes, but your `path.join(__dirname, 'binary')` is not changed. To make it work you need to fix the path. Convert `app.asar` in path to `app.asar.unpacked`.

You can use the `?asset&asarUnpack` suffix to support this. For example:

```js
import bin from '../../resources/hello.exe?asset&asarUnpack'
```

Then `bin` will be resolved to:

```js
const path = require("path");
const bin = path.join(__dirname, "../../resources/hello.exe").replace("app.asar", "app.asar.unpacked");
```

## Importing Asset in Renderer

In renderer, static asset handling is the same as regular web app.

See Vite's [Static Asset Handling](https://vitejs.dev/guide/assets.html).

## Importing Native Node Modules

There are two ways to use `*.node` modules.

1. import as node module

```js
import addon from '../../resources/hello.node'

console.log(addon?.hello())
```

2. import as file path

```js
import addon from '../../resources/hello.node?asset'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const native = require(addon)
console.log(native?.hello())
```

It is important to note that native node modules usually have to be imported depending on the `platform` and `arch`. If you can ensure that the node module is generated according to the platform and arch, there will be no problem using the first import method. Otherwise, you can use the second method to import the correct node module according to the platform and arch.

## Importing WebAssembly

::: warning NOTE
In Vite, `.wasm` files can be processed via the `?init` suffix, which supports browsers but not Node.js (Electron main process).
:::

In main process, pre-compiled `.wasm` files can be imported with `?loader` - the default export will be an initialization function that returns a Promise of the wasm instance:

```js
import loadWasm from '../../resources/add.wasm?loader'

loadWasm().then((instance) => {
  // Exported function live under instance.exports
  const add = instance.exports.add as (a: number, b: number) => number
  const sum = add(5, 6)
  console.log(sum); // Outputs: 11
})
```

The init function can also take the `imports` object which is passed along to `WebAssembly.instantiate` as its second argument:

```js
loadWasm({
  env: {
    memoryBase: 0,
    tableBase: 0,
    memory: new WebAssembly.Memory({
      initial: 256,
      maximum: 512
    }),
    table: new WebAssembly.Table({
      initial: 0,
      maximum: 0,
      element: 'anyfunc'
    })
  }
}).then(() => {
  /* ... */
})
```

In renderer, See Vite's [WebAssembly](https://vitejs.dev/guide/features.html#webassembly) feature for more details.
