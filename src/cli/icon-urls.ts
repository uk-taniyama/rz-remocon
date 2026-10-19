/*
 * icon-urls コマンド。アプリ名とドメインの対応表から、次の2つのファイルを書き出す。
 * - icon-urls.json: アプリ名 → Google の favicon の URL の対応表
 * - icon-urls.html: アイコンの見た目を確認するためのプレビュー
 * 画像は取得せず、URL を生成するだけである。
 */
import fs from "node:fs";
import path from "node:path";

/** icon-urls コマンドのオプション。 */
export type IconUrlsCommandOpts = {
  /** 出力先のディレクトリ。icon-urls.json と icon-urls.html を出力する。 */
  outputDir: string;
  /** 名前とドメインの対応表（JSON）のパス。省略した場合は、outputDir の app-domains.json を使用する。 */
  domains?: string;
  /** favicon の大きさ（px）。 */
  size: string;
};

/** 名前とドメインの標準の対応表。対応表のファイルが存在しない場合に使用する。名前は、REGZA のアプリキーの名前。 */
export const DEFAULT_APP_DOMAINS: Record<string, string> = {
  appYoutube: "youtube.com",
  appAmazonPrime: "amazon.co.jp", // または primevideo.com
  appWowow: "wowow.co.jp",
  appNhkOne: "plus.nhk.jp",
  appTver: "tver.jp",
  appDisneyPlus: "disneyplus.com",
  appNetVision: "www.netvision2022.com",
  appHulu: "hulu.jp",
  appAbema: "abema.tv",
  appDazn: "dazn.com",
  appLemino: "lemino.docomo.ne.jp",
  appNetflix: "netflix.com",
  appFod: "fod.fujitv.co.jp",
};

const FAVICON_API = "https://www.google.com/s2/favicons";

/**
 * ドメインから、Google の favicon の URL を生成する。
 *
 * @param domain - favicon を取得するサイトのドメイン。
 * @param size - favicon の大きさ（px）。
 */
export function faviconUrl(domain: string, size: string | number): string {
  return `${FAVICON_API}?sz=${size}&domain=${encodeURIComponent(domain)}`;
}

/** HTML の特殊文字（& < > "）をエスケープする。 */
function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * 名前と URL の対応表から、確認用の HTML（アイコンと名前の一覧）を生成する。
 *
 * @param urls - 名前から画像 URL への対応表。
 */
export function buildPreviewHtml(urls: Record<string, string>): string {
  const rows = Object.entries(urls).map(
    ([name, url]) =>
      `  <li><img src="${escapeHtml(url)}" alt="" width="32" height="32"> ${escapeHtml(name)}</li>`,
  );
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>Icon Preview</title>
<style>
  body { font-family: sans-serif; }
  ul { list-style: none; padding: 0; }
  li { display: flex; align-items: center; gap: 12px; padding: 4px 0; }
</style>
</head>
<body>
<ul>
${rows.join("\n")}
</ul>
</body>
</html>
`;
}

/**
 * 名前とドメインの対応表を読み込む。
 * ファイルが存在しない場合は、標準の対応表（DEFAULT_APP_DOMAINS）を返す。
 *
 * @param file - 対応表（JSON）のパス。
 * @throws 内容が、文字列の値を持つ JSON オブジェクトでない場合。
 */
export function loadDomains(file: string): Record<string, string> {
  if (!fs.existsSync(file)) {
    return { ...DEFAULT_APP_DOMAINS };
  }
  const value: unknown = JSON.parse(fs.readFileSync(file, "utf8"));
  const isTable =
    typeof value === "object" && value !== null && !Array.isArray(value);
  if (
    !isTable ||
    !Object.values(value).every((domain) => typeof domain === "string")
  ) {
    throw new Error(`${file}: 名前 → ドメインの表（文字列の値）にしてください`);
  }
  return value as Record<string, string>;
}

/**
 * icon-urls コマンドを実行し、icon-urls.json と icon-urls.html を書き出す。
 *
 * @param options - コマンドのオプション。
 * @throws size が正の整数でない場合。
 */
export function commandIconUrls(options: IconUrlsCommandOpts): void {
  if (!/^[1-9]\d*$/.test(options.size)) {
    throw new Error("--size は、正の整数で指定してください");
  }
  const outputDir = path.resolve(options.outputDir);
  const domainsFile = path.resolve(
    options.domains ?? path.join(outputDir, "app-domains.json"),
  );
  if (!fs.existsSync(domainsFile)) {
    console.log(`${domainsFile} がないので、標準の表を使います`);
  }

  const urls: Record<string, string> = {};
  for (const [name, domain] of Object.entries(loadDomains(domainsFile))) {
    urls[name] = faviconUrl(domain, options.size);
    console.log(`${name}: ${urls[name]}`);
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(
    path.join(outputDir, "icon-urls.json"),
    `${JSON.stringify(urls, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(outputDir, "icon-urls.html"),
    buildPreviewHtml(urls),
  );
  console.log(
    `\n${outputDir} に icon-urls.json と icon-urls.html を書き出しました`,
  );
}
