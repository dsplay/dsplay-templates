/// <reference types="vitest/config" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { transformAsync } from '@babel/core';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import pkg from './package.json' with { type: 'json' };
import templateManifest from '@dsplay/template-manifest/vite-plugin';

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

// @vitejs/plugin-legacy bundles polyfills-legacy with a es2015 target, so it keeps arrow functions, which Chrome 44
// (default WebView of Android 6) cannot parse. This pass lowers that chunk to ES5 without touching the browserslist.
function es5Polyfills() {
  return {
    name: 'es5-legacy-polyfills',
    enforce: 'post',
    async generateBundle(_options, bundle) {
      const entries = Object.values(bundle).filter((c) => c.type === 'chunk' && /polyfills-legacy/.test(c.fileName));
      await Promise.all(entries.map(async (chunk) => {
        const out = await transformAsync(chunk.code, {
          babelrc: false,
          configFile: false,
          compact: true,
          comments: false,
          plugins: ['@babel/plugin-transform-arrow-functions'],
        });
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
    es5Polyfills(),
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
    port: 5182,
    open: false,
    host: true,
    strictPort: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setup-tests.js'],
  },
});
