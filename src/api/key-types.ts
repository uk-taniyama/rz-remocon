/*
 * キー定義の型。`key-defs.ts` のデータが満たすべき形を決める。
 * `key-defs.ts` を差し替えるときは、この型に合わせてデータを書く。
 */

/** キーの定義。`REMOTE_KEY_DEFS` の値の型。 */
export interface RemoteKeyDef {
  /** REGZA に送信するキーコード。 */
  code: string;
  /** キーに表示するラベル。 */
  label: string;
  /** キーの色。 */
  color?: string;
  /** ラベルを表示するかどうか。 */
  showLabel?: boolean;
}

/** キーの種類（カテゴリ）の定義。`REMOTE_KEY_KIND_DEFS` の要素の型。 */
export interface RemoteKeyKindDef {
  /** 種類を識別する名前。 */
  kind: string;
  /** キー名から種類を判定するための接頭辞。 */
  prefix: string;
  /** 種類の表示名。 */
  label: string;
  /** 種類の既定色。 */
  color: string;
}
