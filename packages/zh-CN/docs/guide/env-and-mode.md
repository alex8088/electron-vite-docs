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

默认情况下，`development` 模式（`dev` 命令）仅适用于渲染器。这意味着来自 `.env.development` 的变量仅对渲染器可用。
