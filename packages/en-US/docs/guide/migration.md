---
outline: deep
---

# Migration from v4

## General Changes

### Deprecation of `externalizeDepsPlugin`

The `externalizeDepsPlugin` is deprecated. In v5, you can use `build.externalizeDeps` to customize this behavior. **This feature is enabled by default**, so you no longer need to import the plugin.

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

- Related: [Dependency Handling](./dependency-handling.md).

### Deprecation of `bytecodePlugin`

The `bytecodePlugin` is deprecated. In v5, you can use `build.bytecode` to enable or customize this feature.

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

- Related: [Source Code Protection](./source-code-protection.md).

## Configuration Changes

### remove function resolution for nested config fields

In v5, **function-based configuration is no longer supported** for nested config fields such as `main`, `preload`, or `renderer`. Instead, you should directly define static configuration objects.

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

- Related: [Conditional Config](../config/index.md#conditional-config).
