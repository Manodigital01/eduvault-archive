import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const LOG_CALL =
  "CallExpression[callee.object.name=/^(logger|log)$/][callee.property.name=/^(trace|debug|info|warn|error|fatal)$/]";

/**
 * #883: log messages must be constant strings. Interpolating ids, addresses or
 * error text into the message makes every line unique (unbounded cardinality)
 * and bypasses field-level pseudonymization — pass values as structured fields.
 */
export const UNSAFE_LOG_SYNTAX = Object.freeze([
  {
    selector: `${LOG_CALL} > TemplateLiteral[expressions.length>0]`,
    message: "Do not interpolate values into log messages; pass them as structured fields (see docs/OBSERVABILITY_TELEMETRY.md).",
  },
  {
    selector: `${LOG_CALL} > BinaryExpression[operator='+']`,
    message: "Do not concatenate values into log messages; pass them as structured fields (see docs/OBSERVABILITY_TELEMETRY.md).",
  },
]);

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    files: ["src/**/*.{js,jsx,mjs}", "scripts/**/*.{js,mjs}"],
    rules: {
      "no-restricted-syntax": ["error", ...UNSAFE_LOG_SYNTAX],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
