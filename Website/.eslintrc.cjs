/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "@vue/eslint-config-typescript/recommended",
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-empty": ["warn", { allowEmptyCatch: true }],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { caughtErrorsIgnorePattern: "^_+$", argsIgnorePattern: "^_+$", varsIgnorePattern: "^_+$" },
    ],
  },
};
