import React from "react";
import {
  type ColorResolver,
  defaultColorResolver,
  type RemoteKeyDraft,
} from "../../api";
import { REMOTE_ICONS } from "./Icons";
import { createDecorator, createIconRenderer, imgRender } from "./internal";
import type {
  DefaultDecoratorOpts,
  IconComponent,
  IconSet,
  RemoteKeyIconRender,
} from "./types";

/**
 * コンポーネントの対応表から、アイコンセットを生成する。
 *
 * - 対象は、`style` を受け取るコンポーネント（Remixicon など）。
 * - 値が `undefined` の項目は除外する。
 *
 * @param icons - アイコン名からコンポーネントへの対応表。
 * @param size - アイコンの幅と高さ。
 */
export function fromComponents(
  icons: Partial<Record<string, IconComponent>>,
  size = "100%",
): IconSet {
  const set: IconSet = {};
  for (const [name, Icon] of Object.entries(icons)) {
    if (Icon) {
      set[name] = () =>
        React.createElement(Icon, { style: { width: size, height: size } });
    }
  }
  return set;
}

/**
 * アイコン URL 対応表から、アイコンセットを生成する。画像に名前を付けて登録する場合に使用する。
 *
 * @param urls - アイコン URL 対応表。
 */
export function fromUrls(urls: Record<string, string>): IconSet {
  return Object.fromEntries(
    Object.entries(urls).map(([name, src]) => [name, () => imgRender(src)]),
  );
}

/** 標準のアイコン（`REMOTE_ICONS`）から生成したアイコンセット。 */
export const builtinIcons: IconSet = fromComponents(REMOTE_ICONS, "90%");

/**
 * 生成時に使うアイコン・色・装飾のユーティリティ一式。
 */
export interface GenerateTools {
  /** 指定した名前のアイコンが存在するかを返す。 */
  hasIcon: (name: string) => boolean;
  /** キー名から色を解決する関数。 */
  colorResolver: ColorResolver;
  /** `hasIcon` が `true` になるキー名を、`icon` に設定するなど、キーの既定値を決める関数。 */
  decorator: (
    key: RemoteKeyDraft,
    opts?: DefaultDecoratorOpts,
  ) => RemoteKeyDraft;
  /** アイコンを描画する関数。アイコンセットにない文字列は、画像 URL として描画する。 */
  iconRender: RemoteKeyIconRender;
}

/**
 * アイコンセットを結合し、{@link GenerateTools} を生成する。
 *
 * - 同じ名前がある場合は、`sets` の後ろにあるものを優先する（上書きする）。
 *
 * @param sets - 結合するアイコンセット。
 * @param colorResolver - キー名から色を解決する関数。
 */
export function createGenerateTools(
  sets: IconSet[],
  colorResolver: ColorResolver | undefined = defaultColorResolver,
): GenerateTools {
  const icons: IconSet = Object.assign({}, ...sets);
  const hasIcon = (name: string): boolean => Object.hasOwn(icons, name);
  return {
    hasIcon,
    colorResolver,
    decorator: createDecorator(hasIcon, colorResolver),
    iconRender: createIconRenderer(icons),
  };
}

/**
 * アイコン URL 対応表を加えた {@link GenerateTools} を生成する。
 *
 * - 標準のアイコン（{@link builtinIcons}）に、アイコン URL 対応表（`icon-urls.json`）を加える。
 * - 同じ名前はアイコン URL 対応表を優先するので、標準のアイコンを差し替えられる。
 * - `createGenerateTools([builtinIcons, fromUrls(urls)], colorResolver)` と同じ。
 *
 * @param urls - アイコン URL 対応表。{@link loadIconUrlsFile} の戻り値を渡せる。
 * @param colorResolver - キー名から色を解決する関数。
 */
export function createGenerateToolsWithUrls(
  urls: Record<string, string>,
  colorResolver?: ColorResolver,
) {
  return createGenerateTools([builtinIcons, fromUrls(urls)], colorResolver);
}

const defaultGenerateTools = createGenerateTools([builtinIcons]);

/**
 * アイコンを描画する標準の関数。
 *
 * - `icon` がない場合: 何も描画しない（`icon` の省略は「アイコンなし」を意味する。エディタも同じ）。
 * - 標準のアイコンセット（{@link builtinIcons}）にある名前の場合: 標準のアイコンを描画する。
 * - アイコンセットにない文字列の場合: 画像 URL として `<img>` で描画する。
 */
export const defaultIconRender: RemoteKeyIconRender =
  defaultGenerateTools.iconRender;

/**
 * キーの既定値を決める、標準の `decorator`。
 *
 * - `icon`: 未指定の場合は、アイコンがあるキーに限り、キー名をそのまま設定する。
 * - `showLabel`: アイコンがあるキーは `false` にして、アイコンだけで表示する（`keepLabel` が指定された場合は変更しない）。
 * - `color`: 未指定の場合は、キーの種類ごとの色を設定する。
 *
 * @param key - 既定値を適用するリモコンキー。
 * @param opts - 既定の適用方法を調整するオプション。
 */
export const defaultDecorator = defaultGenerateTools.decorator;
