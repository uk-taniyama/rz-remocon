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
 * 対象は、style を受け取るコンポーネント（Remixicon など）。値が undefined の項目は除外する。
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
 * 画像 URL の対応表から、アイコンセットを生成する。画像に名前を付けて登録する場合に使用する。
 *
 * @param urls - アイコン名から画像 URL への対応表。
 */
export function fromUrls(urls: Record<string, string>): IconSet {
  return Object.fromEntries(
    Object.entries(urls).map(([name, src]) => [name, () => imgRender(src)]),
  );
}

/** 標準のアイコン（REMOTE_ICONS）から生成した、アイコンセット。 */
export const builtinIcons: IconSet = fromComponents(REMOTE_ICONS, "90%");

export interface GenerateTools {
  hasIcon: (name: string) => boolean;
  colorResolver: ColorResolver;
  decorator: (
    key: RemoteKeyDraft,
    opts?: DefaultDecoratorOpts,
  ) => RemoteKeyDraft;
  iconRender: RemoteKeyIconRender;
}

/**
 * アイコンセットを結合し、hasIcon、decorator、iconRender を生成する。
 * 同じ名前がある場合は、sets の後ろにあるものを優先する（上書きする）。
 * - hasIcon: 結合した対応表に、指定した名前が存在するかを返す。
 * - decorator: hasIcon が true になるキー名を、icon に設定する。
 * - iconRender: 対応表にある名前は、その描画関数で描画する。対応表にない文字列は、画像 URL として描画する。
 *
 * @param sets - 結合するアイコンセット。
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
 * アイコン対応表を加えた GenerateTools を作成する。
 *
 * - 標準のアイコン（builtinIcons）に、icon-urls.json の対応表を加える。
 * - 同じ名前は対応表を優先するので、標準のアイコンを差し替えられる。
 * - createGenerateTools(builtinIcons, fromUrls(urls)) と同じ。
 *
 * @param urls - アイコン名から画像 URL への対応表。loadIconUrlsFile() の戻り値を渡せる。
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
 * - key.icon には、アイコン名または画像 URL の文字列が入る。
 * - icon がない場合: 何も描画しない（icon の省略は「アイコンなし」を意味する。エディタも同じ）。
 * - 標準の対応表にある名前の場合: 標準のアイコンを描画する。
 * - 対応表にない文字列の場合: 画像 URL として `<img>` で描画する。
 */
export const defaultIconRender: RemoteKeyIconRender =
  defaultGenerateTools.iconRender;

/**
 * キーの既定値を決める、標準の decorator。
 *
 * - icon: 未指定の場合は、アイコンがあるキーに限り、キー名をそのまま設定する。
 * - showLabel: アイコンがあるキーは false にして、アイコンだけで表示する（keepLabel が指定された場合は変更しない）。
 * - color: 未指定の場合は、キーの種類ごとの色を設定する。
 */
export const defaultDecorator = defaultGenerateTools.decorator;
