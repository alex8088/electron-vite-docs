# API

electron-vite's JavaScript APIs are fully typed, and it's recommended to use TypeScript or enable JS type checking in VS Code to leverage the intellisense and validation.

## `build`

Type Signature:

```js
async function build(inlineConfig: InlineConfig = {}): Promise<void>
```

Example Usage:

```js
const path = require('path')
const { build } = require('electron-vite')

;(async () => {
  await build({
    build: {
      outDir: 'out'
      rollupOptions: {
        // ...
      }
    }
  })
})()
```

## `createServer`

Type Signature:

```js
async function createServer(inlineConfig: InlineConfig = {}): Promise<void>
```

Example Usage:

```js
const { createServer } = require('electron-vite')

;(async () => {
  await createServer({
    server: {
      port: 1337
    }
  })
})()
```

## `preview`

Type Signature:

```js
async function preview(inlineConfig: InlineConfig = {}): Promise<void>
```

Example Usage:

```js
const { preview } = require('electron-vite')

;(async () => {
  await preview({})
})()
```

## `InlineConfig`

The InlineConfig interface extends Vite [UserConfig](https://vitejs.dev/guide/api-javascript.html#inlineconfig) with additional properties:

- `ignoreConfigWarning`: set to `false` to ignore warning when config missing

And omit `base` property because it is not necessary to set the base public path in Electron.

## `resolveConfig`

Type Signature:

```js
async function resolveConfig(
  inlineConfig: InlineConfig,
  command: 'build' | 'serve',
  defaultMode = 'development'
): Promise<ResolvedConfig>
```
