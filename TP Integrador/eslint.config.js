import js from "@eslint/js";
import tseslint from "typescript-eslint";

// Analisis estatico de calidad de codigo (quality gate del CI).
// `npm run lint` devuelve codigo != 0 si hay errores y corta el pipeline
// antes del deploy. Complementa al typecheck (`tsc`), no lo reemplaza.
export default tseslint.config(
  {
    ignores: [
      "dist",
      "coverage",
      "node_modules",
      ".features-gen",
      "test-results",
      "playwright-report",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    rules: {
      // TypeScript ya valida referencias indefinidas en el typecheck.
      "no-undef": "off",
    },
  },
);
