const js = require('@eslint/js');
const globals = require('globals');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const jsxA11y = require('eslint-plugin-jsx-a11y');
const importX = require('eslint-plugin-import-x');
const babelParser = require('@babel/eslint-parser');

const { createNodeResolver } = importX;

module.exports = [
  {
    ignores: ['dist/**', 'build/**', 'node_modules/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      'import-x': importX,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react', '@babel/preset-env'],
        },
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    settings: {
      react: { version: 'detect' },
      'import-x/extensions': ['.js', '.jsx'],
      'import-x/resolver-next': [
        createNodeResolver({ extensions: ['.mjs', '.cjs', '.js', '.jsx', '.json', '.node'] }),
      ],
    },
    rules: {
      ...react.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...importX.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'no-console': ['error', { allow: ['time', 'timeEnd'] }],
      'import-x/prefer-default-export': 'warn',
      'no-unused-vars': ['error', { args: 'none' }],
      'react/jsx-props-no-spreading': ['error', { html: 'ignore', exceptions: ['MyCustomComponent', 'img'] }],
      'react/prop-types': 'off',
    },
  },
];
