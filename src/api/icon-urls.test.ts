import { describe, expect, it } from "vitest";
import { isIconUrl, parseIconUrls } from "./icon-urls";

describe("isIconUrl", () => {
  it.each([
    ["logo.svg"],
    ["icons/logo.svg"],
    ["/logo.svg"],
    ["./logo.svg"],
    ["../logo.svg"],
    ["https://example.com/a.svg"],
    ["http://example.com/a.png"],
    ["HTTPS://example.com/a.svg"],
    ["//example.com/a.svg"],
    ["/日本語/ロゴ.svg"],
    ["/a b.svg"],
    ["data:image/svg+xml;base64,PHN2Zz48L3N2Zz4="],
    ["data:image/png;base64,AAAA"],
  ])("使える: %s", (url) => {
    expect(isIconUrl(url)).toBe(true);
  });

  it.each([
    ["javascript:alert(1)"],
    ["JaVaScRiPt:alert(1)"],
    [" javascript:alert(1)"],
    ["java\tscript:alert(1)"],
    ["data:text/html,<script>1</script>"],
    ["file:///etc/passwd"],
    ["ftp://example.com/a.svg"],
    ["vbscript:x"],
    [""],
    ["   "],
  ])("使えない: %j", (url) => {
    expect(isIconUrl(url)).toBe(false);
  });
});

describe("parseIconUrls", () => {
  it("使える項目はすべて表に入れる。エラーはなし", () => {
    const table = {
      logo: "logo.svg",
      nhk: "https://example.com/nhk.svg",
      rel: "./icons/a.svg",
    };
    expect(parseIconUrls(table)).toEqual({ urls: table, errors: [] });
  });

  it("空の表は、空の表", () => {
    expect(parseIconUrls({})).toEqual({ urls: {}, errors: [] });
  });

  it("不正な項目だけを飛ばし、残りは使う（表全体を捨てない）", () => {
    const { urls, errors } = parseIconUrls({
      ok: "/a.svg",
      bad: "javascript:alert(1)",
      num: 1,
      alsoOk: "b.svg",
    });
    expect(urls).toEqual({ ok: "/a.svg", alsoOk: "b.svg" });
    expect(errors).toHaveLength(2);
    expect(errors[0]).toContain("bad");
    expect(errors[1]).toContain("num");
  });

  it("オブジェクトでない JSON は、空の表と1件のエラー", () => {
    for (const value of [[], "x", 1, null, true]) {
      const { urls, errors } = parseIconUrls(value);
      expect(urls).toEqual({});
      expect(errors).toHaveLength(1);
    }
  });

  it("空の名前と __proto__ は、エラーにして表に入れない", () => {
    const { urls, errors } = parseIconUrls(
      JSON.parse('{"": "/a.svg", "__proto__": "/b.svg", "logo": "/logo.svg"}'),
    );
    expect(urls).toEqual({ logo: "/logo.svg" });
    expect(Object.getPrototypeOf(urls)).toBe(Object.prototype);
    expect(errors).toHaveLength(2);
  });
});
