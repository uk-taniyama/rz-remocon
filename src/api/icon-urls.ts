/*
 * `icon-urls.json`（アイコン URL 対応表。アイコン名 → 画像 URL）の型と検証処理。
 * 手書きの設定ファイルを対象とし、API や保存データのスキーマ（`schema.ts`）とは分けて管理する。
 * Web UI（ビューア・エディタ）と静的リモコンの生成処理で共用する。
 */
import { parseNameTable } from "./utils";

/**
 * アイコン URL 対応表。
 *
 * - アイコン名から画像 URL を引く。
 */
export type IconUrls = Record<string, string>;

/**
 * 指定された値がアイコンの画像 URL として使用できるかを検証する。
 *
 * - `http:`、`https:` の URL を許可する。
 * - `data:image/` 形式の URL を許可する。
 * - `http:` または `https:` として解決できる相対パスを許可する。
 * - 空文字列や `javascript:`、`file:` など、許可されていない形式は拒否する。
 *
 * @param value - 検証する URL 文字列。
 * @returns 使用できる URL の場合は `true`。
 */
export function isIconUrl(value: string): boolean {
  if (value.trim() === "") {
    return false;
  }
  let url: URL;
  try {
    url = new URL(value, "http://localhost/");
  } catch {
    return false;
  }
  if (url.protocol === "http:" || url.protocol === "https:") {
    return true;
  }
  return url.protocol === "data:" && /^image\//i.test(url.pathname);
}

/**
 * アイコン URL 対応表の解析結果。
 */
export type IconUrlsResult = {
  /** 検証に成功した項目だけを含むアイコン URL 対応表。 */
  urls: IconUrls;
  /** 入力全体または個々の項目の検証エラー。 */
  errors: string[];
};

/**
 * JSON として読み込んだ値を検証し、アイコン URL 対応表に変換する。
 *
 * - 入力全体が JSON オブジェクトでない場合は、空のアイコン URL 対応表とエラーを返す。
 * - 不正な項目は `errors` に記録し、`urls` には正常な項目のみを残す。
 * - アイコン名の妥当性は検証しない。
 *
 * @param value - JSON として読み込んだ値。
 * @returns 検証に成功したアイコン URL 対応表とエラー一覧。
 */
export function parseIconUrls(value: unknown): IconUrlsResult {
  const { table, errors } = parseNameTable<string>(
    value,
    { table: "名前と URL の表", value: "URL" },
    (url) =>
      isIconUrl(url)
        ? { value: url }
        : {
            error: `使えない URL です（http(s)、data:image/、相対パスが使えます）: ${url}`,
          },
  );
  return { urls: table, errors };
}
