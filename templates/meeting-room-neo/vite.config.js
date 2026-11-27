/// <reference types="vitest/config" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import pkg from './package.json' with { type: 'json' };
import templateManifest from '@dsplay/template-manifest/vite-plugin';
import { transformAsync } from '@babel/core';

// index.html loads `public/dsplay-data.js` as a plain <script src>, not an ES module import, so it
// never enters Vite's module graph — Vite's dev server only reloads/HMRs files it's tracking
// through that graph, so editing dsplay-data.js otherwise does nothing in the browser until a
// manual refresh. This watches that one file directly and forces a full reload on change.
function watchDsplayData() {
  let dataFile;
  return {
    name: 'watch-dsplay-data',
    configureServer(server) {
      dataFile = resolve(server.config.publicDir, 'dsplay-data.js');
      server.watcher.add(dataFile);
    },
    handleHotUpdate({ file, server }) {
      if (file === dataFile) {
        server.ws.send({ type: 'full-reload' });
        return [];
      }
    },
  };
}

// The legacy plugin builds `polyfills-legacy-*.js` in a separate pass (core-js plus rolldown's runtime helpers) and
// leaves arrow functions in it: Chrome 44, the default WebView of Android 6, cannot parse them and runs no script at
// all. The browserslist must keep `Chrome >= 45` (repo sanity test), so the chunk is lowered here to ES5 instead,
// after the legacy plugin has emitted it.
function es5PolyfillsChunk() {
  return {
    name: 'es5-polyfills-chunk',
    apply: 'build',
    generateBundle: {
      order: 'post',
      async handler(_options, bundle) {
        const names = Object.keys(bundle).filter((name) => /polyfills-legacy.*\.js$/.test(name));
        await Promise.all(names.map(async (name) => {
          const chunk = bundle[name];
          const out = await transformAsync(chunk.code, {
            babelrc: false,
            configFile: false,
            compact: true,
            sourceType: 'script',
            presets: [['@babel/preset-env', { targets: { chrome: '44' }, modules: false, bugfixes: false }]],
          });
          chunk.code = out.code;
        }));
      },
    },
  };
}

export default defineConfig({
  base: './',
  // Only needed inside the dsplay-templates monorepo, where the library is a workspace symlink that Vite
  // serves as-is instead of pre-bundling (its UMD build then fails on named imports). Harmless once copied
  // out, so you can delete this block in your own template.
  optimizeDeps: {
    include: ['@dsplay/react-template-utils'],
  },
  plugins: [
    watchDsplayData(),
    react(),
    legacy({
      targets: pkg.browserslist,
    }),
    templateManifest(),
    es5PolyfillsChunk(),
  ],
  css: {
    preprocessorOptions: {
      sass: {
        api: 'modern-compiler',
        silenceDeprecations: ['import'],
      },
    },
  },
  build: {
    outDir: 'build',
    // oxc's minifier ignores the legacy chunk's target and reintroduces ?./?? after Babel expands them; terser doesn't.
    minify: 'terser',
  },
  server: {
    port: 5181,
    open: false,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setup-tests.js'],
  },
});
