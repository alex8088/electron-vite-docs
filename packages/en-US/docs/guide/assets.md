---
outline: deep
---

# Asset Handling

::: tip NOTE
The asset handling feature in this guide applies to the main process. For static asset handling of the renderer process, refer to Vite's [Static Asset Handling](https://vitejs.dev/guide/assets.html) guide.
:::

## Public Directory

The public directory defaults to `<root>/resources`, dedicated to the main process and preload scripts. It can be configured via the `main.build.publicDir` and `preload.build.publicDir` option.

If you have assets such as `icons`, `executables`, `wasm files`, etc., you can put them in this directory.

Note that:

- All assets in public directory are not copied to output directory. So when packaging the app, the public directory should be packaged together.
- It is recommended to use the `?asset` suffix to import public assets.

::: warning Warning
The public asset handling in renderers is different from the main process and preload scripts.

- By default, the working directory of renderers are located in `src/renderer`, so the public directory needs to be created in this directory. The default public directory is named `public`, which can also be specified by `renderer.build.publicDir`.
- The renderer public asset will be copied to output directory.
:::

## Type Definitions

If you are a TypeScript user, make sure to add a `*.d.ts` declaration file to get type checks and intellisense:

```js
/// <reference types="electron-vite/node" />
```

Also, you can add `electron-vite/node` to `compilerOptions.types` of your `tsconfig`:

```json
{
  "compilerOptions": {
    "types": ["electron-vite/node"]
  }
}
```

This will provide type definitions for asset imports (e.g. importing an `*?asset` file).

## Importing Asset as File Path

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

### Importing Json File as File Path

When you import json file, it will be resolved to json object by Vite's json plugin. But sometimes we want to import it as file path, in this case we can use the `?commonjs-external&asset` suffix to import.

```js
import jsonFile from '../../resources/config.json?commonjs-external&asset'
```

### `app.asar.unpacked` File Path Problem

Due to [limitations of ASAR](https://www.electronjs.org/docs/latest/tutorial/asar-archives#limitations-of-the-node-api), we cannot pack all files into ASAR archives. Sometimes, this creates a problem as the path to the file changes, but your `path.join(__dirname, 'binary')` is not changed. To make it work you need to fix the path. Convert `app.asar` in path to `app.asar.unpacked`.

You can use the `?asset&asarUnpack` suffix to support this. For example:

```js
import bin from '../../resources/hello.exe?asset&asarUnpack'
```

Then `bin` will be resolved to:

```js
const path = require("path");
const bin = path.join(__dirname, "../../resources/hello.exe").replace("app.asar", "app.asar.unpacked");
```

## Importing Worker Threads

### Import with Query Suffixes

A node worker can be directly imported by appending `?nodeWorker` to the import request. The default export will be a node worker constructor:

```js
import createWorker from './worker?nodeWorker'

createWorker({ workerData: 'worker' })
    .on('message', (message) => {
      console.log(`Message from worker: ${message}`)
    })
    .postMessage('')
```

This syntax requires no configuration and is the `recommended` way to create node workers.

### Import with Constructors

A node worker also can be imported using `new Worker()`:

```js
import { resolve } from 'node:path'
import { Worker } from 'node:worker_threads'

new Worker(resolve(__dirname, './worker.js'), {})
```

This syntax requires configuration to bundle the worker file：

```js
// electron.vite.config.ts
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.ts'),
          worker: resolve(__dirname, 'src/main/worker.ts')
        }
      }
    }
  },
  // ...
})
```

### Examples

You can learn more by playing with the [example](https://github.com/alex8088/electron-vite-worker-example).


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
