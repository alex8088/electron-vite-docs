# Introduction

::: tip NOTE
This guide assumes that you are familiar with Electron and Vite. A good way to start learning more is to read the [Electron Guide](https://www.electronjs.org/docs/), and [Vite Guide](https://vitejs.dev/guide/).
:::

## The Problems

Thanks to Vite's excellent front-end development experience, more and more Electron projects have begun to use it to build and develop. Looking through various community resources, you can find many Electron development templates based on Vite, but there are some common problems:

- The configuration is relatively complex and cumbersome

- Auxiliary scripts are required to cooperate with compilation and development

- Can't make inferences, choose front-end frameworks (Vue, React, Svelte, etc.)

- Unable to protect source code

electron-vite aims to solve these problems and provide a faster and leaner development experience for Electron.

## Electron Features

To solve these problems, we need to understand Electron. Electron is a framework  based on Chromium and Node.js for building desktop applications, which means that the bundler needs to handle both Node.js and browser environments.

Vite has the ability to deal with these two environments at the same time. When electron-vite is running, it will directly bundle the main process source code and the preload scripts, but for the renderers, it will start a dev server to use Vite's HMR, which will extremely improves Electron's development efficiency.

<script setup>
import { withBase } from 'vitepress'
</script>

<p>
  <img :src="withBase('/ev-dev.svg')" class="ev-dev" alt="evd">
</p>

## Best Practices

Many developer and community templates will be developed by turning on node integration (`nodeIntegration`) and turning off context isolation (`contentIsolation`). Even though this can gain a little development efficiency, but it should not be recommended and is extremely unsafe. In Electron, it is not just a browser, it also provides many powerful native APIs, such as file system access, user shell and more. In fact, the most popular Electron apps (slack, visual studio code, etc.) do not do this.

Therefore, the design idea of electron-vite will also follow this, including the recommended project structure, built-in config, etc.
