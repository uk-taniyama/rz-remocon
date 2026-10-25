/*
 * 静的リモコンの出力に使う、ビルド済みの静的ファイル（CSS、`remote.js`、`favicon.svg`）の扱い。
 */
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

/**
 * ビルド済みの静的ファイルが置かれたディレクトリのパスを返す。
 *
 * @param isDev - `true` の場合は、開発用の出力先（`dist/public`）を返す。
 */
export function resolvePublicDir(isDev?: boolean): string {
  return isDev ? path.join(dir, "../../dist/public") : path.join(dir, "public");
}

/**
 * `index.html` が参照する CSS ファイルの名前を特定する。
 *
 * - CSS のファイル名には依存しない。
 * - `stylesheet` として参照されている CSS がちょうど 1 つであることを検証する。
 *
 * @param publicDir - `index.html` を含むディレクトリ。
 * @returns assets/ 内の CSS ファイル名。
 * @throws `stylesheet` として参照されている CSS が 1 つでない場合。
 */
export function findCssFile(publicDir: string): string {
  const html = readFileSync(path.join(publicDir, "index.html"), "utf8");
  const cssFiles = [...html.matchAll(/<link\b[^>]*>/g)]
    .map((match) => match[0])
    .filter((tag) => /\brel="stylesheet"/.test(tag))
    .map((tag) => tag.match(/\bhref="\/?assets\/([^"]+\.css)"/)?.[1])
    .filter((name): name is string => name !== undefined);

  if (cssFiles.length !== 1) {
    throw new Error(
      `Expected exactly one stylesheet in ${publicDir}/index.html, found ${cssFiles.length}`,
    );
  }

  return cssFiles[0];
}

/**
 * 静的リモコンの出力先に、assets/ 内のファイルと `favicon.svg` をコピーする。
 *
 * - コピー元とコピー先が同じファイルの場合は、コピーしない。
 * - HTML が /favicon.svg を参照するため、`favicon.svg` は出力先の直下にコピーする。
 *
 * @param publicDir - ビルド済みの静的ファイルが置かれたディレクトリ。
 * @param outDir - 出力先のディレクトリ。存在しない場合は作成する。
 * @param assetFiles - コピーする assets/ 内のファイル名。
 */
export function copyAssets(
  publicDir: string,
  outDir: string,
  assetFiles: string[],
): void {
  const assetsDir = path.join(publicDir, "assets");
  const outputAssetsDir = path.join(outDir, "assets");

  mkdirSync(outDir, { recursive: true });
  mkdirSync(outputAssetsDir, { recursive: true });

  for (const assetFile of assetFiles) {
    const source = path.join(assetsDir, assetFile);
    const destination = path.join(outputAssetsDir, assetFile);

    if (path.resolve(source) !== path.resolve(destination)) {
      copyFileSync(source, destination);
      console.log(`copy ${assetFile}`);
    } else {
      console.log(`skip ${assetFile}`);
    }
  }

  copyFileSync(
    path.join(publicDir, "favicon.svg"),
    path.join(outDir, "favicon.svg"),
  );
  console.log("copy favicon.svg");
}
