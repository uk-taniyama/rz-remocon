import type { ComponentType, CSSProperties, ReactNode } from "react";
import type { RemoteKeyConfig } from "../../api";

/*
 * 型だけを置く。このファイルは、`remoteKeys` の他のファイルを `import` しない（循環を作らないため）。
 */

/**
 * キーのアイコンを、必要に応じて描画する関数の型。
 *
 * - `key.icon` は、アイコン名または画像 URL（省略可能）。
 */
export type RemoteKeyIconRender = (key: RemoteKeyConfig) => ReactNode;

/** `style` を受け取る、素のアイコンコンポーネント。サイズは指定されていない。 */
export type IconComponent = ComponentType<{ style?: CSSProperties }>;

/**
 * アイコンセット。アイコン名ごとの描画関数をまとめたもの。
 *
 * アイコンのライブラリが異なる場合も、{@link fromComponents} などで、この形式に統一する。
 */
export type IconSet = Record<string, RemoteKeyIconRender>;

/** 標準の `decorator`（{@link defaultDecorator}）のオプション。 */
export interface DefaultDecoratorOpts {
  /** `true` の場合は、アイコンがあるキーでも、ラベルを隠さない。 */
  keepLabel?: boolean;
}
