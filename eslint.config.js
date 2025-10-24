import baseConfig, { restrictEnvAccess } from "@fb/eslint-config/base.js";
import nextjsConfig from "@fb/eslint-config/nextjs.js";
import reactConfig from "@fb/eslint-config/react.js";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
