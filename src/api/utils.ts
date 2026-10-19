import { isSpecialKey } from "./remote-keys";
import type { EditorRemoconConfig, RemoconConfig } from "./schema";

/** 編集用データから、表示用データを導出する。 */
export function toRemoconConfig(editor: EditorRemoconConfig): RemoconConfig {
  const keys = editor.keys.map((key) => ({
    name: key.name,
    // 特殊キーは送信できないように、code を除く。
    code: isSpecialKey(key.name) ? undefined : key.code,
    icon: key.icon,
    label: key.showLabel ? key.label : undefined,
    x: key.x,
    y: key.y,
    w: key.w,
    h: key.h,
    color: key.color,
  }));

  return {
    version: 1,
    grid: editor.grid,
    background: editor.background,
    // grid.engine の内部の順序に依存しないよう、上から下、左から右の順に並べる。
    keys: keys.sort(
      (a, b) => a.y - b.y || a.x - b.x || a.name.localeCompare(b.name),
    ),
  };
}

/** 値の変換結果。成功なら変換後の値、失敗ならエラーの説明。 */
export type ConvertResult<V> = { value: V } | { error: string };

/** parseNameTable() の結果。 */
export type NameTableResult<V> = {
  /** 検証に通った項目だけを含む表。 */
  table: Record<string, V>;
  /** 検証に失敗した項目や入力全体のエラー。 */
  errors: string[];
};

/**
 * JSON として読み込んだ値を、名前から値への対応表に変換する。
 * icon-urls.json と color-map.json のように、手書きの「名前 → 文字列」の表に使用する。
 * 名前と文字列の検証は共通で、値の検証と変換（convert）だけがファイルごとに異なる。
 *
 * - 入力全体が JSON オブジェクトでない場合は、空の表とエラーを返す。
 * - 項目が不正な場合は、その項目を除外してエラーに記録する。
 * - 不正な項目があっても、正常な項目は返す。
 *
 * @param input - JSON として読み込んだ値。
 * @param labels - エラーに表示する名称。table は表全体（「名前と URL の表」など）、value は値（「URL」など）。
 * @param convert - 文字列の値を検証し、表に入れる値へ変換する関数。
 */
export function parseNameTable<V = string>(
  input: unknown,
  labels: { table: string; value: string },
  convert: (value: string) => ConvertResult<V>,
): NameTableResult<V> {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return {
      table: {},
      errors: [`${labels.table}（JSON のオブジェクト）ではありません`],
    };
  }
  const table: Record<string, V> = {};
  const errors: string[] = [];
  for (const [name, value] of Object.entries(input)) {
    if (name === "" || name === "__proto__") {
      errors.push(`使えない名前です: "${name}"`);
    } else if (typeof value !== "string") {
      errors.push(`${name}: ${labels.value}は文字列で指定してください`);
    } else {
      const result = convert(value);
      if ("error" in result) {
        errors.push(`${name}: ${result.error}`);
      } else {
        table[name] = result.value;
      }
    }
  }
  return { table, errors };
}
