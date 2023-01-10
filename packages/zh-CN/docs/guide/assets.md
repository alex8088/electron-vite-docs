# 静态资源处理

::: tip 提示
静态资源处理功能从 1.0.17 版本开始可用。
:::

## Public 目录

### 对于主进程和预加载脚本

如果你有下列这些资源：

- 被源码引用（例如 `*.node`, `*.wasm`, `*.exe`, `*.png`）
- 必须保持原有文件名（没有经过 hash）
- 不想被打包到 ASAR 存档中（[ASAR 的局限性](https://www.electronjs.org/docs/latest/tutorial/asar-archives#limitations-of-the-node-api)）

那么你可以将该资源放在指定的 `public` 目录中，它应位于你的项目根目录。

目录默认是 `<root>/resources`，但可以通过 [publicDir](https://vitejs.dev/config/shared-options.html#publicdir) 选项来配置。

请注意：

- `public` 目录中的所有资源都不会复制到输出目录。所以在打包 app 的时候，`public` 目录应该一起打包。
- 推荐使用 `?asset` 后缀导入 `public` 中的资源。

### 对于渲染进程

默认情况下，渲染器的工作目录位于 `src/renderer`，因此需要在该目录下创建公共资源目录。默认的公共目录名为 `public`，也可以通过 [publicDir](https://vitejs.dev/config/shared-options.html#publicdir) 指定。

值得注意的是渲染器中的公共资源处理不同于主进程和预加载脚本。有关详细信息，请参阅 [Public 目录](https://vitejs.dev/guide/assets.html#the-public-directory)。

## ASAR 存档

Electron 应用程序的源代码通常会打包到 ASAR 存档中，这是一种为 Electron 应用程序而设计的简易存档格式。

但 ASAR 存档有局限性：

- 某些 Node API 需要额外解压缩到一个临时文件中，并将临时文件的路径传递给 API 以使其工作。这会为这些 API 增加一些开销。比如 `child_process.execFile`、`fs.open`、`process.dlopen` 等。
- 有一些 Node API 不支持在 ASAR 存档中执行二进制文件，例如 `child_process.exec`、`child_process.spawn`。

如上所述，最好不要将这些资源打包到 ASAR 存档中。

有那些不应该打包的二进制文件：

- 原生 Node 模块，如 `sqlite`、`fluent-ffmpeg` 等。
- 引用的二进制文件，如 `*.node`、`*.app`、`*.exe` 等。

例如，在 `electron-builder` 中你可以这样配置：

```yaml
asarUnpack:
  - node_modules/sqlite3
  - resources/*
  - out/main/chunks/*.node
```

了解有关 [ASAR 存档](https://www.electronjs.org/docs/latest/tutorial/asar-archives) 的更多信息。

::: tip 提示
建议将这些资源放在 public 目录中，这样可以更容易配置排除项，不将它们打包到 asar 存档中。
:::

## 在主进程中导入资源

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

默认情况下，electron-vite 在 [electron-vite/node.d.ts](https://github.com/alex8088/electron-vite/blob/master/node.d.ts) 中提供了 `*?asset` 的类型定义。如果你是 TypeScript 用户，请确保在 `env.d.ts` 中添加类型定义以获得类型检查和智能感知：

```js
/// <reference types="electron-vite/node" />
```

### `app.asar.unpacked` 文件路径问题

我们知道 ASAR 的局限性，不会将二进制文件打包到 ASAR 存档中。有时，这会产生一个问题，因为二进制文件的路径会发生变化，但你的 `path.join(__dirname, 'binary')` 并没有改变。要使其正常工作，需要修复路径。将路径中的 `app.asar` 转换为 `app.asar.unpacked`。

你可以使用 `?asset&asarUnpack` 后缀来支持。例如：

```js
import bin from '../../resources/hello.exe?asset&asarUnpack'
```

然后 `bin` 将解析为：

```js
const path = require("path");
const bin = path.join(__dirname, "../../resources/hello.exe").replace("app.asar", "app.asar.unpacked");
```

## 在渲染进程中导入资源

在渲染进程中，静态资源处理与常规 web 应用程序相同。

请参阅 Vite 的 [静态资源处理](https://vitejs.dev/guide/assets.html)。

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
