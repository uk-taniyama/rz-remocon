import {
  FALLBACK_KIND,
  REMOTE_KEY_DEFS,
  REMOTE_KEY_KIND_DEFS,
  type RemoteKeyKind,
  type RemoteKeyName,
} from "./key-defs";
import type { RemoteKeyDef, RemoteKeyKindDef } from "./key-types";

/**
 * 指定された名前が特殊キーかを判定する。
 *
 * - 特殊キーはレイアウトや表示のために使用する。
 *
 * @param name - 判定するキー名。
 * @returns 特殊キーの場合は `true`。
 */
export function isSpecialKey(name: string): boolean {
  return name.startsWith("$");
}

/** タブを表す特殊キー名。 */
export const TAB_KEY_NAME = "$TAB$";

/** ラベルを表す特殊キー名。表示要素として扱う。 */
export const LABEL_KEY_NAME = "$_LABEL$";

/**
 * 特殊キーの定義。
 */
export interface SpecialKeyDef {
  /** 表示名。 */
  label: string;
  /** グリッドの行全体を使用するかどうか。 */
  fullWidth: boolean;
}

/**
 * 特殊キー名と定義の対応表。
 */
export const SPECIAL_KEY_DEFS = {
  [TAB_KEY_NAME]: { label: "タブ", fullWidth: true },
  [LABEL_KEY_NAME]: { label: "ラベル", fullWidth: false },
} as const satisfies Record<string, SpecialKeyDef>;

/**
 * 指定された種類名に対応する定義を取得する。
 *
 * @param kind - 取得するキーの種類名。
 * @returns 対応する種類の定義。
 * @throws 対応する種類が `REMOTE_KEY_KIND_DEFS` に存在しない場合。
 */
function findKindDef(kind: RemoteKeyKind) {
  const def = REMOTE_KEY_KIND_DEFS.find((d) => d.kind === kind);
  if (!def) {
    throw new Error(`キーの種類が定義にありません: ${kind}`);
  }
  return def;
}

/** キー名がどの接頭辞にも一致しない場合に使用する種類の定義。 */
const fallbackKindDef = findKindDef(FALLBACK_KIND);

/**
 * キー名に対応する種類の定義を取得する。
 *
 * - 複数の接頭辞が一致する場合は、`REMOTE_KEY_KIND_DEFS` で先に定義されたものを採用する。
 * - 一致する接頭辞がない場合は、`FALLBACK_KIND` に対応する定義を返す。
 *
 * @param name - 種類を判定するキー名。
 * @returns 一致した種類の定義、またはフォールバックの種類の定義。
 */
export function resolveRemoteKeyKindDef(name: string): RemoteKeyKindDef {
  return (
    REMOTE_KEY_KIND_DEFS.find((def) => name.startsWith(def.prefix)) ??
    fallbackKindDef
  );
}

/** キー名とキー定義を組み合わせた操作キー。 */
export interface RemoteKey extends RemoteKeyDef {
  /** キー名。 */
  name: string;
}

/**
 * キー名と操作キー定義の対応表。
 *
 * {@link RemoconBuilder} の引数に使用できる。
 */
export const RemoteKeys = Object.fromEntries(
  Object.entries(REMOTE_KEY_DEFS).map(([name, def]) => [
    name,
    { ...def, name },
  ]),
) as Record<RemoteKeyName, RemoteKey>;
