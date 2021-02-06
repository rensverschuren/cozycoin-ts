module.exports = {
    env: {
      node: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
      tsconfigRootDir: __dirname,
      project: ["./tsconfig.json"],
      ecmaVersion: 2020,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
    plugins: ["@typescript-eslint"],
    extends: [
      "eslint:recommended",
      "plugin:eslint-comments/recommended",
      "plugin:import/recommended",
      "plugin:import/typescript",
    ],
    rules: {
      strict: ["error", "never"],
      "babel/camelcase": [0, { properties: "always" }],
      "import/named": "off",
      "import/namespace": "off",
      "import/default": "off",
      "import/no-named-as-default-member": "off",
      indent: "off",
      "@typescript-eslint/indent": "off",
      "max-params": "warn",
      "no-unused-vars": "warn",
      "@typescript-eslint/restrict-template-expressions": "off",
      "import/no-extraneous-dependencies": "error",
      "eslint-comments/require-description": "warn",
    },
    ignorePatterns: [
      "node_modules",
      "dist",
      ".npm",
      ".vscode-test",
      ".vscode",
      ".eslintrc.js",
    ],
  };
  