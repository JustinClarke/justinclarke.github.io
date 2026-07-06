import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['dist/**', 'graphify-out/**', 'node_modules/**', '_docs/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    rules: {
      // Deliberate silent-catch idiom (e.g. best-effort sessionStorage writes) used
      // throughout the codebase; not a bug.
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2022 },
    },
    rules: {
      ...reactHooks.configs.flat.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/immutability': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
    },
  },
  {
    files: ['scripts/**/*.{js,mjs}'],
    languageOptions: {
      // Node scripts, but capture-screenshots.js also passes browser-context
      // callbacks to Playwright's page.evaluate(), hence both global sets.
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    files: ['worker/**/*.js'],
    languageOptions: {
      globals: { ...globals.worker },
    },
  },
);
