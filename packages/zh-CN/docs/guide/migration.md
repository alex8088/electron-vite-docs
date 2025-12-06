---
outline: deep
---

# 从 v4 迁移

## 总体变化

### 废弃 `externalizeDepsPlugin`

`externalizeDepsPlugin` 已被废弃。在 v5 中，你可以通过 `build.externalizeDeps` 来自定义相关行为。**该功能已默认启用**，因此不再需要手动引入此插件。

```js [electron.vite.config.ts]
import { defineConfig, externalizeDepsPlugin } from 'electron-vite' // [!code --]
import { defineConfig } from 'electron-vite' // [!code ++]

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()] // [!code --]
  },
  preload: {
    plugins: [externalizeDepsPlugin()] // [!code --]
  }
  // ...
})
```

- 相关: [依赖处理](./dependency-handling.md).

### 废弃 `bytecodePlugin`

`bytecodePlugin` 已被废弃。在 v5 中，你可以通过 `build.bytecode` 来启用或自定义此功能。

```js [electron.vite.config.ts]
import { defineConfig, bytecodePlugin } from 'electron-vite' // [!code --]
import { defineConfig } from 'electron-vite' // [!code ++]

export default defineConfig({
  main: {
    plugins: [bytecodePlugin()] // [!code --]
    build: { // [!code ++]
      bytecode: true // [!code ++]
    } // [!code ++]
  },
  preload: {
    plugins: [bytecodePlugin()] // [!code --]
    build: { // [!code ++]
      bytecode: true // [!code ++]
    } // [!code ++]
  },
  // ...
})
```

```js [electron.vite.config.ts]
import { defineConfig, bytecodePlugin } from 'electron-vite' // [!code --]
import { defineConfig } from 'electron-vite' // [!code ++]

export default defineConfig({
  main: {
    plugins: [bytecodePlugin({ protectedStrings: ['foo'] })] // [!code --]
    build: { // [!code ++]
      bytecode: { protectedStrings: ['foo'] } // [!code ++]
    } // [!code ++]
  },
  // ...
})
```

- 相关: [源代码保护](./source-code-protection.md).

## 配置变化

### 移除嵌套配置字段的函数解析

在 v5 中，**不再支持**在 `main`、`preload` 或 `renderer` 配置字段中使用函数式配置。你应当直接定义静态的配置对象。

```js
import { defineConfig, defineViteConfig } from 'electron-vite'

export default defineConfig({
  main: {
    // ...
  },
  preload: {
    // ...
  },
  renderer: defineViteConfig(({ command, mode }) => { ❌ // [!code error]
    // ...
  })
})
```

- 相关: [情景配置](../config/index.md#情景配置).
