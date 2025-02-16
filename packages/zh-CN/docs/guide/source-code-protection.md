# 源代码保护

::: tip 提示
源代码保护功能从 1.0.9 版本开始可用
:::

我们都知道 Electron 使用 javascript 来构建桌面应用程序，这使得黑客很容易对我们的应用程序进行进行解包、修改逻辑破解商业化限制、重新打包，再重新分发破解版。

## 解决方案

要想真正解决问题，除了把所有商业化逻辑做到服务端，我们还需要对代码进行加固，避免解包、篡改、二次打包、二次分发。

主流方案：

1. **Uglify / Obfuscator：** 通过对 JS 代码进行丑化和混淆，尽可能降低其可读性。
2. **Native 加密：** 通过 XOR 或 AES 对构建产物进行加密，封装到 Node Addon 中，并在运行时由 JS 解密。
3. **ASAR 加密：** 将 Electron ASAR 文件进行加密，并修改 Electron 源代码，在读取 ASAR 文件之前对其解密后再运行。
4. **V8 字节码：** 通过 Node 标准库里的 `vm` 模块，可以从 script 对象中生成其缓存数据（[参考](https://nodejs.org/api/vm.html#vm_script_createcacheddata)）。该缓存数据可以理解为 v8 的字节码，该方案通过分发字节码的形式来达到源代码保护的目的。

方案比较：

| -               | Obfuscator 混淆 | Native 加密 | ASAR 加密 | V8 字节码 |
| :-------------: | :--------: | :---------------: | :-------------: | :---------: |
| **解包**    | 容易       | 难              |  难           | 难        |
| **篡改**    | 容易       | 容易              |  中等         | 难        |
| **可读性**   | 容易       | 容易              |  容易           | 难        |
| **二次打包** | 容易       | 容易              |  容易           | 容易        |
| **接入成本** | 低        | 难              |  难           | 中等      |
| **保护强度**  | 低        | 中等            |  中等         | 难        |


目前，使用 v8 字节码的解决方案似乎是最好的解决方案。

阅读更多：

- [Electron code protection solution based on Node.js Addon and V8 bytecode](https://www.mo4tech.com/electron-code-protection-solution-based-on-node-js-addon-and-v8-bytecode.html)

## 什么是 V8 字节码

我们可以理解，V8 字节码是 V8 引擎在解析和编译 JavaScript 后产物的序列化形式，它通常用于浏览器内的性能优化。所以如果我们通过 V8 字节码运行代码，不仅能够起到代码保护作用，还对性能有一定的提升。

electron-vite 受 [bytenode](https://github.com/bytenode/bytenode) 启发，具体实现：

- 实现一个插件 `bytecodePlugin` 来解析构建产物，并确定是否编译为字节码。
- 启动 Electron 进程将构建产物编译成 `.jsc` ​​文件，并确保生成的字节码可以在 Electron 的 Node 环境中运行。
- 自动生成字节码加载器，使 Electron 应用能够加载字节码模块。
- 支持开发者自由决定编译哪些块。

此外，electron-vite 还解决了一些 `bytenode` 无法解决的问题：

- 修复了异步箭头函数可能导致 Electron 应用程序崩溃的问题。
- 保护字符串。

::: warning 警告
不支持 `Function.prototype.toString`，原因是源代码并不跟随字节码分发，因此取不到函数的源代码。
:::

## 开启字节码插件保护源代码

启用 `bytecodePlugin` 插件：

```js
import { defineConfig, bytecodePlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [bytecodePlugin()]
  },
  preload: {
    plugins: [bytecodePlugin()]
  },
  renderer: {
    // ...
  }
})
```

::: tip 提示
`bytecodePlugin` 仅适用于生产阶段构建并且只支持主进程和预加载脚本。

需要注意的是，预加载脚本需要禁用 `sandbox` 才能支持字节码，因为字节码是基于 Node 的 `vm` 模块实现。从 Electron 20 开始，渲染器默认会被沙箱化，所以如果你想使用字节码来保护预加载脚本，你需要设置 `sandbox: false`。
:::

##  `bytecodePlugin` 选项

### chunkAlias

- 类型：`string | string[]`


设置构建产物块别名以指示字节码编译器编译关联的包。通常需要与选项 `build.rollupOptions.output.manualChunks` 一起使用。

### transformArrowFunctions

- 类型： `boolean`
- 默认： `true`（自 electron-vite 1.0.10 起默认启用）

设置为 `false` 禁止将箭头函数转换为普通函数。

### removeBundleJS

- 类型： `boolean`
- 默认： `true`

设置 `false` 以保留已编译为字节码文件的 bundle 文件。

### protectedStrings

- 类型: `string[]`
- 相关: [V8 字节码的局限性](#v8-字节码的局限性)

指定源代码中的哪些字符串（如 `敏感字符串`、`加密密钥`、`密码`等）需要加强保护。

V8 字节码不保护字符串，但是 electron-vite 会将这些字符串转换为字符代码（使用 [String.fromCharCode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode)），使得这些字符串可以被 V8 字节码保护。

## 自定义保护

例如，只要保护 `src/main/foo.ts`：

```txt {5}
.
├──src
│  ├──main
│  │  ├──index.ts
│  │  ├──foo.ts
│  │  └──...
└──...
```

你可以像下面一样修改你的配置文件：

```js
import { defineConfig, bytecodePlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [bytecodePlugin({ chunkAlias: 'foo' })],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id): string | void {
            if (id.includes('foo')) {
              return 'foo'
            }
          }
        }
      }
    }
  },
  preload: {
    // ...
  },
  renderer: {
    // ...
  }
})
```

## 示例

你可以通过演练 [示例](https://github.com/alex8088/electron-vite-bytecode-example) 来了解更多信息。

## V8 字节码的局限性

V8 字节码不保护字符串，如果我们在 JS 代码中写死了一些加密密钥或其他敏感字符串，只要将 V8 字节码作为字符串阅读，还是能直接看到这些字符串内容的。

但是 electron-vite 可以将这些字符串转为字符代码，这样这些字符串就可以受到 V8 字节码的保护。例如：

```js
// string in source code
const encryptKey = 'ABC'

// electron-vite will transform string to character codes
const encryptKey = String.fromCharCode(65, 66, 67)
```

源代码中要保护的字符串可以通过插件 `protectedStrings` 选项指定。

```js {5}
import { defineConfig, bytecodePlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [bytecodePlugin({ protectedStrings: ['ABC'] })]
  },
  // ...
})
```

::: warning 警告
不应该为了保护而枚举源代码中的所有字符串，通常我们只需要保护敏感字符串即可。
:::

::: warning 警告
当启用最小化混淆（`build.minify`）时，字符串保护不起作用。这是因为字符串保护是基于字符代码实现的。然而，现代的压缩混淆工具（例如 `esbuild` 或 `terser`）会恢复转换后的字符代码，导致保护失败。 electron-vite 会发出警告。事实上，最小化混淆对于减小字节码大小的作用不大，因此建议在保护字符串时不要启用最小化混淆。
:::

## 多平台构建

::: tip 提示
不要期望可以在一个平台上为所有平台构建应用程序。
:::

默认情况下根据当前 **Electron Node.js 版本**和当前**架构**（例如 x86、x64、ARM 等）编译字节码。除了确保发布的 Electron 应用程序的 Node.js 版本与编译时的版本相同外，架构是多平台构建的约束。

### 单一架构目标构建多平台

可能支持多平台构建：

- 在 64 位的 MacOS 中构建 MacOS、Windows 或 Linux 的 64 位 Electron 应用程序

### 单一平台构建多架构目标

例如，在 arm64 MacOS 中构建 MacOS 的 64 位应用程序，它会运行出错。因为默认构建的基于 arm64 的字节码无法在 64 位应用程序中运行。

但是，我们可以指定另一个配置文件并将环境变量 `ELECTRON_EXEC_PATH` 设置为（64 位）Electron 应用程序的路径。字节码编译器将使用指定的 Electron 应用程序进行编译。

```js {5}
// specify `electron.x64.vite.config.ts` for building x64 Electron app
import { defineConfig } from 'electron-vite'

export default defineConfig(() => {
  process.env.ELECTRON_EXEC_PATH = '/path/to/electron-x64/Electron.app/Contents/MacOS/Electron'

  return {
    // electron-vite config
  }
})
```

::: tip 提示
可以将 `--arch` 标志与 npm install 一起使用来安装其他架构的 Electron。

```sh
npm install --arch=ia32 electron
```
:::

当然这也是有限制的，因为需要运行 Electron 进程编译字节码，保证字节码是按照 Electron Node.js 版本生成的。但不同的架构不一定相互兼容。例如，64 位应用程序可以在 arm64 MacOS 中运行，但 arm64 应用程序无法在 64 位 MacOS 中运行。

可能支持多架构构建：

- 在 arm64 MacOS 中构建 MacOS 的 64 位 Electron 应用程序
- 在 arm64 Windows 中构建 Windows 的 64 位 Electron 应用程序
- 在 64 位 Windows 中构建 Windows 的 32 位 Electron 应用程序

::: warning 警告
字节码与 CPU 无关。但是，你应该在部署前后运行测试，因为 V8 健全性检查包括一些与 CPU 支持的功能相关的检查，因此在极少数情况下这可能会导致错误。
:::

## 常见疑问

### 对代码组织和编写的影响？

目前发现字节码方案对代码的唯一影响，是 `Function.prototype.toString()` 方法无法正常使用，原因是源代码并不跟随字节码分发，因此取不到函数的源代码。

### 对程序性能是否有影响？

对代码执行性能没有影响，略有提升。

### 对程序体积的影响？

对于只有几百 KB 的 Bundle 来说，字节码体积会有比较明显的膨胀，但是对于 2M+ 的 Bundle 来说，字节码体积没有太大的区别。

### 代码保护强度如何？

目前来说，还没有现成的工具能够对 v8 字节码进行反编译，因此该方案还是还是比较可靠且安全的。
