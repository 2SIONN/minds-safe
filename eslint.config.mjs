import { dirname } from 'path'
import { fileURLToPath } from 'url'
import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import { defineConfig } from 'eslint/config'
import prettierOff from 'eslint-config-prettier/flat'
import importPlugin from 'eslint-plugin-import'
import reactHooks from 'eslint-plugin-react-hooks'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig([
  nextPlugin.configs['core-web-vitals'],
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      '.vite/**',
      '.turbo/**',
      'coverage/**',
      'next-env.d.ts',
    ],
  },
  {
    settings: {
      'import/resolver': {
        typescript: { project: ['./tsconfig.json'], alwaysTryTypes: true },
      },
    },
  },
  {
    files: ['**/*.{js,jsx}', 'src/**/*.{js,jsx}'],
    plugins: {
      import: importPlugin,
      'react-hooks': reactHooks,
      'unused-imports': unusedImports,
    },
    extends: [js.configs.recommended, prettierOff],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'warn',
      'object-shorthand': ['warn', 'always'],
      'prefer-template': 'warn',
      eqeqeq: ['error', 'smart'],
      curly: ['error', 'all'],
      'no-debugger': 'error',
      'no-console': ['off', { allow: ['warn', 'error'] }],
      'no-unreachable-loop': 'error',
      'no-constructor-return': 'error',
      'no-constant-binary-expression': 'error',
      'default-param-last': 'warn',
      'arrow-body-style': ['warn', 'as-needed'],
      'no-useless-return': 'warn',
      yoda: ['error', 'never'],
      'import/no-duplicates': 'error',
      'import/newline-after-import': ['warn', { count: 1 }],
      'import/order': [
        'warn',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
        },
      ],
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['off', { args: 'after-used', ignoreRestSiblings: true }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    files: ['**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      import: importPlugin,
      'react-hooks': reactHooks,
      'unused-imports': unusedImports,
    },
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      prettierOff,
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-base-to-string': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-for-of': 'off',
      'unused-imports/no-unused-imports': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': ['warn', { count: 1 }],
      'import/order': [
        'warn',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
        },
      ],
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/await-thenable': 'warn',
      '@typescript-eslint/no-misused-promises': [
        'warn',
        { checksVoidReturn: { attributes: false } },
      ],

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    files: [
      'eslint.config.*',
      'prettier.config.*',
      'next.config.*',
      'vite.config.*',
      'scripts/**/*.{js,jsx,ts,tsx}',
    ],
    languageOptions: {
      sourceType: 'module',
      globals: globals.node,
    },
  },
  {
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
])
