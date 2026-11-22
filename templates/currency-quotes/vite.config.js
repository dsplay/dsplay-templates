/// <reference types="vitest/config" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import pkg from './package.json' with { type: 'json' };
import templateManifest from '@dsplay/template-manifest/vite-plugin';
import { CMS_TYPE, DEFAULT_STYLE, findStyle } from './src/styles.js';

// The style is picked at build time: `@style` points at src/styles/<id>, so only that style's code, fonts and images are bundled.
const styleId = process.env.TEMPLATE_STYLE || DEFAULT_STYLE;
const style = findStyle(styleId);
if (!style) throw new Error(`Unknown TEMPLATE_STYLE "${styleId}"`);

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

// The page title names the type and the style, so a preview tab says which one it is.
function pageTitle() {
  return {
    name: 'page-title',
    transformIndexHtml: (html) => html.replace('%TEMPLATE_TITLE%', `DSPLAY - ${CMS_TYPE} - ${style.name}`),
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
  resolve: {
    alias: {
      '@style': resolve(import.meta.dirname, 'src/styles', styleId),
    },
  },
  plugins: [
    watchDsplayData(),
    pageTitle(),
    react(),
    legacy({
      targets: pkg.browserslist,
    }),
    templateManifest(),
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
    // a flag is its own file, fetched only when a screen shows it (inlined, the 154 of them would weigh down the script)
    assetsInlineLimit: 0,
    // oxc's minifier ignores the legacy chunk's target and reintroduces ?./?? after Babel expands them; terser doesn't.
    minify: 'terser',
  },
  server: {
    port: Number(process.env.PORT) || 3000,
    open: false,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setup-tests.js'],
  },
});
