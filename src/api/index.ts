/**
 * @packageDocumentation
 * キー定義・色・スキーマ・API 契約を提供する。
 *
 * - キーの定義（{@link RemoteKeyDef}）、色マップ、アイコン URL 対応表の解析を提供する。
 * - 設定の zod スキーマと、編集用 API の契約（{@link contract}）を提供する。
 * - {@link remoconBuilder} で、リモコン設定（{@link RemoconConfig}）を組み立てる。
 */

export * from "./builder";
export * from "./client";
export * from "./colors";
export { apiPrefix, type Contract, contract } from "./contract";
export { type IconUrls, type IconUrlsResult, parseIconUrls } from "./icon-urls";
export * from "./key-defs";
export * from "./key-types";
export * from "./remote-keys";
export {
  DEFAULT_BACKGROUND,
  type EditorRemoconConfig,
  type EditorRemoteKeyConfig,
  editorRemoconConfigSchema,
  editorRemoteKeyConfigSchema,
  hexColorSchema,
  keyCodeSchema,
  type RemoconConfig,
  type RemoteKeyConfig,
  remoconConfigSchema,
  remoteKeyConfigSchema,
} from "./schema";
export { toRemoconConfig } from "./utils";
