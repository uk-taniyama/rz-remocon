import { isSpecialKey } from "./remote-keys";
import type { EditorRemoconConfig, RemoconConfig } from "./schema";

/**
 * 編集用リモコン設定から表示用リモコン設定を生成する。
 *
 * @param editor - 編集用リモコン設定。
 * @returns 表示用リモコン設定。
 */
export function toRemoconConfig(editor: EditorRemoconConfig): RemoconConfig {
  const keys = editor.keys.map((key) => ({
    name: key.name,
    // 特殊キーは送信できないように、`code` を除く。
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
    // 上から下、左から右の順に並べる。
    keys: keys.sort(
      (a, b) => a.y - b.y || a.x - b.x || a.name.localeCompare(b.name),
    ),
  };
}

/** 値の変換結果。成功時は変換後の値、失敗時はエラーの説明を持つ。 */
export type ConvertResult<V> = { value: V } | { error: string };

/**
 * 名前と値の対応表、および検証エラーの一覧。
 */
export type NameTableResult<V> = {
  /** 検証に成功した項目の対応表。 */
  table: Record<string, V>;
  /** 検証に失敗した項目や入力全体のエラー。 */
  errors: string[];
};

/**
 * JSON として読み込んだ値を、名前と値の対応表に変換する。
 *
 * - 名前と文字列の検証は共通を行う。
 * - 値の検証と変換は `convert` で行う。
 * - 不正な項目は `errors` に記録し、`table` には正常な項目のみを含める。
 *
 * @param input - JSON として読み込んだ値。
 * @param labels - エラーメッセージに使用する名称。
 * @param convert - 文字列の値を検証し、対応表に格納する値へ変換する関数。
 * @returns 検証に成功した項目の対応表と、エラーの一覧。
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
