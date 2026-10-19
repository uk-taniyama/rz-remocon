/*
 * gen の公開エントリーポイント。
 * Builder の build() の結果からの生成と、JSON ファイルからの生成を公開する。
 */

export * from "../web/remoteKeys";
export { _generateFromFile, type GenerateOpts, generate } from "./generate";
export { loadColorMapFile, loadIconUrlsFile } from "./load";
export type { GenerateFromFileOpts } from "./types";
