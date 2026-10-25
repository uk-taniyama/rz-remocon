/*
 * 非公開の部品。`index.ts` から再エクスポートしない（rz-remocon/gen の公開 API には含まれない）。
 * 公開するものは、`types.ts` と `utils.ts` に定義する。
 */
import React from "react";
import type { RemoteKeyDraft } from "../../api";
import type { ColorResolver } from "../../api/colors";
import type {
  DefaultDecoratorOpts,
  IconSet,
  RemoteKeyIconRender,
} from "./types";

/** キーコードが指定されたときに呼び出されるコールバック。 */
export type OnChangeCode = (value: string) => void;

/** 画像 URL を `<img>` で描画する。 */
export function imgRender(src: string): React.ReactElement {
  return React.createElement("img", {
    src,
    style: { width: "95%", height: "95%", objectFit: "contain" },
  });
}

/**
 * decorator を生成する。
 * - `icon`: 未指定の場合は、アイコンがあるキーに限り、キー名をそのまま設定する。
 * - `showLabel`: アイコンがあるキーは `false` にして、アイコンだけで表示する（`keepLabel` が指定された場合は変更しない）。
 *   label の文字列は削除しない。
 * - `color`: 未指定の場合は、キーの種類ごとの色を設定する。
 *
 * @param hasIcon - 指定した名前のアイコンが存在するかを返す関数。
 */
export function createDecorator(
  hasIcon: (name: string) => boolean,
  colorResolver: ColorResolver,
) {
  return (key: RemoteKeyDraft, opts?: DefaultDecoratorOpts): RemoteKeyDraft => {
    const icon = key.icon ?? (hasIcon(key.name) ? key.name : undefined);
    const showLabel =
      icon !== undefined && !opts?.keepLabel ? false : key.showLabel;
    const color = key.color ?? colorResolver(key.name);
    return { ...key, icon, showLabel, color };
  };
}

/**
 * アイコンセット（`IconSet`）から、アイコンを描画する関数を生成する。
 * - `icon` がない場合: 何も描画しない。
 * - アイコンセットにある名前の場合: その名前の描画関数で描画する。
 * - アイコンセットにない文字列の場合: 画像 URL として `<img>` で描画する。
 */
export function createIconRenderer(icons: IconSet): RemoteKeyIconRender {
  return (key) => {
    if (key.icon === undefined) {
      return null;
    }
    if (Object.hasOwn(icons, key.icon)) {
      return icons[key.icon](key);
    }
    return imgRender(key.icon);
  };
}

/** `data/` の JSON を検証した結果。 */
export type ParsedTable<T> = {
  /** 検証に通った項目だけを含む表。 */
  table: T;
  /** 検証に失敗した項目や入力全体のエラー。 */
  errors: string[];
};

/**
 * `data/` の JSON ファイル（`icon-urls.json`、`color-map.json`）を取得して検証する。
 * 検証（`parse`）以外の扱いは、ファイルによらず同じ。失敗しても例外は投げない。毎回サーバーから取得し直す。
 * - ファイルが存在しない（404）: 空の表とし、警告も出さない。
 * - 読み込めない、または JSON として不正: 空の表とし、警告に記録する。
 * - 不正な項目がある: 検証の結果（使える項目だけの表）と、その警告を返す。
 *
 * @param url - 取得先の URL。
 * @param fileName - 警告に表示するファイル名。
 * @param parse - JSON を検証して、表と警告に変換する関数。
 * @param empty - ファイルがない、または読み込めない場合の、空の表。
 * @param fetcher - 取得に使用する `fetch` 関数。
 */
export async function loadJsonTable<T>(
  url: string,
  fileName: string,
  parse: (json: unknown) => ParsedTable<T>,
  empty: T,
  fetcher: typeof fetch,
): Promise<{ table: T; warnings: string[] }> {
  try {
    const response = await fetcher(url, { cache: "no-store" });
    if (response.status === 404) {
      return { table: empty, warnings: [] };
    }
    if (!response.ok) {
      return {
        table: empty,
        warnings: [`${fileName} を読み込めません (${response.status})`],
      };
    }
    const { table, errors } = parse(await response.json());
    return { table, warnings: errors };
  } catch (error) {
    return {
      table: empty,
      warnings: [
        `${fileName} を読み込めません: ${error instanceof Error ? error.message : String(error)}`,
      ],
    };
  }
}
