# TypeScript

## Type Definitions

If you are a TypeScript user, make sure to add a `*.d.ts` declaration file to get type checks and intellisense:

```js
/// <reference types="electron-vite/node" />
```

Also, you can add `electron-vite/node` to `compilerOptions.types` of your `tsconfig`:

```json [tsconfig.node.json ~vscode-icons:file-type-tsconfig~]
{
  "compilerOptions": {
    "types": ["electron-vite/node"]
  }
}
```

## Decorators

Vite (Rollup) does not support the TypeScript feature `emitDecoratorMetadata`. Some packages (`typeorm`, `sequelize-typescript`, etc.) use the `reflect-metadata` module as a polyfill to extend object metadata. In Electron development, these libraries are commonly used, so it's necessary to support emitting type metadata for decorators.

electron-vite provides an optional `swcPlugin` which is powered by [swc](https://swc.rs/) to replace Vite's code transform.

When you need to support this feature, you can modify your config file like this:

```js [electron.vite.config.ts]
import { defineConfig, swcPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [swcPlugin()]
  },
  // ...
})
```

::: tip NOTE
When using `swcPlugin`, you need to install `@swc/core`, because it is an optional peer dependency in electron-vite.
:::
