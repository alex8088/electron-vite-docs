---
outline: deep
---

# 源代码保护

## 总览

Electron 应用通过 JavaScript 构建桌面软件，这使得它们容易受到 **逆向工程**、**代码篡改** 和 **未授权再分发** 的威胁。

本文介绍了一种有效的保护方案：**V8 字节码** 结合 **ASAR 完整性校验**，能够为生产环境下的 Electron 应用提供强有力的安全防护。

::: warning 注意
没有任何客户端保护方案是绝对安全的。本方案能够显著提高攻击难度，但仍应结合架构级安全措施和服务端校验，才能实现全面的安全保障。
:::

## 解决方案：V8 字节码 + ASAR 完整性

### ASAR 完整性

[ASAR 完整性](https://www.electronjs.org/docs/latest/tutorial/asar-integrity) 是一项安全功能，它会在运行时将应用程序 ASAR 存档文件的内容与构建时生成的哈希值进行比对，以检测是否存在篡改行为。如果哈希缺失或不匹配，应用程序会被强制终止。

**保护特性**：

- 检测并防止文件篡改
- 阻止未经授权的重新打包

关于该功能的工作原理以及如何在应用中使用，请参阅：[ASAR 完整性](https://www.electronjs.org/docs/latest/tutorial/asar-integrity)

::: tip 注意
该功能要求 **Electron 16+（macOS）** 和 **Electron 30+（Windows）**。
:::

例如，使用 `electron-builder` 启用 ASAR 完整性校验：

```yaml [electron-builder.yaml]
build:
  appId: your.id
  # ... 其他配置
  electronFuses:
    # 启用 ASAR 完整性校验
    EnableEmbeddedAsarIntegrityValidation: true
    # （可选，但推荐）确保 Electron 仅从 app.asar 加载应用程序代码
    OnlyLoadAppFromAsar: true
```

### V8 字节码

Node.js 标准库中的 `vm` 模块可以将 JavaScript 源码生成 V8 字节码缓存。该功能最初设计用于性能优化，缓存的字节码可以在运行时分发和解释执行，从而有效地混淆源代码。

**保护特性**：

- 逆向工程难度高
- 保持原生性能
- 无需外部依赖
- 与 Electron 运行时兼容

**限制**：

- **异步箭头函数** - 可能导致运行时崩溃
- **字符串字面量** - 敏感字符串（加密密钥、令牌、凭证）在字节码中仍可被读取

electron-vite 为这些限制提供了内置解决方案。

## 在 electron-vite 中的实现

electron-vite 的实现受到 [bytenode](https://github.com/bytenode/bytenode) 的启发。其实现包括：

- **字节码编译插件** — 解析打包产物，并决定哪些 chunk 需要编译为字节码缓存

- **基于 Electron 的编译** — 启动 Electron 进程，将打包产物编译成 `.jsc` 文件，确保字节码与 Electron 的 NodeJS 环境兼容

- **字节码加载器** — 生成运行时加载器，使 Electron 应用能够加载字节码缓存

**增强保护**：

- 解决异步箭头函数的兼容性问题
- 混淆字符串字面量以保护敏感数据

::: warning 警告
不支持 `Function.prototype.toString` ，原因是源代码并不跟随字节码分发，因此取不到函数的源代码。
:::

## 启用字节码

使用 `build.bytecode` 选项来启用字节码功能：

```js [electron.vite.config.ts]
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    build: {
      bytecode: true
    }
  },
  preload: {
    build: {
      bytecode: true
    }
  },
  renderer: {
    // ...
  }
})
```

::: warning 注意
在 `electron-vite 5` 之前，你需要使用 `bytecodePlugin` 来启用它。
:::

::: tip 提示
`Bytecode` 仅在生产环境中生效，并且只支持主进程和预加载脚本。

请注意，预加载脚本必须禁用 `sandbox` 才能支持字节码，因为它依赖于 Node.js 的 `vm` 模块。自 Electron 20 起，渲染进程默认开启沙盒，因此在预加载脚本中使用字节码时，需要设置 `sandbox: false`。
:::

## 选项

`build.bytecode` 选项还可以接受一个 `BytecodeOptions` 对象来自定义保护行为。

### bytecode.chunkAlias

- 类型: `string | string[]`

设置 chunk 别名，指定字节码编译器应处理哪些产物。通常与 `build.rollupOptions.output.manualChunks` 配合使用。

例如，只保护 `src/main/foo.ts`：

```txt {5}
.
├──src
│  ├──main
│  │  ├──index.ts
│  │  ├──foo.ts
│  │  └──...
└──...
```

你可以这样修改配置文件：

```js [electron.vite.config.ts] {16}
import { defineConfig } from 'electron-vite'

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
      },
      build: {
        bytecode: { chunkAlias: 'foo' }
      }
    }
  }
  // ...
})
```

### bytecode.transformArrowFunctions

- 类型: `boolean`
- 默认值: `true`

设置为 `false` 禁用将箭头函数转换为普通函数。

::: tip 注意
箭头函数转换通过 [Babel](https://babeljs.io/docs/babel-plugin-transform-arrow-functions) 实现。禁用此选项可能导致运行时崩溃。
:::

### bytecode.removeBundleJS

- 类型: `boolean`
- 默认值: `true`

设置为 `false` 以保留已编译为字节码的 bundle 文件。

### bytecode.protectedStrings

- 类型: `string[]`

指定源代码中需要保护的字符串（例如 `加密密钥`、`令牌`、`凭证`）。

::: tip 提示
electron-vite 会识别指定的字符串，并使用 [String.fromCharCode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode) 将其转换为 IIFE 函数。一旦编译为字节码，这些字符串将被混淆且不可读。支持 `字符串字面量` 和 `模板字面量（仅纯静态）`。

```js
// 源码中的字符串
const encryptKey = 'ABC'

// electron-vite 会将其转换为 IIFE 函数
const encryptKey = (function () {})([65, 66, 67])
```

:::

::: details 什么是纯静态模板字面量

```js
// ✅
const foo = `-----BEGIN CERTIFICATE-----
MIIDkTCCAnmgAw...
`
// ❌
const zoo = `ABC ${x}`
```

:::

例如：

```js [electron.vite.config.ts] {13}
import { defineConfig } from 'electron-vite'

const protectedStrings = [
  'foo',
  `-----BEGIN CERTIFICATE-----
MIIDkTCCAnmgAwIBAgIUQt726ICGVvNVXHfzwCSwCR4
BQAwcDELMAkGA1UEBhMCQ04xDzANBgNVBAgMBll1bm5.......`
]

export default defineConfig({
  main: {
    build: {
      bytecode: { protectedStrings }
    }
  }
  // ...
})
```

::: warning 警告
不应该为了保护而枚举源代码中的所有字符串，通常我们只需要保护敏感字符串即可。
:::

## 构建限制

::: tip 提示
不要期望在一个平台上为所有平台构建应用程序。
:::

预编译的`字节码缓存`会随 Electron 应用程序一起分发。虽然 V8 字节码本身是`与架构无关`的，但由于优化元数据（如内联缓存、反馈向量和字节序），这些缓存与特定的 `V8（Node.js）版本` 和 `CPU 架构（如 x64 或 ARM64）`绑定。**这使得它们无法在针对不同架构的 Electron 构建中重用**。

此外，尽管不同操作系统上相同架构（如 Windows x64 和 macOS x64）的字节码缓存理论上可能兼容，但 V8 内部的额外验证机制通常会使 **跨平台分发不可靠，因此在实践中不推荐**。

在某些情况下，可以在同一平台上为不同架构生成字节码缓存，前提是目标架构的 Electron 构建可以在当前系统上运行。例如，x64 Electron 二进制文件可以在 ARM64 macOS 设备上运行，因此可以在 ARM64 环境下生成针对 x64 的字节码缓存。

为此，你可以指定另一个配置文件，并将 `ELECTRON_EXEC_PATH` 环境变量设置为 x64 Electron 应用程序可执行文件的路径。字节码编译器将使用指定的 Electron 应用程序进行编译。

```js [electron.vite.config.x64.ts] {5}
import { defineConfig } from 'electron-vite'

export default defineConfig(() => {
  process.env.ELECTRON_EXEC_PATH =
    '/path/to/electron-x64/Electron.app/Contents/MacOS/Electron'

  return {
    // ...
  }
})
```

::: details 如何安装其他架构的 Electron
你可以在 npm install 时使用 `--arch` 标志来安装指定架构的 Electron。

```sh
npm install --arch=ia32 electron
```

:::

然而，上述方法一次只能构建一个架构的 Electron 应用程序。如果你需要在单次构建过程中为多个架构生成构建，可以利用构建工具的钩子实现。例如，通过 `electron-builder` 的 `beforeBuild` 钩子，动态修改 `ELECTRON_EXEC_PATH` 并为每个目标架构执行 `electron-vite build` 命令。

```js [beforeBuild.js]
const { execSync } = require('child_process')
const os = require('os')

module.exports = {
  async beforeBuild(context) {
    const targetArch = context.arch // 目标架构
    const hostArch = os.arch() // 当前本机架构

    // 仅当目标架构与本机架构不同时，修改 ELECTRON_EXEC_PATH
    if (targetArch !== hostArch) {
      process.env.ELECTRON_EXEC_PATH = `/path/to/electron-${targetArch}/Electron.app/Contents/MacOS/Electron`
    }

    // 执行 electron-vite build 命令
    execSync('npm run electron-vite build', { stdio: 'inherit' })
  }
}
```
