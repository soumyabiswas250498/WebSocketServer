import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      ecmaVersion: "latest",      // Use the latest ECMAScript version
      sourceType: "module",       // Enable ES6 module syntax
      globals: {
        ...globals.browser,       // Add browser globals if needed
        ...globals.node           // Add Node.js globals if needed
      },
    },
  },
  pluginJs.configs.recommended,
];
