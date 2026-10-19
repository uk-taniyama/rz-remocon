import type { ComponentType, CSSProperties, ReactNode } from "react";
import type { RemoteKeyConfig } from "../../api";

/*
 * 型だけを置く。このファイルは、remoteKeys の他のファイルを import しない（循環を作らないため）。
 */

/** キーコードが指定されたときに呼び出されるコールバック。 */
export type OnChangeCode = (value: string) => void;

/**
 * キーのアイコンを描画する関数。key.icon には、アイコン名または画像 URL の文字列が入る。
 * 要素を返した場合はそれを表示し、null または undefined を返した場合は何も描画しない。
 */
export type RemoteKeyIconRender = (key: RemoteKeyConfig) => ReactNode;

/** style を受け取る、素のアイコンコンポーネント。サイズは指定されていない。 */
export type IconComponent = ComponentType<{ style?: CSSProperties }>;

/**
 * アイコンセット。アイコン名から描画関数を引く対応表。
 * アイコンのライブラリが異なる場合も、fromComponents などで、この形式に統一する。
 */
export type IconSet = Record<string, RemoteKeyIconRender>;

/** 標準の decorator のオプション。 */
export interface DefaultDecoratorOpts {
  /** true の場合は、アイコンがあるキーでも、ラベルを隠さない。 */
  keepLabel?: boolean;
}
