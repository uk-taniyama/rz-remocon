/*
 * icon-urls.json（アイコン名 → 画像 URL の対応表）の型と検証処理。
 * 手書きの設定ファイルを対象とし、API や保存データのスキーマ（schema.ts）とは分けて管理する。
 * Web UI（ビューア・エディタ）と静的リモコンの生成処理で共用する。
 */
import { parseNameTable } from "./utils";

/** アイコン名から画像 URL への対応表。 */
export type IconUrls = Record<string, string>;

/** 相対 URL の解決に使用する基準 URL。実際の画像表示には使用しない。 */
const ICON_URL_BASE = "http://localhost/";

/**
 * アイコンの画像 URL として使用できる値かを検証する。
 * URL として解析し、プロトコルが許可されていることを確認する。
 *
 * - 許可: http:、https:、data:image/ 形式
 * - 許可: http: または https: として解決できる相対パス
 * - 不許可: 空文字列、javascript:、file: など、許可されていない形式
 */
export function isIconUrl(value: string): boolean {
  if (value.trim() === "") {
    return false;
  }
  let url: URL;
  try {
    url = new URL(value, ICON_URL_BASE);
  } catch {
    return false;
  }
  if (url.protocol === "http:" || url.protocol === "https:") {
    return true;
  }
  return url.protocol === "data:" && /^image\//i.test(url.pathname);
}

export type IconUrlsResult = {
  /** 検証に通った項目だけを含む対応表。 */
  urls: IconUrls;
  /** 検証に失敗した項目や入力全体のエラー。 */
  errors: string[];
};

/**
 * JSON として読み込んだ値を、アイコン名と画像 URL の対応表に変換する。
 * - 入力全体が JSON オブジェクトでない場合は、空の対応表とエラーを返す。
 * - 項目が不正な場合は、その項目を除外してエラーに記録する。
 * - 不正な項目があっても、正常な項目は返す。
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
