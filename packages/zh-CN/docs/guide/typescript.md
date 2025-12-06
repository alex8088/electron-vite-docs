# TypeScript

## 类型定义

如果你是 TypeScript 用户，请确保添加一个 `*.d.ts` 声明文件以获得类型检查和智能感知：

```js
/// <reference types="electron-vite/node" />
```

同时，你也可以将 `electron-vite/node` 添加到 `tsconfig` 中的 `compilerOptions.types` 下：

```json [tsconfig.node.json ~vscode-icons:file-type-tsconfig~]
{
  "compilerOptions": {
    "types": ["electron-vite/node"]
  }
}
```

## 装饰器

Vite（基于 Rollup）不支持 TypeScript 的 `emitDecoratorMetadata` 特性。一些库（如 `typeorm`、`sequelize-typescript` 等）使用 `reflect-metadata` 模块作为 polyfill 来扩展对象元数据。在 Electron 开发中，这类库使用较为广泛，因此有必要支持装饰器元数据特性。

electron-vite 提供了可选的 `swcPlugin`，该插件基于 [swc](https://swc.rs/) 替代 Vite 的代码转换功能。

当你需要支持该特性时，可以像下面这样修改配置文件：

```js [electron.vite.config.ts]
import { defineConfig, swcPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [swcPlugin()]
  }
  // ...
})
```

::: tip 提示
在使用 `swcPlugin` 时，你需要安装 `@swc/core`，因为它是 `electron-vite` 的可选 peer 依赖。
:::
