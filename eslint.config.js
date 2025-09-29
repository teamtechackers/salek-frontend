import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      camelcase: ['error', { properties: 'always' }],
      'id-match': ['error', '^(?:[a-z][a-zA-Z0-9]*|[A-Z][a-zA-Z0-9]*|[A-Z][A-Z0-9_]+)$'],
      'new-cap': ['error', { newIsCap: true, capIsNew: false }],
      quotes: ['error', 'single'],
      'prefer-template': 'error',
      'no-useless-concat': 'error',
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'strict': 'off',
      'no-unneeded-ternary': 'error',
      'no-negated-condition': 'error',
      'require-jsdoc': 'off',
      'valid-jsdoc': 'off',
      'max-len': 'off',
    },
  },
    {
    ignores: ['node_modules/', 'dist/', 'build/', 'coverage/', '*.min.js'],
  },
  {
    files: ['src/core/utils/logger.js'],
    rules: {
      'no-console': 'off',
    }
  }
])
