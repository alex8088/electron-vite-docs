# Project Structure

::: tip NOTE
Through this section you can understand how electron-vite works intelligently.
:::

## Recommended Project Structure

A typical Electron application will have the following source structure:

```
├──src/
│  ├──main      # main process source code
│  ├──preload   # preload script
│  └──renderer  # renderer is developed using Vue, React, etc.
└──package.json
```

This is also recommended by Electron official. electron-vite also uses this project structure and works intelligently through [built-in configuration](/config/#built-in-config). The project structure like the following is highly recommended:

```{4,7,11}
.
├──src
│  ├──main
│  │  ├──index.ts
│  │  └──...
│  ├──preload
│  │  ├──index.ts
│  │  └──...
│  └──renderer
│     ├──src   # with vanilla/vue/react/...
│     ├──index.html
│     └──...
├──electron.vite.config.ts
├──package.json
└──...
```

When running electron-vite, it will automatically find the entry file of the main process, renderer and preload scripts. The default entry points：

- **Main process:** `<root>/src/main/{index|main}.{js|ts|mjs|cjs}`

- **Preload scripts:** `<root>/src/preload/{index|preload}.{js|ts|mjs|cjs}`

- **Renderer:** `<root>/src/renderer/index.html`

It will throw an error if the entry points are not found. You can fix it by setting the `build.lib.entry` option.

See the example in [the next](#customizing-project-structure) section.

## Customizing Project Structure

Even though we strongly recommend the project structure above, it is not a requirement. You can configure it to meet your scenes.

Suppose you have the following project structure:

```{4,7,10}
.
├──electron
│  ├──main
│  │  ├──index.ts
│  │  └──...
│  └──preload
│     ├──index.ts
│     └──...
├──src # with vanilla/vue/react/...
├──index.html
├──electron.vite.config.ts
├──package.json
└──...
```

Your `electron.vite.config.js` should be:

```js
import { defineConfig } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/main/index.ts')
        }
      }
    }
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/preload/index.ts')
        }
      }
    }
  },
  renderer: {
    root: '.',
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html')
        }
      }
    }
  }
})
```
