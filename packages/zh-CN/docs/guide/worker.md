# Worker Threads

## 带有查询后缀的导入

你可以在导入请求上添加 `?nodeWorker` 查询参数来直接导入一个 node worker。默认导出会是一个 node worker 的构造函数：

```js
import createWorker from './worker?nodeWorker'

createWorker({ workerData: 'worker' })
    .on('message', (message) => {
      console.log(`Message from worker: ${message}`)
    })
    .postMessage('')
```

此语法不需要配置，是创建 worker 的 推荐 方式。

默认情况下，electron-vite 在 [electron-vite/node.d.ts](https://github.com/alex8088/electron-vite/blob/master/node.d.ts) 中提供了 `*?nodeWorker` 的类型定义。如果您是 TypeScript 用户，请确保在 `env.d.ts` 中添加类型定义以获得类型检查和智能感知：

```js
/// <reference types="electron-vite/node" />
```

## 通过构造器导入

也可以使用 `new Worker()` 导入 node worker：

```js
import { resolve } from 'node:path'
import { Worker } from 'node:worker_threads'

new Worker(resolve(__dirname, './worker.js'), {})
```

此语法需要配置来打包 worker 文件：

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

## 示例

你可以通过演练 [示例](https://github.com/alex8088/electron-vite-worker-example) 来了解更多信息。
