import {
  FALLBACK_KIND,
  REMOTE_KEY_DEFS,
  REMOTE_KEY_KIND_DEFS,
} from "./key-defs";
import type { RemoteKeyDef } from "./key-types";
import { resolveRemoteKeyKindDef } from "./remote-keys";
import { hexColorSchema } from "./schema";
import { parseNameTable } from "./utils";

export type ColorMap = Record<string, string> & Record<"DEFAULT", string>;

export type ColorResolver = (name: string) => string;

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
  return { ...colors, DEFAULT: colors[FALLBACK_KIND] };
}

/**
 * 色マップから、キー名に対応する色を解決する関数を生成する。
 *
 * - キー個別、kind、DEFAULT の順に検索する。
 * - DEFAULTは生成時に存在を保証すること！
 */
export function createColorResolver(colors: ColorMap): ColorResolver {
  return (name) =>
    colors[name] ??
    colors[resolveRemoteKeyKindDef(name).kind] ??
    colors.DEFAULT;
}

export const defaultColorMap = createDefaultColorMap();

export const defaultColorResolver = createColorResolver(defaultColorMap);

export type ColorMapResult = {
  /** 検証に通った項目だけを含む対応表。 */
  colors: Record<string, string>;
  /** 検証に失敗した項目や入力全体のエラー。 */
  errors: string[];
};

/**
 * JSON として読み込んだ値を、色の対応表に変換する。
 *
 * - 入力全体が JSON オブジェクトでない場合は、空の対応表とエラーを返す。
 * - 項目が不正な場合は、その項目を除外してエラーに記録する。色は #RRGGBB 形式のみ使える。
 * - 不正な項目があっても、正常な項目は返す。
 * - 名前は、キー名か kind として使われる（どの接頭辞にも当たらないキーは kind が etc になるため、その色は etc で変える）。
 * - 標準にない名前も検証せずに受け入れる（icon-urls.json と同じ）。
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
 * 標準の色（defaultColorMap）に、color-map.json の内容を重ねた色の対応表を返す。同じ名前は後者を優先する。
 *
 * @param overrides - parseColorMap() が返した対応表。
 */
export function mergeColorMap(overrides: Record<string, string>): ColorMap {
  return { ...defaultColorMap, ...overrides };
}
