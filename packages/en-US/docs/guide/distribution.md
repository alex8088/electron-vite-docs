# Distribution

## Limitations of ASAR Archives

The Electron app's source code are usually bundled into an ASAR archive, which is a simple extensive archive format designed for Electron apps.

But the ASAR Archive has limitations:

- Some Node APIs require extra unpacking into a temporary file and pass the path of the temporary file to the APIs to make them work. This adds a little overhead for those APIs. Such as `child_process.execFile`, `fs.open`, `process.dlopen`, etc.
- There are some Node APIs that do not support executing binaries in ASAR archives, such as `child_process.exec`, `child_process.spawn`.

As stated above, it is best practice not to pack these assets into ASAR archives.

There are those binaries that should not be packed:

- Some native node modules like `sqlite`, `fluent-ffmpeg`, etc.
- Referenced binaries like `*.node`, `*.app`, `*.exe`, etc.

For example, in `electron-builder` you can configure like this:

```yaml
asarUnpack:
  - node_modules/sqlite3
  - out/main/chunks/*.node
  - resources/**
```

Learn more about [ASAR Archives](https://www.electronjs.org/docs/latest/tutorial/asar-archives).

::: tip NOTE
It is recommended to put these assets in the public directory, which makes it easier to configure exclusions without packing them into the asar archive.
:::

## Distributing Apps With Electron Builder

`electron-builder` is a complete solution for packaging distributable Electron applications for macOS, Windows and Linux.

1. You can create a configuration file `electron-builder.yml` for electron-builder with the content below.

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

2. Add the scripts key to the `package.json`:

```json
"scripts": {
  "build:win": "npm run build && electron-builder --win --config",
  "build:mac": "npm run build && electron-builder --mac --config",
  "build:linux": "npm run build && electron-builder --linux --config"
}
```

## Github Action CI/CD

You can create a workflow file `.github/workflow/release.yml` in the root of your project with the content below. The workflow will help you build and package Electron app in Windows, MacOS and Linux.

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
