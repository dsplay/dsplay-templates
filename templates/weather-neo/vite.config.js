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

// @vitejs/plugin-legacy builds `polyfills-legacy` with a separate rolldown build and emits it AFTER every renderChunk,
// so Babel never touches it: rolldown's own CommonJS helpers (and core-js wrappers) stay as arrow functions, which the
// Chrome 44 WebView (the Android 6 default) cannot parse. Chrome 45 is the `browserslist` floor (the monorepo's sanity
// test requires it, so it is NOT changed); this plugin only down-levels that one chunk to what Chrome 44 reads.
function legacyPolyfillsToChrome44() {
  return {
    name: 'legacy-polyfills-chrome-44',
    apply: 'build',
    enforce: 'post',
    async generateBundle(options, bundle) {
      const chunks = Object.values(bundle).filter((c) => c.type === 'chunk' && /polyfills-legacy/.test(c.fileName));
      await Promise.all(chunks.map(async (chunk) => {
        const out = await transformAsync(chunk.code, {
          configFile: false,
          babelrc: false,
          sourceType: 'script',
          compact: true,
          presets: [['@babel/preset-env', { targets: { chrome: '44' }, modules: false, useBuiltIns: false }]],
        });
        // eslint-disable-next-line no-param-reassign
        chunk.code = out.code;
      }));
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
    legacyPolyfillsToChrome44(),
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
    port: 5185,
    open: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setup-tests.js'],
  },
});
