import fs from "node:fs";
import { mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { OpenAPIGenerator } from "@orpc/openapi";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { type Command, InvalidArgumentError } from "commander";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";
import { apiPrefix, contract } from "../api";
import { freezeRegzaConfig } from "../lib/regza-client";
import { apiRouter } from "./api-router";
import { configureEditorStorage } from "./editor-storage";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * -d オプションの既定値（静的ファイルのディレクトリ）を決定する。
 * - ビルド後（`dist/cli.js`）: 同じ階層の `dist/public`。
 * - 開発時（`src/cli/server.ts`）: リポジトリの `public`。
 * ビルド後に `../../public` を指すとパッケージの外になるため、先に同じ階層の `public` を探す。
 *
 * @param baseDir - 探索の基準とするディレクトリ。
 */
export function resolveDefaultPublicDir(baseDir: string = __dirname): string {
  const built = path.resolve(baseDir, "public");
  return fs.existsSync(built) ? built : path.resolve(baseDir, "../../public");
}

const defaultPublicDir = resolveDefaultPublicDir();

/** 外部から接続できる、このマシンの IPv4 アドレスを使った URL の一覧を返す。 */
function getNetworkUrls(port: number): string[] {
  const seen = new Set<string>();

  for (const faces of Object.values(os.networkInterfaces())) {
    for (const face of faces ?? []) {
      if (face.family === "IPv4" && !face.internal) {
        const url = `http://${face.address}:${port}/`;
        if (!seen.has(url)) {
          seen.add(url);
        }
      }
    }
  }

  return [...seen];
}

/**
 * ディレクトリのパスを絶対パスに解決し、存在するディレクトリであることを検証する。
 *
 * @throws パスが存在しない場合、またはディレクトリでない場合。
 */
export function resolveDir(value: string): string {
  const dir = path.resolve(value);

  let stat: fs.Stats;
  try {
    stat = fs.statSync(dir);
  } catch {
    throw new Error(`ディレクトリが存在しません: ${dir}`);
  }
  if (!stat.isDirectory()) {
    throw new Error(`ディレクトリではありません: ${dir}`);
  }

  return dir;
}

const docsHtml = `<!doctype html>
<html>
  <head><meta charset="utf-8" /><title>REGZA リモコン API</title></head>
  <body>
    <script id="api-reference" data-url="/openapi.json"></script>
    <script
      src="https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.73.1"
      integrity="sha384-ZMlwZ9ys+KibUqRxEG03igTBtyxS9LUnsxgVlr1qVSObUewogXBs58V2d4WYFSFp"
      crossorigin="anonymous"
    ></script>
  </body>
</html>`;

/** API の契約から、OpenAPI の仕様を生成する。 */
export function createOpenApiSpec() {
  const generator = new OpenAPIGenerator({
    schemaConverters: [new ZodToJsonSchemaConverter()],
  });
  return generator.generate(contract, {
    info: {
      title: "REGZA リモコン API",
      version: "1.0.0",
      description: "REGZA をリモコン操作するための API",
    },
    servers: [{ url: apiPrefix }],
    tags: [
      { name: "REGZA", description: "REGZA の操作・状態確認に関する API" },
    ],
  });
}

/**
 * 書き込み（GET と HEAD 以外）のリクエストの Origin を確かめる。
 * 許可した Origin 以外は 403 にする。
 *
 * - ブラウザは、GET と HEAD 以外のリクエストには必ず Origin を付ける。
 * - 同じ Origin の GET には付かないため、読み出しは対象にしない。
 *
 * @param allowOrigin - 許可する Origin。
 */
export const guardOrigin = (allowOrigin: string) =>
  createMiddleware(async (c, next) => {
    const readOnly = c.req.method === "GET" || c.req.method === "HEAD";
    if (!readOnly && c.req.header("origin") !== allowOrigin) {
      return c.text("Forbidden origin", 403);
    }

    await next();
  });

type OpenApiSpec = Awaited<ReturnType<typeof createOpenApiSpec>>;

/** `server` コマンドのオプション。 */
export interface ServerOptions {
  publicDir: string;
  dataDir: string;
  spec?: OpenApiSpec;
  corsOrigin?: string;
  allowOrigin?: string;
}

/**
 * Web サーバーの Hono アプリケーションを生成する。
 *
 * @param publicDir - 静的ファイルのディレクトリ。
 * @param spec - OpenAPI の仕様。指定した場合は、/openapi.json と /docs を提供する。
 * @param corsOrigin - API に許可する CORS のオリジン。省略した場合は CORS を設定しない。
 * @param dataDir - `/data` 以下で配信するディレクトリ。省略可。
 */
export function createServerApp(
  { publicDir, spec, corsOrigin, allowOrigin, dataDir }: ServerOptions,
  // publicDir: string,
  // spec?: OpenApiSpec,
  // corsOrigin?: string,
  // allowOrigin?: string,
  // dataDir?: string,
) {
  const app = new Hono();

  // `data/` は `/data` 以下で配信する。`public/data/` と衝突しないよう、`public` より先に登録する。
  if (dataDir != null) {
    app.use(
      "/data/*",
      serveStatic({
        root: resolveDir(dataDir),
        rewriteRequestPath: (requestPath) => requestPath.replace(/^\/data/, ""),
      }),
    );
  }

  app.use("/*", serveStatic({ root: publicDir }));

  if (allowOrigin != null) {
    app.use(`${apiPrefix}/*`, guardOrigin(allowOrigin));
  }
  if (corsOrigin) {
    app.use(`${apiPrefix}/*`, cors({ origin: corsOrigin }));
  }

  const handler = new OpenAPIHandler(apiRouter);
  if (spec) {
    app.get("/openapi.json", (c) => c.json(spec));
    app.get("/docs", (c) => c.html(docsHtml));
  }

  app.use(`${apiPrefix}/*`, async (c, next) => {
    const { matched, response } = await handler.handle(c.req.raw, {
      prefix: apiPrefix,
      context: {},
    });
    if (matched) {
      return c.newResponse(response.body, response);
    }
    await next();
  });

  return app;
}

/** `server` コマンドのオプション。 */
export interface CommandServerOptions extends Omit<ServerOptions, "spec"> {
  port: number;
}

/**
 * `server` コマンドを実行し、Web サーバーを起動する。
 * REGZA の設定は、起動時に検証して読み取り専用にする。
 */
export async function commandServer({
  port,
  publicDir,
  dataDir,
  ...options
}: CommandServerOptions) {
  await freezeRegzaConfig();

  //
  const resolvedPublicDir = resolveDir(publicDir);
  const resolvedDataDir = path.resolve(dataDir);

  // 初回の起動時は存在しないため作成する。
  // エディタの保存先と、`/data` の配信元を兼ねる。
  await mkdir(resolvedDataDir, { recursive: true });
  configureEditorStorage({ dataDir: resolvedDataDir });

  const spec = await createOpenApiSpec();
  const app = createServerApp({
    ...options,
    spec,
    publicDir: resolvedPublicDir,
    dataDir: resolvedDataDir,
  });
  const server = serve(
    {
      fetch: app.fetch,
      port,
    },
    (info) => {
      const urls = [
        `http://localhost:${info.port}/`,
        ...getNetworkUrls(info.port),
      ];
      console.log(`Web server listening on port ${info.port}`);
      console.log("");
      for (const url of urls) {
        console.log(`Web: ${url}`);
      }
      console.log("");
      console.log(`Static:     ${resolvedPublicDir}`);
      console.log(`Data:       ${resolvedDataDir} (served at /data/)`);
      console.log(
        "Use -d <path> to serve a custom screen or different static files.",
      );
    },
  );

  return server;
}

/**
 * ポート番号の文字列を数値に変換する。
 *
 * @throws 1〜65535 の整数でない場合。
 */
export function parsePort(value: string): number {
  const port = /^\d+$/.test(value) ? Number(value) : Number.NaN;
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new InvalidArgumentError("1〜65535 の整数を指定してください。");
  }
  return port;
}

/** commander のプログラムに、`server` コマンドを登録する。 */
export function setupServer(program: Command) {
  program
    .command("server")
    .description("Start the remote control web server")
    .option("-p, --port <number>", "port to listen on", parsePort, 8484)
    .option(
      "-d, --public-dir <path>",
      "directory of static files",
      defaultPublicDir,
    )
    .option(
      "-D, --data-dir <path>",
      "directory served at /data/ (also where the editor saves)",
      "./data",
    )
    .option("-a, --allow-origin <origin>", "allowed request origin")
    .option("-c, --cors-origin <origin>", "allowed CORS origin")
    .action(async (options: CommandServerOptions) => {
      await commandServer(options);
    });
}
