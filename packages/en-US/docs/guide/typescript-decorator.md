# TypeScript Decorator

Vite uses `esbuild` to transpile TypeScript into JavaScript. However, esbuild does not support the TypeScript feature `emitDecoratorMetadata`. Some packages(`typeorm`, `sequelize-typescript`, etc.) use the `reflect-metadata` module as a polyfill to extend object metadata. In Electron development, these libraries are highly used, so it's necessary to support for emitting type metadata for decorators.

Since electron-vite 1.0.12, has created an optional `swcPlugin` which is powered by [swc](https://swc.rs/) to replace Vite's esbuild plugin, and its performance is also excellent.

When you need to support this feature, you can modify your config file like this:

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

::: tip NOTE
When using swcPlugin, you need to install `@swc/core`, because @swc/core is an optional dependency by default in electron-vite.
:::
