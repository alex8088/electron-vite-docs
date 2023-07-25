# 分发

## ASAR 存档局限性

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
  - out/main/chunks/*.node
  - resources/*
```

了解有关 [ASAR 存档](https://www.electronjs.org/docs/latest/tutorial/asar-archives) 的更多信息。

::: tip 提示
建议将这些资源放在 public 目录中，这样可以更容易配置排除项，不将它们打包到 asar 存档中。
:::

## 使用 Electron Builder 分发应用程序

`electron-builder` 是一个用于打包适用于 macOS、Windows 和 Linux 可分发 Electron 应用程序的完整解决方案。

1. 你可以为 electron-builder 创建一个配置文件 `electron-builder.yml`，内容如下：

```yaml
appId: com.electron.app
productName: vue-ts
directories:
  buildResources: build
files:
  - '!**/.vscode/*'
  - '!src/*'
  - '!electron.vite.config.{js,ts,mjs,cjs}'
  - '!{.eslintignore,.eslintrc.cjs,.prettierignore,.prettierrc.yaml,dev-app-update.yml,CHANGELOG.md,README.md}'
  - '!{.env,.env.*,.npmrc,pnpm-lock.yaml}'
  - '!{tsconfig.json,tsconfig.node.json,tsconfig.web.json}'
asarUnpack:
  - resources/**
afterSign: build/notarize.js
win:
  executableName: vue-ts
nsis:
  artifactName: ${name}-${version}-setup.${ext}
  shortcutName: ${productName}
  uninstallDisplayName: ${productName}
  createDesktopShortcut: always
mac:
  entitlementsInherit: build/entitlements.mac.plist
  extendInfo:
    - NSCameraUsageDescription: Application requests access to the device's camera.
    - NSMicrophoneUsageDescription: Application requests access to the device's microphone.
    - NSDocumentsFolderUsageDescription: Application requests access to the user's Documents folder.
    - NSDownloadsFolderUsageDescription: Application requests access to the user's Downloads folder.
dmg:
  artifactName: ${name}-${version}.${ext}
linux:
  target:
    - AppImage
    - snap
    - deb
  maintainer: electronjs.org
  category: Utility
appImage:
  artifactName: ${name}-${version}.${ext}
npmRebuild: false
publish:
  provider: generic
  url: https://example.com/auto-updates
```

2. 将执行脚本添加到 `package.json`：

```json
"scripts": {
  "build:win": "npm run build && electron-builder --win --config",
  "build:mac": "npm run build && electron-builder --mac --config",
  "build:linux": "npm run build && electron-builder --linux --config"
}
```


## 使用 Electron Forge 分发应用程序

Electron Forge 是一个用于打包和发布 Electron 应用程序的工具。

1. 你可以为 Electron Forge 创建一个配置文件 `forge.config.cjs`，内容如下：

```js
module.exports = {
  packagerConfig: {
    ignore: [
      /^\/src/,
      /(.eslintrc.json)|(.gitignore)|(electron.vite.config.ts)|(forge.config.cjs)|(tsconfig.*)/,
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
```

2. 将执行脚本和依赖添加到 `package.json`：

```json
"main": "./dist/main/index.js",
"scripts": {
  "start": "electron-vite preview --outDir=dist",
  "dev": "electron-vite dev --outDir=dist",
  "package": "electron-vite build --outDir=dist && electron-forge package",
  "make ": "electron-vite build --outDir=dist && electron-forge make"
},
"devDependencies": {
  "@electron-forge/cli": "^6.2.1",
  "@electron-forge/maker-deb": "^6.2.1",
  "@electron-forge/maker-rpm": "^6.2.1",
  "@electron-forge/maker-squirrel": "^6.2.1",
  "@electron-forge/maker-zip": "^6.2.1",
}
```

::: warning 警告
Electron Forge 的默认输出目录为 `out`，且禁止改写，这与 electron-vite 冲突。所以我们可以将 `outDir` 设置为 `dist`。
:::

## Github Action CI/CD

你可以使用以下内容在项目的根目录中创建工作流文件 `.github/workflows/release.yml`。该工作流将帮助你在 Windows、MacOS 和 Linux 中构建和打包 Electron 应用程序。

```yaml
name: Build/release Electron app

on:
  push:
    tags:
      - v*.*.*

jobs:
  release:
    runs-on: ${{ matrix.os }}

    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]

    steps:
      - name: Check out Git repository
        uses: actions/checkout@v3

      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16

      - name: Install Dependencies
        run: npm install

      - name: build-linux
        if: matrix.os == 'ubuntu-latest'
        run: npm run build:linux

      - name: build-mac
        if: matrix.os == 'macos-latest'
        run: npm run build:mac

      - name: build-win
        if: matrix.os == 'windows-latest'
        run: npm run build:win

      - name: release
        uses: softprops/action-gh-release@v1
        with:
          draft: true
          files: |
            dist/*.exe
            dist/*.zip
            dist/*.dmg
            dist/*.AppImage
            dist/*.snap
            dist/*.deb
            dist/*.rpm
            dist/*.tar.gz
            dist/*.yml
            dist/*.blockmap
        env:
          GITHUB_TOKEN: ${{ secrets.ACCESS_TOKEN }}
```
