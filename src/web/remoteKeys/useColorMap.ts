import { useEffect, useMemo, useState } from "react";
import {
  type ColorResolver,
  createColorResolver,
  mergeColorMap,
  parseColorMap,
} from "../../api";
import { loadJsonTable } from "./internal";

/*
 * `color-map.json`（色マップ。キー名・種類 → 色）を読み込み、色を決める関数を生成する。
 * `icon-urls.json`（`useIconUrls.ts`）と同様に、`data/` の静的配信（`/data/`）から直接 `fetch` する。
 *
 * 色マップは、存在しなくてもよい（その場合は、既定の色だけで決める）。既定の色に上書きする分だけを書く。
 * - ファイルが存在しない（404）: 空の色マップとし、警告も出さない。
 * - 読み込めない、または JSON として不正: 空の色マップとし、`warnings` に記録する。
 * - 不正な項目がある: 不正な項目だけを除外し、使用できる項目は使用する。不正な項目はすべて `warnings` に記録する。
 */

/** `color-map.json` の取得先 URL。 */
export const COLOR_MAP_URL = "/data/color-map.json";

/** `color-map.json` の読み込み結果。 */
export type LoadedColorMap = {
  colors: Record<string, string>;
  /** 使用できなかった項目や、ファイルに関する問題の説明（なければ空）。 */
  warnings: string[];
};

/**
 * `color-map.json` を取得する。失敗しても例外は投げない。毎回サーバーから取得し直す。
 *
 * @param fetcher - 取得に使用する `fetch` 関数。
 */
export async function loadColorMap(
  fetcher: typeof fetch = fetch,
): Promise<LoadedColorMap> {
  const { table, warnings } = await loadJsonTable(
    COLOR_MAP_URL,
    "color-map.json",
    (json) => {
      const { colors, errors } = parseColorMap(json);
      return { table: colors, errors };
    },
    {},
    fetcher,
  );
  return { colors: table, warnings };
}

/**
 * キーの色を決める関数と、読み込み時の警告を返すフック。エディタで使用する。
 * `ready` が `false` の間（読み込み中）は、標準の色で決まってしまうため、カタログを作らずに待つこと。
 * 警告は、console.warn にも出力する。
 */
export function useColorMap(): {
  /** 読み込みが完了した（成功、失敗、ファイルなしのいずれの場合も `true`）。 */
  ready: boolean;
  /** キー名から色を決める関数。標準の色に、`color-map.json` の内容を重ねたもの。 */
  colorResolver: ColorResolver;
  warnings: string[];
} {
  const [loaded, setLoaded] = useState<LoadedColorMap | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadColorMap().then((result) => {
      if (cancelled) {
        return;
      }
      for (const warning of result.warnings) {
        console.warn(`color-map.json: ${warning}`);
      }
      setLoaded(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(
    () => ({
      ready: loaded !== null,
      colorResolver: createColorResolver(mergeColorMap(loaded?.colors ?? {})),
      warnings: loaded?.warnings ?? [],
    }),
    [loaded],
  );
}
