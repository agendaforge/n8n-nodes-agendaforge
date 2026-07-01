/**
 * ESLint config for the AgendaForge n8n community node.
 * Uses eslint-plugin-n8n-nodes-base to enforce n8n's node + verification
 * conventions. Run `npm run lint` (or `n8n-node lint`) before submitting.
 *
 * parserOptions.project is set only on the TS-file overrides so the package.json
 * override (which lints JSON, not TS) doesn't trip the typescript-eslint parser.
 */
module.exports = {
  root: true,
  env: { browser: true, es6: true, node: true },
  ignorePatterns: ['.eslintrc.js', '**/*.js', '**/node_modules/**', '**/dist/**'],
  overrides: [
    {
      files: ['package.json'],
      parser: 'jsonc-eslint-parser',
      plugins: ['eslint-plugin-n8n-nodes-base'],
      extends: ['plugin:n8n-nodes-base/community'],
      rules: {
        'n8n-nodes-base/community-package-json-name-still-default': 'off',
      },
    },
    {
      files: ['./credentials/**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: { project: ['./tsconfig.json'], sourceType: 'module' },
      plugins: ['eslint-plugin-n8n-nodes-base'],
      extends: ['plugin:n8n-nodes-base/credentials'],
      rules: {
        // Main-repo-only rule (wants a camelCase slug); community credentials
        // use a real HTTP documentationUrl, enforced by `...-not-http-url`.
        'n8n-nodes-base/cred-class-field-documentation-url-miscased': 'off',
      },
    },
    {
      files: ['./nodes/**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: { project: ['./tsconfig.json'], sourceType: 'module' },
      plugins: ['eslint-plugin-n8n-nodes-base'],
      extends: ['plugin:n8n-nodes-base/nodes'],
    },
  ],
};
