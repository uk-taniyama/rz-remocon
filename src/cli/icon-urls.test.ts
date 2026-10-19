import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { parseIconUrls } from "../api";
import {
  buildPreviewHtml,
  commandIconUrls,
  DEFAULT_APP_DOMAINS,
  faviconUrl,
  loadDomains,
} from "./icon-urls";

describe("faviconUrl", () => {
  it("大きさとドメインを付けた、Google の favicon の URL を作る", () => {
    expect(faviconUrl("netflix.com", 128)).toBe(
      "https://www.google.com/s2/favicons?sz=128&domain=netflix.com",
    );
  });

  it("ドメインは URL エンコードする", () => {
    expect(faviconUrl("a.example/x y", "64")).toContain(
      "domain=a.example%2Fx%20y",
    );
  });
});

describe("buildPreviewHtml", () => {
  it("名前ごとに、アイコンと名前の行を作る", () => {
    const html = buildPreviewHtml({ appYoutube: "https://e.example/y.png" });

    expect(html).toContain('<img src="https://e.example/y.png"');
    expect(html).toContain("appYoutube</li>");
  });

  it("名前と URL はエスケープする", () => {
    const html = buildPreviewHtml({ 'my"app<': "https://e.example/?a=1&b=2" });

    expect(html).toContain("my&quot;app&lt;</li>");
    expect(html).toContain("a=1&amp;b=2");
    expect(html).not.toContain('my"app<');
  });
});

describe("loadDomains / commandIconUrls", () => {
  let dir: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "icon-urls-"));
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it("表のファイルがなければ、標準の表を返す", () => {
    expect(loadDomains(path.join(dir, "none.json"))).toEqual(
      DEFAULT_APP_DOMAINS,
    );
  });

  it("文字列以外の値や、オブジェクトでない JSON は、エラーにする", () => {
    const file = path.join(dir, "bad.json");
    fs.writeFileSync(file, JSON.stringify({ appA: 1 }));
    expect(() => loadDomains(file)).toThrow("名前 → ドメインの表");

    fs.writeFileSync(file, JSON.stringify(["a.com"]));
    expect(() => loadDomains(file)).toThrow("名前 → ドメインの表");
  });

  it("outputDir の app-domains.json を読み、icon-urls.json と icon-urls.html を書き出す", () => {
    fs.writeFileSync(
      path.join(dir, "app-domains.json"),
      JSON.stringify({ appX: "x.example" }),
    );

    commandIconUrls({ outputDir: dir, size: "64" });

    const urls = JSON.parse(
      fs.readFileSync(path.join(dir, "icon-urls.json"), "utf8"),
    );
    expect(urls).toEqual({
      appX: "https://www.google.com/s2/favicons?sz=64&domain=x.example",
    });
    expect(fs.readFileSync(path.join(dir, "icon-urls.html"), "utf8")).toContain(
      "appX</li>",
    );
  });

  it("表がなければ標準の表で作る。作った icon-urls.json は、アイコンの検証を全部通る", () => {
    const out = path.join(dir, "nested", "data");

    commandIconUrls({ outputDir: out, size: "128" });

    const { urls, errors } = parseIconUrls(
      JSON.parse(fs.readFileSync(path.join(out, "icon-urls.json"), "utf8")),
    );
    expect(errors).toEqual([]);
    expect(Object.keys(urls)).toEqual(Object.keys(DEFAULT_APP_DOMAINS));
  });

  it("domains で、表のファイルを指定できる", () => {
    const file = path.join(dir, "mine.json");
    fs.writeFileSync(file, JSON.stringify({ appY: "y.example" }));

    commandIconUrls({ outputDir: dir, domains: file, size: "32" });

    expect(
      Object.keys(
        JSON.parse(fs.readFileSync(path.join(dir, "icon-urls.json"), "utf8")),
      ),
    ).toEqual(["appY"]);
  });

  it("size が正の整数でなければ、書き出さずにエラーにする", () => {
    for (const size of ["0", "-1", "1.5", "abc", ""]) {
      expect(() => commandIconUrls({ outputDir: dir, size })).toThrow("--size");
    }
    expect(fs.existsSync(path.join(dir, "icon-urls.json"))).toBe(false);
  });
});
