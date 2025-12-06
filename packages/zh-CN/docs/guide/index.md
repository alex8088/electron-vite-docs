# 快速开始

::: tip 提示
本指南假设你熟悉 Electron 和 Vite。开始阅读之前建议先阅读 [Electron 指南](https://www.electronjs.org/docs/) 和 [Vite 指南](https://cn.vitejs.dev/guide/)。
:::

## 总览

**electron-vite** 是一个新型构建工具，旨在为 [Electron](https://www.electronjs.org) 提供更快、更精简的开发体验。它提供：

- 一套构建指令，使用 [Vite](https://cn.vitejs.dev/) 打包你的代码，同时无缝处理 Electron 的双环境（[Node.js](https://nodejs.org/) 和浏览器上下文）。

- 为主进程、渲染进程和预加载脚本提供单一的配置入口，并针对 Electron 优化了合理的 [默认值配置](../config/index.md#内置配置)。

- 为渲染进程提供 [模块热替换（HMR）](./hmr-and-hot-reloading.md#使用-hmr)支持，并为主进程和预加载脚本提供 [热重载](./hmr-and-hot-reloading.md#启用热重载) 支持。

- 高级开发能力，包括通过简单导入后缀实现 [多线程支持](./dev.md#多进程)、针对主进程的 [资源优化处理](./assets.md)、用于增强沙盒支持的 [隔离构建](./isolated-build.md) 模式，以及 [ V8 字节码编译以保护源代码](./source-code-protection.md)。

electron-vite 快速、简单且功能强大，旨在开箱即用。

## 安装

::: tip 前提条件
electron-vite 需要 **Node.js** 版本 20.19+, 22.12+ 和 **Vite** 版本 5.0+
:::

```sh
npm i electron-vite -D
```

## 命令行界面

在安装了 electron-vite 的项目中，你可以直接使用 `npx electron-vite` 运行，也可以在 `package.json` 文件中添加 npm scripts：

```json [package.json]
{
  "scripts": {
    "start": "electron-vite preview", // 开启 Electron 程序预览生产构建
    "dev": "electron-vite dev", // 开启开发服务和 Electron 程序
    "prebuild": "electron-vite build" // 为生产构建代码
  }
}
```

你还可以指定其他 CLI 选项，例如 `--outDir`。 有关 CLI 选项的完整列表，可以在你的项目中运行 `npx electron-vite -h`。

了解更多有关 [命令行界面](/guide/cli) 的信息。

## 配置 electron-vite

当以命令行方式运行 `electron-vite` 时，electron-vite 将会自动尝试解析项目根目录下名为 `electron.vite.config.js` 的配置文件。最基本的配置文件如下所示：

```js [electron.vite.config.js]
export default {
  main: {
    // vite config options
  },
  preload: {
    // vite config options
  },
  renderer: {
    // vite config options
  }
}
```

了解更多有关 [配置](/config/) 的信息。

## Electron 入口

当使用 electron-vite 打包代码时，Electron 应用程序的入口点应更改为输出目录中的主进程入口文件。默认的输出目录 `outDir` 为 `out`。你的 `package.json` 文件会是这样：

```json [package.json] {4}
{
  "name": "electron-app",
  "version": "1.0.0",
  "main": "./out/main/index.js"
}
```

Electron 的工作目录将是输出目录，而不是你的源代码目录。因此在打包 Electron 应用程序时可以将源代码排除。

了解更多有关 [生产构建](/guide/build) 的信息。

## 搭建第一个 electron-vite 项目

在命令行中运行以下命令：

::: code-group

```sh [npm]
npm create @quick-start/electron@latest
```

```sh [yarn]
yarn create @quick-start/electron
```

```sh [pnpm]
pnpm create @quick-start/electron
```

:::

然后按照提示操作即可!

<<< @/snippets/scaffold.ansi

你还可以通过附加的命令行选项直接指定项目名称和你想要使用的模板。例如，要构建一个 Electron + Vue 项目，运行:

::: code-group

```sh [npm]
# npm 7+，需要添加额外的 --：
npm create @quick-start/electron@latest my-app -- --template vue
```

```sh [yarn]
yarn create @quick-start/electron my-app --template vue
```

```sh [pnpm]
pnpm create @quick-start/electron my-app --template vue
```

:::

目前支持的模板预设如下：

|                                                 JavaScript                                                 |                                                    TypeScript                                                    |
| :--------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------: |
| [vanilla](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/vanilla) | [vanilla-ts](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/vanilla-ts) |
|     [vue](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/vue)     |     [vue-ts](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/vue-ts)     |
|   [react](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/react)   |   [react-ts](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/react-ts)   |
|  [svelte](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/svelte)  |  [svelte-ts](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/svelte-ts)  |
|   [solid](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/solid)   |   [solid-ts](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/solid-ts)   |

了解更多有关 [create-electron](https://github.com/alex8088/quick-start/tree/master/packages/create-electron) 的信息。

## 克隆模板

create-electron 是一个快速生成主流 Electron 框架基础模板的工具。你还可以用如 [degit](https://github.com/Rich-Harris/degit) 之类的工具，使用 [electron-vite-boilerplate](https://github.com/alex8088/electron-vite-boilerplate) 模板来搭建项目。

```sh
npx degit alex8088/electron-vite-boilerplate electron-app
cd electron-app

npm install
npm run dev
```

## 寻求帮助

如果你在开发过程中遇到 `electron-vite` 的疑难问题，你可以去 [GitHub issue tracker](https://github.com/alex8088/electron-vite/issues) 查看是否有人已经遇到相同的问题。如果没有，欢迎提交 issue 到 github。
