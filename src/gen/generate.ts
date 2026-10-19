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
 * generate() のオプション。
 */
export interface GenerateOpts {
  /** Builder の build() が返したリモコン設定。 */
  remocon: RemoconConfig;
  /** 生成した静的リモコンの出力先ディレクトリ。 */
  outputDir: string;
  /**
   * アイコンを描画する関数。
   * key.icon には、アイコン名または画像 URL が渡される。
   * 標準の描画関数として、defaultIconRender を使用できる。
   */
  iconRender: RemoteKeyIconRender;
  /** @internal 開発用。 */
  isDev?: boolean;
}

/**
 * Builder の build() が返したリモコン設定から、静的リモコンを生成する。
 * 出力先に、index.html、CSS、remote.js、favicon.svg を出力する。
 */
export async function generate({
  remocon,
  outputDir,
  iconRender,
  isDev,
}: GenerateOpts): Promise<void> {
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
 * remocon.json から、静的リモコンを生成する。
 *
 * @internal CLI（generate コマンド）と開発用スクリプトから使用する。利用者向けの API ではない。
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
