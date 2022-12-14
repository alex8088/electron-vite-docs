# Features

Based on Vite, designed to work with Electron.

## Vite Powered

Inherit all the benefits of Vite and use the same way as Vite.

See [Vite features](https://vitejs.dev/guide/features.html).

## Fully Bundling

electron-vite can intelligently bundle source code for Electron's unique environment.

- **The main process and preload scripts:** whether in development or production, these will be bundled as CommonJS modules, and run in Node.js environment.

- **Renderers:** During development, electron-vite will convert CommonJS / UMD modules to ES modules to support HMR. During production, these will be bundled as IIFE modules, and run in browser environment.

## Centralized Configuration and Pre-configured

If you use Vite to bundle your Electron source code, the project structure might like this:

```
├──main
│  ├──...
│  └──vite.config.js
├──preload
│  ├──...
│  └──vite.config.js
└──renderer
   ├──...
   └──vite.config.js
```

In electron-vite, all Vite configurations are combined into one file. The project structure like this:

```
├──src/
│  ├──main
│  ├──preload
│  └──renderer
├──electron.vite.config.js
└──package.json
```

Furthermore, electron-vite has many built-in configurations, such as `outDir`, `target`, `entry`, `formats`, `external`, etc. Smart parsing and configuration checks are also performed.

## HMR For Renderers

Thanks to Vite's extremely fast HMR feature, we use it in renderer development. It will extremely improve Electron's development efficiency.

Check out the [Use HMR in Renderers](/guide/hmr-in-renderer) section to learn more about this feature.

## Hot Reloading

Hot reloading refers to quickly rebuilding and restarting the Electron app when the main process or preload scripts module changes. In fact, it's not really hot reloading, but similar. It also brings a good development experience to developers.

Check out the [Hot Reloading](/guide/hot-reloading) section to learn more about this feature.

## Static Assets

In addition to supporting the [static asset handling](https://vitejs.dev/guide/assets.html) in web app like Vite， electron-vite also optimizes the static asset handling in the Electron main process.

Check out the [Static Asset Handling](/guide/assets) section to learn more about this feature.

## Source Code Protection

electron-vite use V8 bytecode to protect source code.

Check out the [Source Code Protection](/guide/source-code-protection) section to learn more about this feature.

## TypeScript Decorator

electron-vite creates an optional `swcPlugin` which is powered by `swc` to replace Vite's esbuild plugin to support TypeScript decorator.

Check out the [TypeScript Decorator](/guide/typescript-decorator) section to learn more about this feature.

## Worker Threads

electron-vite provides Node.js worker threads support for the Electron main process.

Check out the [Workers](/guide/worker) section to learn more about this feature.

## Debugging

Very easy to debug in IDE like `vscode` or `webstorm`.

Check out the [Debugging in VSCode](/guide/debugging) section to learn more about this feature.
