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
  ignorePatterns: [
    ".eslintrc.js",
    "**/*.js",
    "**/node_modules/**",
    "**/dist/**",
  ],
  overrides: [
    {
      files: ["package.json"],
      parser: "jsonc-eslint-parser",
      plugins: ["eslint-plugin-n8n-nodes-base"],
      extends: ["plugin:n8n-nodes-base/community"],
      rules: {
        "n8n-nodes-base/community-package-json-name-still-default": "off",
      },
    },
    {
      files: ["./credentials/**/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: { project: ["./tsconfig.json"], sourceType: "module" },
      plugins: ["eslint-plugin-n8n-nodes-base"],
      extends: ["plugin:n8n-nodes-base/credentials"],
      rules: {
        // Main-repo-only rule (wants a camelCase slug); community credentials
        // use a real HTTP documentationUrl, enforced by `...-not-http-url`.
        "n8n-nodes-base/cred-class-field-documentation-url-miscased": "off",
      },
    },
    {
      files: ["./nodes/**/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: { project: ["./tsconfig.json"], sourceType: "module" },
      plugins: ["eslint-plugin-n8n-nodes-base"],
      extends: ["plugin:n8n-nodes-base/nodes"],
      rules: {
        // These two want the legacy `inputs: ['main']` / `outputs: ['main']`
        // string literals. @n8n/scan-community-package — the gate for verified
        // community nodes — enforces the opposite via its
        // `@n8n/community-nodes/node-connection-type-literal` rule, which
        // requires NodeConnectionTypes.Main. The scanner wins; these are the
        // stale side of a conflict eslint-plugin-n8n-nodes-base@1.16.7 (latest)
        // has not caught up with.
        "n8n-nodes-base/node-class-description-inputs-wrong-regular-node":
          "off",
        "n8n-nodes-base/node-class-description-outputs-wrong": "off",
      },
    },
  ],
};
