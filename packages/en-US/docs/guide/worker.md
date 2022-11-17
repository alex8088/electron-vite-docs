# Worker Threads

## Import with Query Suffixes

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

By default, electron-vite provides type definitions for `*?nodeWorker` in [electron-vite/node.d.ts](https://github.com/alex8088/electron-vite/blob/master/node.d.ts). If you are a TypeScript user, make sure to add type definitions in `env.d.ts` to get type checks and intellisense:

```js
/// <reference types="electron-vite/node" />
```

## Import with Constructors

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

## Examples

You can learn more by playing with the [example](https://github.com/alex8088/electron-vite-worker-example).
