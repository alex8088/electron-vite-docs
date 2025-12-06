---
outline: deep
---

# Source Code Protection

## Overview

Electron applications use JavaScript to build desktop software, making them vulnerable to **reverse engineering**, **code tampering**, and **unauthorized redistribution**.

This document presents an effective protection approach: **V8 bytecode** combined with **ASAR integrity** verification provides robust protection for Electron applications in production environments.

::: warning NOTE
No client-side protection is absolute. This approach significantly raises the barrier for attackers but should be combined with architectural security measures and server-side validation for comprehensive protection.
:::

## Solution: V8 Bytecode + ASAR Integrity

### ASAR Integrity

[ASAR integrity](https://www.electronjs.org/docs/latest/tutorial/asar-integrity) is a security feature that validates the contents of your app's ASAR archives at runtime against a build-time hash to detect any tampering. If no hash is present or if there is a mismatch in the hashes, the app will forcefully terminate.

**Protection characteristics**:

- Detects and prevents file tampering
- Blocks unauthorized repackaging

See [the ASAR integrity documentation](https://www.electronjs.org/docs/latest/tutorial/asar-integrity) for full information on how the feature works and how to use it in your application.

::: tip NOTE
Requires **Electron** version 16+ on MacOS and 30+ on Windows.
:::

For example, enable ASAR integrity checking with `electron-builder` :

```yaml [electron-builder.yaml]
build:
  appId: your.id
  # ... other configurations
  electronFuses:
    # Enable ASAR integrity validation
    EnableEmbeddedAsarIntegrityValidation: true
    # (Optional, but recommended) Ensure Electron only loads app code from app.asar
    OnlyLoadAppFromAsar: true
```

### V8 Bytecode

The `vm` module in Node.js standard library generates V8 bytecode cache from JavaScript source. Originally designed for performance optimization, the cached bytecode can be distributed and interpreted at runtime, effectively obscuring the original source code.

**Protection characteristics**:

- High reverse engineering difficulty
- Maintains native performance
- No external dependencies required
- Compatible with Electron runtime

**Limitations**:

- **Async arrow functions** - May cause runtime crashes
- **String literals** - Sensitive strings (encryption keys, tokens, credentials) remain readable in bytecode

electron-vite provides built-in solutions for these limitations.

## Implementation with electron-vite

electron-vite inspired by [bytenode](https://github.com/bytenode/bytenode). The implementation includes:

- **Bytecode Compilation Plugin** - Parses bundles and determines which chunks to compile to bytecode caches

- **Electron-based compilation** - Launches Electron process to compile bundles into `.jsc` files, ensuring bytecode compatibility with Electron's Node environment

- **Bytecode loader** - Generates a runtime loader enabling Electron applications to load bytecode caches

**Enhanced protection:**

- Resolves async arrow function compatibility issues
- Obfuscates string literals to protect sensitive data

::: warning Warning
The `Function.prototype.toString` is not supported, because the source code does not follow the bytecode distribution, so the source code for the function is not available.
:::

## Enabling Bytecode

Use the `build.bytecode` option to enable the Bytecode feature:

```js [electron.vite.config.ts]
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    build: {
      bytecode: true
    }
  },
  preload: {
    build: {
      bytecode: true
    }
  },
  renderer: {
    // ...
  }
})
```

::: warning NOTE
Before `electron-vite 5`, you had to use `bytecodePlugin` to enable it.
:::

::: tip NOTE
`Bytecode` only works in production and supports only the main process and preload scripts.

Note that preload scripts must disable the `sandbox` to support bytecode, as it relies on Node.js’s `vm` module. Since Electron 20, renderers are sandboxed by default, so you need to set `sandbox: false` when using bytecode for preload scripts.
:::

##  Options

The `build.bytecode` option also accepts a `BytecodeOptions` object for customizing protection.

### bytecode.chunkAlias

- Type: `string | string[]`

Set chunk aliases to specify which bundles the bytecode compiler should process. This is typically used with the `build.rollupOptions.output.manualChunks` option.

For example, only protect `src/main/foo.ts`:

```txt {5}
.
├──src
│  ├──main
│  │  ├──index.ts
│  │  ├──foo.ts
│  │  └──...
└──...
```

You can modify your config file like this:

```js [electron.vite.config.ts] {16}
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id): string | void {
            if (id.includes('foo')) {
              return 'foo'
            }
          }
        }
      },
      build: {
        bytecode: { chunkAlias: 'foo' }
      }
    }
  },
  // ...
})
```

### bytecode.transformArrowFunctions

- Type: `boolean`
- default: `true`

Set `false` to disable transforming arrow functions to normal functions.

::: tip NOTE
Arrow function transformation is implemented with [Babel](https://babeljs.io/docs/babel-plugin-transform-arrow-functions). Disabling this option may lead to runtime crashes.
:::

### bytecode.removeBundleJS

- Type: `boolean`
- default: `true`

Set `false` to keep bundle files which compiled as bytecode files.

### bytecode.protectedStrings

- Type: `string[]`

Specify which strings (e.g., `encryption keys`, `tokens`, `credentials`) in the source code need to be protected.

::: tip NOTE
electron-vite identifies specified strings and transforms them into IIFE functions using [String.fromCharCode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode). Once compiled to bytecode, these strings become obfuscated and unreadable. Supports both `String Literals` and `Template Literals (pure static only)`.

```js
// string in source code
const encryptKey = 'ABC'

// electron-vite transforms string into an IIFE function
const encryptKey = (function(){})([65, 66, 67])
```
:::

::: details What are pure static template literals
```js
// ✅
const foo = `-----BEGIN CERTIFICATE-----
MIIDkTCCAnmgAw...
`
// ❌
const zoo = `ABC ${x}`
```
:::

For example:

```js [electron.vite.config.ts] {13}
import { defineConfig } from 'electron-vite'

const protectedStrings = [
  'foo',
  `-----BEGIN CERTIFICATE-----
MIIDkTCCAnmgAwIBAgIUQt726ICGVvNVXHfzwCSwCR4
BQAwcDELMAkGA1UEBhMCQ04xDzANBgNVBAgMBll1bm5.......`
]

export default defineConfig({
  main: {
    build: {
      bytecode: { protectedStrings }
    }
  },
  // ...
})
```

::: warning Warning
You should not enumerate all strings in source code for protection, usually we only need to protect sensitive strings.
:::

## Limitations of Build

::: tip NOTE
Don’t expect that you can build app for all platforms on one platform.
:::

Our Electron application is distributed with precompiled `bytecode caches`. While V8 bytecode itself is `architecture-agnostic`, these caches are bound to specific `V8 (Node.js) versions` and `CPU architectures (such as x64 or ARM64)` due to optimization metadata (e.g., Inline Caches, Feedback Vectors, and Endianness). **This prevents them from being reused across Electron builds targeting different architectures**.

Furthermore, although bytecode caches for the same architecture on different operating systems (such as Windows x64 and macOS x64) may appear theoretically compatible, additional validation mechanisms within V8 often make **cross-platform distribution unreliable and therefore not recommended in practice**.

In some cases, it is possible to generate bytecode caches for a different architecture on the same platform, provided that the Electron build for the target architecture can execute under the current system. For instance, since x64 Electron binaries can run on ARM64 macOS devices, bytecode caches targeting x64 can be generated from within an ARM64 environment.

To achieve this, you can specify another configuration file and set the `ELECTRON_EXEC_PATH` environment variable to the path of the x64 Electron app executable. The bytecode compiler will compile using the specified Electron app.

```js [electron.vite.config.x64.ts] {5}
import { defineConfig } from 'electron-vite'

export default defineConfig(() => {
  process.env.ELECTRON_EXEC_PATH = '/path/to/electron-x64/Electron.app/Contents/MacOS/Electron'

  return {
    // ...
  }
})
```
::: details How to install Electron for other architectures
You can use the `--arch` flag with npm install to install Electron for other architectures.

```sh
npm install --arch=ia32 electron
```
:::

However, the above approach only allows building Electron applications for one architecture at a time. If you need to produce builds for multiple architectures within a single build process, you can leverage build tool hooks — such as `beforeBuild` in `electron-builder` — to modify the `ELECTRON_EXEC_PATH` dynamically and invoke the `electron-vite build` command for each target architecture.

```js [beforeBuild.js]
const { execSync } = require('child_process')
const os = require('os')

module.exports = {
  async beforeBuild(context) {
    const targetArch = context.arch  // Target architecture
    const hostArch = os.arch()       // Current machine architecture

    // Only modify ELECTRON_EXEC_PATH if target architecture differs from host
    if (targetArch !== hostArch) {
      process.env.ELECTRON_EXEC_PATH = `/path/to/electron-${targetArch}/Electron.app/Contents/MacOS/Electron`
    }

    // Execute the electron-vite build via npm
    execSync('npm run electron-vite build', { stdio: 'inherit' })
  }
}
```
