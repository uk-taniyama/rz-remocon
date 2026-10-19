/*
 * キー定義の型。key-defs.ts のデータが満たすべき形を決める。
 * key-defs.ts を差し替えるときは、この型に合わせてデータを書く。
 */

/** キーの定義。REMOTE_KEY_DEFS の値の型。 */
export interface RemoteKeyDef {
  code: string;
  label: string;
  color?: string;
  showLabel?: boolean;
}

/** キーの種類（カテゴリ）の定義。REMOTE_KEY_KIND_DEFS の要素の型。 */
export interface RemoteKeyKindDef {
  kind: string;
  prefix: string;
  label: string;
  color: string;
}
