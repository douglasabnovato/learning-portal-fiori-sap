// ESLint do projeto (#19): regras recomendadas, com os globais do UI5 no app e do Node nos scripts
import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["dist/", "node_modules/", "resources/", "test-resources/"] },
  js.configs.recommended,
  {
    // App UI5: módulos sap.ui.define, no navegador
    files: ["webapp/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: { ...globals.browser, sap: "readonly" }
    },
    // O app segue o estilo ES5 do UI5 ("catch (e)" com nome): o erro do armazenamento bloqueado é ignorado de propósito
    rules: { "no-unused-vars": ["error", { caughtErrors: "none" }] }
  },
  {
    // Testes QUnit e OPA5 do UI5
    files: ["webapp/test/**/*.js"],
    languageOptions: { globals: { QUnit: "readonly" } }
  },
  {
    // Executores de teste e scripts de build, no Node
    files: ["test/**/*.cjs", "scripts/**/*.cjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: { ...globals.node }
    }
  },
  {
    // Código do teste que roda dentro da página (page.evaluate) usa globais do navegador
    files: ["test/**/*.cjs"],
    languageOptions: { globals: { ...globals.browser } }
  }
];
