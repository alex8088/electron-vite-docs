# 快速开始

## 总览

**electron-vite** 是一个新型构建工具，旨在为 [Electron](https://www.electronjs.org) 提供更快、更精简的开发体验。它主要由四部分组成：

- 一套构建指令，它使用 [Vite](https://cn.vitejs.dev/) 打包你的代码，并且它能够处理 Electron 的独特环境，包括 [Node.js](https://nodejs.org/) 和浏览器环境。

- 集中配置主进程、渲染器和预加载脚本的 Vite 配置，并针对 Electron 的独特环境进行预配置。

- 为渲染器提供快速模块热替换（HMR）支持，为主进程和预加载脚本提供热重载支持，极大地提高了开发效率。

- 使用 V8 字节码保护源代码。

electron-vite 快速、简单且易学易用，旨在开箱即用。

你可以在 [简介](./introduction.md) 中了解更多关于项目的设计初衷。

## 安装

::: tip 前提条件
electron-vite 需要 **Node.js** 版本 14.18+ 和 **Vite** 版本 3.0+
:::

```sh
npm i electron-vite -D
```

## 命令行界面

在安装了 electron-vite 的项目中，你可以直接使用 `npx electron-vite` 运行，也可以在 `package.json` 文件中添加 npm scripts：

```json
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

```js
// electron.vite.config.js
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

```json {4}
{
  "name": "electron-app",
  "version": "1.0.0",
  "main": "./out/main/index.js",
}
```

Electron 的工作目录将是输出目录，而不是你的源代码目录。因此在打包 Electron 应用程序时可以将源代码排除。

了解更多有关 [生产构建](/guide/build) 的信息。

## 搭建第一个 electron-vite 项目

使用 NPM

```sh
npm create @quick-start/electron
```

使用 Yarn

```sh
yarn create @quick-start/electron
```

使用 PNPM

```sh
pnpm create @quick-start/electron
```

然后按照提示操作即可!

<div class="language-sh"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;"><span style="color:var(--vp-c-green);">✔</span> Project name: <span style="color:#888;">…</span> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#888;">electron-app</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;"><span style="color:var(--vp-c-green);">✔</span> Select a framework: <span style="color:#888;">›</span> <span style="color:#89DDFF;text-decoration:underline;">vue</span></span></span>
<span class="line"><span style="color:#A6ACCD;"><span style="color:var(--vp-c-green);">✔</span> Add TypeScript?</span><span style="color:#888;"> … No / <span style="color:#89DDFF;text-decoration:underline;">Yes</span></span></span>
<span class="line"><span style="color:#A6ACCD;"><span style="color:var(--vp-c-green);">✔</span> Add Electron updater plugin?</span><span style="color:#888;"> … No / <span style="color:#89DDFF;text-decoration:underline;">Yes</span></span></span>
<span class="line"><span style="color:#A6ACCD;"><span style="color:var(--vp-c-green);">✔</span> Enable Electron download mirror proxy?</span><span style="color:#888;"> … No / <span style="color:#89DDFF;text-decoration:underline;">Yes</span></span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">Scaffolding project in</span><span style="color:#A6ACCD;"> ./</span><span style="color:#89DDFF;">&lt;</span><span style="color:#888;">electron-app</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;">...</span></span>
<span class="line"><span style="color:#A6ACCD;">Done.</span></span>
<span class="line"></span></code></pre></div>

你还可以通过附加的命令行选项直接指定项目名称和你想要使用的模板。例如，要构建一个 Electron + Vue 项目，运行:

```bash
# npm 6.x
npm create @quick-start/electron my-app --template vue

# npm 7+, extra double-dash is needed:
npm create @quick-start/electron my-app -- --template vue

# yarn
yarn create @quick-start/electron my-app --template vue

# pnpm
pnpm create @quick-start/electron my-app --template vue
```

目前支持的模板预设如下：

|             JavaScript              |                TypeScript                 |
| :---------------------------------: | :---------------------------------------: |
| [vanilla](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/vanilla) | [vanilla-ts](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/vanilla-ts) |
|     [vue](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/vue)     |     [vue-ts](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/vue-ts)     |
|   [react](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/react)   |   [react-ts](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/react-ts)   |
|  [svelte](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/svelte)  |  [svelte-ts](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/svelte-ts)  |

了解更多有关 [create-electron](https://github.com/alex8088/quick-start/tree/master/packages/create-electron) 的信息。

## 克隆模板

create-electron 是一个快速生成主流 Electron 框架基础模板的工具。你还可以用如 [degit](https://github.com/Rich-Harris/degit) 之类的工具，使用 [electron-vite-boilerplate](https://github.com/alex8088/electron-vite-boilerplate) 模板来搭建项目。

```bash
npx degit alex8088/electron-vite-boilerplate electron-app
cd electron-app

npm install
npm run dev
```

## 寻求帮助

如果你在开发过程中遇到 `electron-vite` 的疑难问题，你可以去 [GitHub issue tracker](https://github.com/alex8088/electron-vite/issues) 查看是否有人已经遇到相同的问题。如果没有，欢迎提交 issue 到 github。
