import {
  FALLBACK_KIND,
  REMOTE_KEY_DEFS,
  REMOTE_KEY_KIND_DEFS,
} from "./key-defs";
import type { RemoteKeyDef } from "./key-types";
import { resolveRemoteKeyKindDef } from "./remote-keys";
import { DEFAULT_BACKGROUND, hexColorSchema } from "./schema";
import { parseNameTable } from "./utils";

/**
 * キー名または種類名に色を割り当てるためのマップ。
 *
 * - `DEFAULT` は必須としない。
 */
export type ColorMapInput = Record<string, string>;

/**
 * 既定色 `DEFAULT` を含む色マップ。
 */
export type ColorMap = ColorMapInput & Record<"DEFAULT", string>;

/**
 * キー名から色を解決する関数の型。
 */
export type ColorResolver = (name: string) => string;

/**
 * 標準リモコンのキー定義から既定の色マップを生成する。
 *
 * @returns 色マップ。
 */
export function createDefaultColorMap(): ColorMap {
  const colors: Record<string, string> = {};
  REMOTE_KEY_KIND_DEFS.forEach((kind) => {
    colors[kind.kind] = kind.color;
  });
  Object.entries(REMOTE_KEY_DEFS).forEach(([name, value]) => {
    const def: RemoteKeyDef = value;
    if (def.color) {
      colors[name] = def.color;
    }
  });
  return { ...colors, DEFAULT: colors.DEFAULT ?? colors[FALLBACK_KIND] };
}

/**
 * 色マップから、{@link ColorResolver} を生成する。
 *
 * - キー個別の色、種類の色、`DEFAULT` の順に検索する。
 *
 * @param colors - キー名または種類名に対応する色のマップ。
 * @returns キー名から色を解決する関数。
 */
export function createColorResolver(colors: ColorMap): ColorResolver {
  return (name) =>
    colors[name] ??
    colors[resolveRemoteKeyKindDef(name).kind] ??
    colors.DEFAULT ??
    // 型では保証されているが、実行時の予備値として設定する。
    DEFAULT_BACKGROUND;
}

/**
 * 標準リモコンのキー定義から生成した既定の色マップ。
 */
export const defaultColorMap = createDefaultColorMap();

/**
 * 既定の色マップを使って色を解決する関数。
 */
export const defaultColorResolver = createColorResolver(defaultColorMap);

/**
 * 色マップの解析結果。
 */
export type ColorMapResult = {
  /** 検証に成功した項目だけを含む色マップ。 */
  colors: ColorMapInput;
  /** 入力全体または個々の項目の検証エラー。 */
  errors: string[];
};

/**
 * JSON として読み込んだ値を検証し、色マップに変換する。
 *
 * - 色は `#RRGGBB` 形式のみ受け付ける。
 * - 不正な項目は `errors` に記録し、`colors` には正常な項目のみを残す。
 * - キー名や種類名の妥当性は検証しない。
 *
 * @param value - JSON として読み込んだ値。
 * @returns 検証に成功した色マップとエラー一覧。
 */
export function parseColorMap(value: unknown): ColorMapResult {
  const { table, errors } = parseNameTable<string>(
    value,
    { table: "名前と色の表", value: "色" },
    (color) =>
      hexColorSchema.safeParse(color).success
        ? { value: color }
        : {
            error: `使えない色です（#RRGGBB の形式で指定します）: ${color}`,
          },
  );
  return { colors: table, errors };
}

/**
 * 既定の色マップに、指定された色マップを上書きして返す。
 *
 * - 同じ名前が存在する場合は、`overrides` の色を優先する。
 *
 * @param overrides - 上書きする色マップ。通常は `parseColorMap()` の `colors` を指定する。
 * @returns 既定の色と上書きした色を含む色マップ。
 */
export function mergeColorMap(overrides: ColorMapInput): ColorMap {
  return { ...defaultColorMap, ...overrides };
}
