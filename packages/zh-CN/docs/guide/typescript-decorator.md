# TypeScript 装饰器

Vite 使用 `esbuild` 将 TypeScript 转换为 JavaScript。但是，esbuild 不支持 TypeScript 的 `emitDecoratorMetadata` 特性。一些库（`typeorm`、`sequelize-typescript` 等）使用 `reflect-metadata` 模块作为 polyfill 来扩展对象元数据。在 Electron 开发中，这些库被高度使用，因此有必要支持装饰器元数据特性。

从 electron-vite 1.0.12 开始，创建了一个可选的由 [swc](https://swc.rs/) 驱动 `swcPlugin` 插件来替代 Vite 的 esbuild 插件，并且它的性能也很出色。

当你需要支持这个特性时，你可以像下面一样修改你的配置文件：

```js
// electron.vite.config.ts
import { defineConfig, swcPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [swcPlugin()]
  },
  // ...
})
```

::: tip 提示
使用 swcPlugin 时，需要安装 `@swc/core`，因为在 electron-vite 中 @swc/core 默认为可选依赖。
:::
