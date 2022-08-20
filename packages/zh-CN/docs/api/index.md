# API

electron-vite 的 JavaScript API 是完全类型化的，推荐使用 TypeScript 或者在 VS Code 中启用 JS 类型检查来利用智能提示和类型校验。

## `build`

类型：

```js
async function build(inlineConfig: InlineConfig = {}): Promise<void>
```

示例：

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

类型：

```js
async function createServer(inlineConfig: InlineConfig = {}): Promise<void>
```

示例：

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

类型：

```js
async function preview(inlineConfig: InlineConfig = {}): Promise<void>
```

示例：

```js
const { preview } = require('electron-vite')

;(async () => {
  await preview({})
})()
```

## `InlineConfig`

InlineConfig 接口扩展了 Vite [UserConfig](https://cn.vitejs.dev/guide/api-javascript.html#inlineconfig) 并添加了以下属性：

- `ignoreConfigWarning`：设置为 `false` 来忽略配置缺失警告

同时移除 `base` 属性，因为在 Electron 中没有必要指定公共基础路径。


## `resolveConfig`

类型：

```js
async function resolveConfig(
  inlineConfig: InlineConfig,
  command: 'build' | 'serve',
  defaultMode = 'development'
): Promise<ResolvedConfig>
```
