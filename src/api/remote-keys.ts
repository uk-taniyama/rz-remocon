import {
  FALLBACK_KIND,
  REMOTE_KEY_DEFS,
  REMOTE_KEY_KIND_DEFS,
  type RemoteKeyKind,
  type RemoteKeyName,
} from "./key-defs";
import type { RemoteKeyDef } from "./key-types";

/**
 * 名前が特殊キーかを判定する。
 *
 * - 特殊キーはリモコン操作用のキーではなく、レイアウトや表示に使用する。
 */
export function isSpecialKey(name: string): boolean {
  return name.startsWith("$");
}

/** タブ。描画側では、この名前を全幅の見出しとして扱う。 */
export const TAB_KEY_NAME = "$TAB$";

/** ラベル。描画側では、操作できない表示要素として扱う。 */
export const LABEL_KEY_NAME = "$_LABEL$";

/**
 * 特殊キーの定義。
 *
 * - REGZA の操作キーとは分けて管理する。
 */
export interface SpecialKeyDef {
  /** 表示名。 */
  label: string;
  /** グリッドの行全体を使用するか。 */
  fullWidth: boolean;
}

/**
 * 特殊キー名の定義。
 */
export const SPECIAL_KEY_DEFS = {
  [TAB_KEY_NAME]: { label: "タブ", fullWidth: true },
  [LABEL_KEY_NAME]: { label: "ラベル", fullWidth: false },
} as const satisfies Record<string, SpecialKeyDef>;

/**
 * キーの種類を取得する。
 *
 * - 定義が存在しない場合は、キーの種類の設定漏れとしてエラーにする。
 */
function findKindDef(kind: RemoteKeyKind) {
  const def = REMOTE_KEY_KIND_DEFS.find((d) => d.kind === kind);
  if (!def) {
    throw new Error(`キーの種類が定義にありません: ${kind}`);
  }
  return def;
}

/** キー名の接頭辞がどの定義にも一致しない場合に使用する種類の定義。 */
const fallbackKindDef = findKindDef(FALLBACK_KIND);

/**
 * キー名からキーの種類の定義を取得する。
 *
 * - 複数の接頭辞が一致する場合は、REMOTE_KEY_KIND_DEFS で先に定義されたものを採用する。
 * = 一致するものがなければ FALLBACK_KIND の定義を返す。
 */
export function resolveRemoteKeyKindDef(name: string) {
  return (
    REMOTE_KEY_KIND_DEFS.find((def) => name.startsWith(def.prefix)) ??
    fallbackKindDef
  );
}

/**
 * 定義済みの操作キー。
 *
 * - 定義名をキー自身の name プロパティにも持つ。
 */
export interface RemoteKey extends RemoteKeyDef {
  name: string;
}

/**
 * 操作キーの定義表を、name を含むキーオブジェクトの辞書に変換したもの。
 *
 * - キー名から定義を参照しつつ、Builder にはキーオブジェクトを渡せるようにする。
 */
export const RemoteKeys = Object.fromEntries(
  Object.entries(REMOTE_KEY_DEFS).map(([name, def]) => [
    name,
    { ...def, name },
  ]),
) as Record<RemoteKeyName, RemoteKey>;
