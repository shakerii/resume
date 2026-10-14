import path from "node:path";
import { fileURLToPath } from "url";
import _jiti from "jiti";
import createNextIntlPlugin from "next-intl/plugin";

const jiti = _jiti(fileURLToPath(import.meta.url));

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
jiti("./src/env");

const withNextIntl = createNextIntlPlugin();

/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
  serverExternalPackages: ["@prisma/client"],
  outputFileTracingIncludes: {
    "/**/*": [
      "./node_modules/.prisma/**/*",
      "./node_modules/@prisma/client/**/*",
      "./node_modules/.pnpm/**/@prisma+client*/**/*",
      "./node_modules/.pnpm/**/.prisma/**/*",
    ],
  },

  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ramtin.dev",
        port: "",
        pathname: "**",
      },
    ],
  },

  /** Linting and typechecking run as separate tasks */
  typescript: { ignoreBuildErrors: true },
};

export default withNextIntl(config);
