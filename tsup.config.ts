import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/lib/index.ts",
      cli: "src/cli/index.ts",
      api: "src/api/index.ts",
    },
    format: ["esm"],
    clean: true,
    banner: {
      js: "#!/usr/bin/env node",
    },
    external: ["./gen.js"],
  },
  {
    entry: {
      gen: "src/gen/index.ts",
    },
    format: ["esm"],
    platform: "node",
    tsconfig: "tsconfig.gen.json",
    clean: false,
    minify: true,
    env: { NODE_ENV: "production" },
    banner: {
      js: "import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);",
    },
  },
]);
