# Getting Started

## Overview

**electron-vite** is a build tool that aims to provide a faster and leaner development experience for [Electron](https://www.electronjs.org). It consists of three major parts:

- A build command that bundles your code with [Vite](https://vitejs.dev/), and able to handle Electron's unique environment including [Node.js](https://nodejs.org/) and browser environments.

- Centrally configure the main process, renderers and preload scripts Vite configuration, and preconfigure for Electron's unique environment.

- Use fast Hot Module Replacement(HMR) for renderers, extremely improving development efficiency.

electron-vite is fast, simple and approachable, designed to work out-of-the-box.

You can learn more about the rationale behind the project in the [Introduction](./introduction.md) section.

## Installation

::: tip Pre-requisites
Requires **Node.js** version 14.18+ and **Vite** version 2.6+
:::

```sh
npm i electron-vite -D
```

## Command Line Interface

In a project where electron-vite is installed, you can use `electron-vite` binary directly with `npx electron-vite` or add the npm scripts to your `package.json` file like this:

```json
{
  "scripts": {
    "start": "electron-vite preview", // start electron app to preview production build
    "dev": "electron-vite dev", // start dev server and electron app
    "prebuild": "electron-vite build" // build for production
  }
}
```

You can specify additional CLI options like `--outDir`. For a full list of CLI options, run `npx electron-vite -h` in your project.

Learn more about [Command Line Interface](/guide/cli).

## Configuring electron-vite

When running `electron-vite` from the command line, electron-vite will automatically try to resolve a config file named `electron.vite.config.js` inside project root. The most basic config file looks like this:

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

Learn more about [Config Reference](/config/).

## Electron entry point

When using electron-vite to bundle your code, the entry point of the Electron application should be changed to the main process entry file in the output directory. The default `outDir` is `out`. Your `package.json` file should look something like this:

```json {4}
{
  "name": "electron-app",
  "version": "1.0.0",
  "main": "./out/main/index.js",
}
```

Electron's working directory will be the output directory, not your source code directory. So you can exclude the source code when packaging Electron application.

Learn more about [Build for production](/guide/build).

## Scaffolding Your First electron-vite Project

With NPM

```sh
npm create @quick-start/electron
```

With Yarn

```sh
yarn create @quick-start/electron
```

With PNPM

```sh
pnpm create @quick-start/electron
```

Then follow the prompts!

<div class="language-sh"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;"><span style="color:var(--vp-c-green);">✔</span> Project name: <span style="color:#888;">…</span> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#888;">electron-app</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;"><span style="color:var(--vp-c-green);">✔</span> Select a framework: <span style="color:#888;">›</span> <span style="color:#89DDFF;text-decoration:underline;">vue</span></span></span>
<span class="line"><span style="color:#A6ACCD;"><span style="color:var(--vp-c-green);">✔</span> Add TypeScript?</span><span style="color:#888;"> … No / <span style="color:#89DDFF;text-decoration:underline;">Yes</span></span></span>
<span class="line"><span style="color:#A6ACCD;"><span style="color:var(--vp-c-green);">✔</span> Add Electron updater plugin?</span><span style="color:#888;"> … No / <span style="color:#89DDFF;text-decoration:underline;">Yes</span></span></span>
<span class="line"><span style="color:#A6ACCD;"><span style="color:var(--vp-c-green);">✔</span> Enable Electron download mirror proxy?</span><span style="color:#888;"> … No / <span style="color:#89DDFF;text-decoration:underline;">Yes</span></span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">Scaffolding project in</span><span style="color:#A6ACCD;"> ./</span><span style="color:#89DDFF;">&lt;</span><span style="color:#888;">electron-app</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;">...</span></span>
<span class="line"><span style="color:#A6ACCD;">Done.</span></span>
<span class="line"></span></code></pre></div>

You can also directly specify the project name and the template you want to use via additional command line options. For example, to scaffold an Electron + Vue project, run:

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

Currently supported template presets include:

|             JavaScript              |                TypeScript                 |
| :---------------------------------: | :---------------------------------------: |
| [vanilla](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/vanilla) | [vanilla-ts](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/vanilla-ts) |
|     [vue](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/vue)     |     [vue-ts](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/vue-ts)     |
|   [react](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/react)   |   [react-ts](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/react-ts)   |
|  [svelte](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/svelte)  |  [svelte-ts](https://github.com/alex8088/quick-start/tree/master/packages/create-electron/playground/svelte-ts)  |

See [create-electron](https://github.com/alex8088/quick-start/tree/master/packages/create-electron) for more details.

## Clone Template

create-electron is a tool to quickly start a project from a basic template for popular frameworks. Also you can use a tool like [degit](https://github.com/Rich-Harris/degit) to scaffold your project with the template [electron-vite-boilerplate](https://github.com/alex8088/electron-vite-boilerplate).

```bash
npx degit alex8088/electron-vite-boilerplate electron-app
cd electron-app

npm install
npm run dev
```

## Getting Help

If you suspect you're running into a bug with the `electron-vite`, please check the [GitHub issue tracker](https://github.com/alex8088/electron-vite/issues) to see if any existing issues match your problem. If not, feel free to fill the bug report template and submit a new issue.
