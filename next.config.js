import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "url";
import { createJiti } from "jiti";
import createNextIntlPlugin from "next-intl/plugin";

const jiti = createJiti(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const root = path.dirname(fileURLToPath(import.meta.url));
const prismaClient = path.dirname(
  require.resolve("@prisma/client/package.json"),
);
const generatedClient = path.dirname(
  require.resolve(".prisma/client/package.json", { paths: [prismaClient] }),
);
const traceDirectory = (directory) =>
  `./${path.relative(root, directory).split(path.sep).join("/")}/**/*`;

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
jiti("./src/env");

const withNextIntl = createNextIntlPlugin();

/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",
  outputFileTracingRoot: root,
  serverExternalPackages: ["@prisma/client"],
  outputFileTracingIncludes: {
    "/*": [traceDirectory(prismaClient), traceDirectory(generatedClient)],
  },
  experimental: {
    cpus: 2,
    webpackMemoryOptimizations: true,
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
};

export default withNextIntl(config);
