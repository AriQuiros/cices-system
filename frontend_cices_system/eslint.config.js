import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import cypress from 'eslint-plugin-cypress/flat'

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
      parserOptions: { ecmaVersion: 'latest', ecmaFeatures: { jsx: true }, sourceType: 'module' },
    },
    rules: { 'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }] },
  },
  // Bloque Cypress
  {
    files: ['cypress/**/*.cy.{js,jsx,ts,tsx}'],
    ...cypress.configs.recommended,
    rules: {
      'cypress/unsafe-to-chain-command': 'off',
      'cypress/no-unnecessary-waiting': 'error' // si quieres mantener esta
    }
  },
])
