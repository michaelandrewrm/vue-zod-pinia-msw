import { globalIgnores } from 'eslint/config';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import globals from 'globals';
import jsEslint from '@eslint/js';
import vueEslintParser from 'vue-eslint-parser';
import eslintPluginVue from 'eslint-plugin-vue';
import eslintParserTypeScript from '@typescript-eslint/parser';
import pluginVitest from '@vitest/eslint-plugin';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'Included Files',
    files: ['**/*.{js,ts,jsx,tsx,vue}'],
  },

  globalIgnores([
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.next/**',
    '**/out/**',
    '**/coverage/**',
    '**/.git/**',
    '**/.cache/**',
    '**/tmp/**',
    '**/*.min.js',
    '**/*.mjs',
  ]),

  {
    // Define environment globals to avoid undefined errors.
    languageOptions: {
      globals: {
        ...globals.browser, // Browser global variables like `window`, `document`.
        ...globals.node, // Node.js global variables and Node.js scoping.
        ...globals.es2021, // Enable ES2021 globals and features.
        ...globals.vitest,
      },
    },
  },

  jsEslint.configs.recommended,
  eslintPluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,

  {
    name: 'Vue Files Config',
    files: ['**/*.vue'],
    languageOptions: {
      // Required for parsing `<template>` and `<script>` blocks in Vue SFCs
      parser: vueEslintParser,
      parserOptions: {
        parser: eslintParserTypeScript, // Let `<script lang="ts">` be parsed correctly
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'], // Ensure ESLint understands .vue as a valid extension
      },
    },
    plugins: {
      vue: eslintPluginVue,
    },
    rules: {
      'vue/attribute-hyphenation': 'off',
    },
  },

  {
    ...pluginVitest.configs.recommended,
    name: 'Test Files',
    files: ['**/*.spec.{ts,js}', '**/*.test.{ts,js}'],
  },

  skipFormatting
);
