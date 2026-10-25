/**
 * @packageDocumentation
 * 静的リモコンの生成と、その見た目（アイコン・色・キーの装飾）をカスタマイズする部品を提供する。
 */

export * from "../web/remoteKeys";
export { _generateFromFile, type GenerateOpts, generate } from "./generate";
export { loadColorMapFile, loadIconUrlsFile } from "./load";
