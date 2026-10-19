import { describe, expect, it, vi } from "vitest";
import { ICON_URLS_URL, loadIconUrls } from "./useIconUrls";

const respond = (body: unknown, init?: ResponseInit) =>
  (async () =>
    new Response(
      typeof body === "string" ? body : JSON.stringify(body),
      init,
    )) as typeof fetch;

describe("loadIconUrls", () => {
  it("/data/icon-urls.json を、キャッシュなしで取得する", async () => {
    const fetcher = vi.fn(respond({ logo: "logo.svg" }));
    await expect(loadIconUrls(fetcher)).resolves.toEqual({
      urls: { logo: "logo.svg" },
      warnings: [],
    });
    expect(fetcher).toHaveBeenCalledWith(ICON_URLS_URL, { cache: "no-store" });
    expect(ICON_URLS_URL).toBe("/data/icon-urls.json");
  });

  it("404 は空の表。警告もなし", async () => {
    await expect(
      loadIconUrls(respond("not found", { status: 404 })),
    ).resolves.toEqual({ urls: {}, warnings: [] });
  });

  it("サーバーエラー、JSON でない、通信失敗は、空の表と警告", async () => {
    const serverError = await loadIconUrls(respond("x", { status: 500 }));
    expect(serverError.urls).toEqual({});
    expect(serverError.warnings).toHaveLength(1);

    const notJson = await loadIconUrls(respond("<html></html>"));
    expect(notJson.urls).toEqual({});
    expect(notJson.warnings).toHaveLength(1);

    const failed = await loadIconUrls((async () => {
      throw new TypeError("Failed to fetch");
    }) as typeof fetch);
    expect(failed.urls).toEqual({});
    expect(failed.warnings[0]).toContain("Failed to fetch");
  });

  it("不正な項目は飛ばして警告し、使える項目は使う", async () => {
    const result = await loadIconUrls(
      respond({
        ok: "icons/a.svg",
        bad1: "javascript:alert(1)",
        bad2: "file:///a.svg",
      }),
    );
    expect(result.urls).toEqual({ ok: "icons/a.svg" });
    expect(result.warnings).toHaveLength(2);
    expect(result.warnings[0]).toContain("bad1");
    expect(result.warnings[1]).toContain("bad2");
  });
});
