import { writeFileSync } from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import type { RemoconConfig } from "../api";
import {
  createGenerateToolsWithUrls,
  type RemoteKeyIconRender,
} from "../web/remoteKeys";
import { copyAssets, findCssFile, resolvePublicDir } from "./assets";
import { renderHtml } from "./HtmlView";
import {
  defaultIconUrlsPath,
  loadIconUrlsFile,
  loadRemoconConfig,
} from "./load";
import type { GenerateFromFileOpts } from "./types";

/**
 * `generate()` のオプション。
 */
export interface GenerateOpts {
  /** リモコン設定。 */
  remocon: RemoconConfig;
  /** 生成した静的リモコンの出力先ディレクトリ。 */
  outputDir: string;
  /**
   * アイコンを描画する関数。標準の描画関数として、{@link defaultIconRender} を使用可能。
   */
  iconRender: RemoteKeyIconRender;
  /** @internal 開発用。 */
  isDev?: boolean;
}

/**
 * リモコン設定から、静的リモコン用 HTML を生成する。
 *
 * - {@link rz-remocon-api#remoconBuilder} で作成したリモコン設定を利用可能。
 *
 * @param opts - 生成オプション。
 */
export async function generate(opts: GenerateOpts): Promise<void> {
  const { remocon, outputDir, iconRender, isDev } = opts;
  const publicDir = resolvePublicDir(isDev);
  const cssFile = findCssFile(publicDir);
  const cssPath = path.posix.join("assets", cssFile);
  const jsFile = "remote.js";
  const jsPath = path.posix.join("assets", jsFile);
  const outDir = path.resolve(outputDir);

  copyAssets(publicDir, outDir, [cssFile, jsFile]);

  writeFileSync(
    path.join(outDir, "index.html"),
    `<!doctype html>${renderToStaticMarkup(
      renderHtml({
        cssPath,
        jsPath,
        remocon,
        iconRender,
      }),
    )}`,
  );

  console.log(`generate ${outDir}/index.html`);
}

/**
 * @internal
 * `remocon.json` から、静的リモコン HTML を生成する。
 *
 * - CLI（`generate` コマンド）と開発用スクリプトから使用する。
 * - 利用者向けの API ではない。
 */
export async function _generateFromFile({
  inputJson,
  ...options
}: GenerateFromFileOpts): Promise<void> {
  const input = path.resolve(inputJson);
  const remocon = loadRemoconConfig(input);

  const iconUrls = options.iconUrls
    ? loadIconUrlsFile(options.iconUrls, true)
    : loadIconUrlsFile(defaultIconUrlsPath(input), false);

  await generate({
    remocon,
    outputDir: options.outputDir,
    iconRender: createGenerateToolsWithUrls(iconUrls).iconRender,
    isDev: options.isDev,
  });
}
