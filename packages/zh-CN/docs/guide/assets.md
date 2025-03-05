---
outline: deep
---

# 资源处理

::: tip 提示
本章节中的资源处理功能仅适用于主进程。关于渲染进程的静态资源处理，请参阅 Vite 的 [静态资源处理](https://cn.vitejs.dev/guide/assets.html)。
:::

## Public 目录

公共目录默认为 `<root>/resources`，专用于主进程和预加载脚本。它可以通过 `main.publicDir` 和 `preload.publicDir` 选项进行配置。

如果你有 `图标`、`可执行程序`、`wasm 文件` 等资源，可以将它们放在这个目录中。

请注意：

- 公共目录中的所有资源都不会复制到输出目录。所以在打包 app 的时候，公共目录应该一起打包。
- 推荐使用 `?asset` 后缀导入公共资源。

::: warning 提示
值得注意的是渲染进程中的公共资源处理不同于主进程和预加载脚本。

- 默认情况下，渲染进程的工作目录位于 `src/renderer`，因此需要在该目录下创建公共资源目录。默认的公共目录名为 `public`，也可以通过 `renderer.publicDir` 指定。
- 渲染进程的公共资源将被复制到输出目录。
:::


## 类型定义

如果你是 TypeScript 用户，请确保添加一个 `*.d.ts` 声明文件以获得类型检查和智能感知：

```js
/// <reference types="electron-vite/node" />
```

同时，你也可以将 `electron-vite/node` 添加到 `tsconfig` 中的 `compilerOptions.types` 下：

```json
{
  "compilerOptions": {
    "types": ["electron-vite/node"]
  }
}
```

这将为资源导入提供类型定义（例如：导入 `*?asset` 文件）。

## 将资源引入为文件路径

在主进程中，可以使用 `?asset` 后缀将资源作为文件路径导入：

```js {2}
import { Tray, nativeImage } from 'electron'
import appIcon from '../../build/icon.ico?asset'

let tray = new Tray(nativeImage.createFromPath(appIcon))
```

在此示例中，`appIcon` 将解析为：

```js
const path = require("path");
const appIcon = path.join(__dirname, "./chunks/icon-4363016c.ico");
```

并且 `build/icon.ico` 将被复制到输出目录 (`out/main/chunks/icon-4363016c.ico`)。

如果 `appIcon` 放在 `public` 目录 中：

```js {2}
import { Tray, nativeImage } from 'electron'
import appIcon from '../../resources/icon.ico?asset'

let tray = new Tray(nativeImage.createFromPath(appIcon))
```

此时 `appIcon` 将被解析为：

```js
const path = require("path");
const appIcon = path.join(__dirname, "../../resources/icon.ico");
```

并且 `resources/icon.ico` 不会被复制到输出目录。


### 将 Json 文件引入为文件路径

当你导入 json 文件时，Vite 的 json 插件会将其解析为 json 对象。但有时我们想将其作为文件路径导入，这种情况下我们可以使用 `?commonjs-external&asset` 后缀来导入。

```js
import jsonFile from '../../resources/config.json?commonjs-external&asset'
```

### `app.asar.unpacked` 文件路径问题

由于 [ASAR 的限制](https://www.electronjs.org/docs/latest/tutorial/asar-archives#limitations-of-the-node-api)，我们不能将所有文件打包到 ASAR 存档中。有时，这会产生一个问题，因为二进制文件的路径会发生变化，但你的 `path.join(__dirname, 'binary')` 并没有改变。要使其正常工作，需要修复路径。将路径中的 `app.asar` 转换为 `app.asar.unpacked`。

你可以使用 `?asset&asarUnpack` 后缀来支持。例如：

```js
import bin from '../../resources/hello.exe?asset&asarUnpack'
```

然后 `bin` 将解析为：

```js
const path = require("path");
const bin = path.join(__dirname, "../../resources/hello.exe").replace("app.asar", "app.asar.unpacked");
```

## 导入原生 Node 模块

有两种使用 `*.node` 模块的方法。

1. 作为 node 模块导入

```js
import addon from '../../resources/hello.node'

console.log(addon?.hello())
```

2. 作为文件路径导入

```js
import addon from '../../resources/hello.node?asset'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const native = require(addon)
console.log(native?.hello())
```

值得注意的是通常需要根据 `platform` 和 `arch` 来导入原生 node 模块。如果能保证 node 模块是根据 platform 和 arch 生成的，使用第一种导入方式是没有问题的。否则，你可以使用第二种方法根据 platform 和 arch 来导入正确的 node 模块。

## 导入 WebAssembly

::: warning  提示
在 Vite 中，可以通过 `?init` 后缀处理 `.wasm` 文件，它支持浏览器，但不支持 Node.js（Electron 主进程）。
:::

在主进程中，预编译的 `.wasm` 文件可以通过 `?loader` 来导入。默认导出一个初始化函数，返回值为所导出 wasm 实例对象的 Promise：

```js
import loadWasm from '../../resources/add.wasm?loader'

loadWasm().then((instance) => {
  // Exported function live under instance.exports
  const add = instance.exports.add as (a: number, b: number) => number
  const sum = add(5, 6)
  console.log(sum); // Outputs: 11
})
```

初始化函数还可以将 `imports` 对象传递给 `WebAssembly.instantiate` 作为其第二个参数：

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

在渲染进程中，请参阅 Vite 的 [WebAssembly](https://vitejs.dev/guide/features.html#webassembly) 功能，了解更多详细信息。
