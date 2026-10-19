import { useEffect, useMemo, useState } from "react";
import { type IconUrls, parseIconUrls } from "../../api";
import { loadJsonTable } from "./internal";
import type { RemoteKeyIconRender } from "./types";
import { createGenerateToolsWithUrls } from "./utils";

/*
 * icon-urls.json（アイコン名 → 画像 URL の対応表）を読み込み、アイコンを描画する関数を生成する。
 * remocon.json と同様に、data/ の静的配信（/data/）から直接 fetch する。
 *
 * 対応表は、存在しなくてもよい（その場合は、標準のアイコンだけで描画する）。
 * - ファイルが存在しない（404）: 空の対応表とし、警告も出さない。
 * - 読み込めない、または JSON として不正: 空の対応表とし、warnings に記録する。
 * - 不正な項目がある: 不正な項目だけを除外し、使用できる項目は使用する。不正な項目はすべて warnings に記録する。
 *   generate と同じ扱いである。
 */

/** icon-urls.json の取得先 URL。 */
export const ICON_URLS_URL = "/data/icon-urls.json";

/** icon-urls.json の読み込み結果。 */
export type LoadedIconUrls = {
  urls: IconUrls;
  /** 使用できなかった項目や、ファイルに関する問題の説明（なければ空）。 */
  warnings: string[];
};

/**
 * icon-urls.json を取得する。失敗しても例外は投げない。毎回サーバーから取得し直す。
 *
 * @param fetcher - 取得に使用する fetch 関数。
 */
export async function loadIconUrls(
  fetcher: typeof fetch = fetch,
): Promise<LoadedIconUrls> {
  const { table, warnings } = await loadJsonTable(
    ICON_URLS_URL,
    "icon-urls.json",
    (json) => {
      const { urls, errors } = parseIconUrls(json);
      return { table: urls, errors };
    },
    {},
    fetcher,
  );
  return { urls: table, warnings };
}

/**
 * アイコンを描画する関数と、読み込み時の警告を返すフック。ビューア、プレビュー、エディタで使用する。
 * ready が false の間（読み込み中）は、対応表にある名前のアイコンを正しく描画できないため、キーを描画せずに待つこと。
 * iconRender と hasIcon は、標準のアイコンに対応表を加えたセットから、createGenerateToolsWithUrls で生成する。
 * 対応表が存在しない場合は、標準のアイコンだけを使用する。
 * 警告は、console.warn にも出力する。
 */
export function useIconSet(): {
  /** 読み込みが完了した（成功、失敗、ファイルなしのいずれの場合も true）。 */
  ready: boolean;
  iconRender: RemoteKeyIconRender;
  /** 指定した名前のアイコンが存在するか。キーのカタログ（エディタ）が使用する。 */
  hasIcon: (name: string) => boolean;
  warnings: string[];
} {
  const [loaded, setLoaded] = useState<LoadedIconUrls | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadIconUrls().then((result) => {
      if (cancelled) {
        return;
      }
      for (const warning of result.warnings) {
        console.warn(`icon-urls.json: ${warning}`);
      }
      setLoaded(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => {
    // 標準のアイコンに対応表を加える（同じ名前は対応表を優先する）。読み込み前は、対応表が空。
    const tools = createGenerateToolsWithUrls(loaded?.urls ?? {});
    return {
      ready: loaded !== null,
      iconRender: tools.iconRender,
      hasIcon: tools.hasIcon,
      warnings: loaded?.warnings ?? [],
    };
  }, [loaded]);
}
