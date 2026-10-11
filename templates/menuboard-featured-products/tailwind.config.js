import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import flowbite from 'flowbite-react/plugin/tailwindcss';

// flowbite-react's components (and helpers such as drag-scroll) carry their Tailwind classes in their own
// source, so Tailwind has to scan the package. Resolve it instead of assuming ./node_modules/flowbite-react:
// in the npm workspace it is hoisted to the repo root, and a path into this folder matches nothing.
const flowbiteReactDir = dirname(createRequire(import.meta.url).resolve('flowbite-react/package.json'));

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx}',
    join(flowbiteReactDir, 'dist/**/*.js'),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbite,
  ],
};
