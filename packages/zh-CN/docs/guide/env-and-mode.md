# 环境变量和模式

::: tip 提示
建议先阅读 [Vite 的环境变量和模式](https://cn.vitejs.dev/guide/env-and-mode.html) 文档，然后再阅读以下部分。
:::

## 全局环境变量

electron-vite 会像 V​​ite 一样从项目根目录加载环境变量，并使用不同的前缀来限制可用范围。

默认情况下，以 `MAIN_VITE_` 为前缀的变量暴露给主进程，`PRELOAD_VITE_` 用于预加载脚本，`RENDERER_VITE_` 则用于渲染器。

```
// .env
SOME_KEY=123                # 无效变量
MAIN_VITE_SOME_KEY=123      # 主进程可用
PRELOAD_VITE_SOME_KEY=123   # 预加载脚本可用
RENDERER_VITE_SOME_KEY=123  # 渲染器可用
```

如果你想自定义 env 变量的前缀，可以使用 `envPrefix` 选项。

```js
// electron.vite.config.js
export default defineConfig({
  main: {
    envPrefix: 'M_VITE_'
  }
  // ...
})
```

## 模式

默认情况下，`dev` 命令运行在 `development` (开发) 模式，而 `build` 和 `preview` 命令则运行在 `production` (生产) 模式。

你可以通过传递 `--mode` 选项标志来覆盖命令使用的默认模式。请参阅[ Vite 模式](https://cn.vitejs.dev/guide/env-and-mode.html#modes)
