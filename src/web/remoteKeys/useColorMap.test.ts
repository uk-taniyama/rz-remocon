import { describe, expect, it, vi } from "vitest";
import { COLOR_MAP_URL, loadColorMap } from "./useColorMap";

const respond = (body: unknown, init?: ResponseInit) =>
  (async () =>
    new Response(
      typeof body === "string" ? body : JSON.stringify(body),
      init,
    )) as typeof fetch;

describe("loadColorMap", () => {
  it("/data/color-map.json を、キャッシュなしで取得する", async () => {
    const fetcher = vi.fn(respond({ powerOn: "#112233" }));
    await expect(loadColorMap(fetcher)).resolves.toEqual({
      colors: { powerOn: "#112233" },
      warnings: [],
    });
    expect(fetcher).toHaveBeenCalledWith(COLOR_MAP_URL, { cache: "no-store" });
    expect(COLOR_MAP_URL).toBe("/data/color-map.json");
  });

  it("404 は空の表。警告もなし", async () => {
    await expect(
      loadColorMap(respond("not found", { status: 404 })),
    ).resolves.toEqual({ colors: {}, warnings: [] });
  });

  it("サーバーエラー、JSON でない、通信失敗は、空の表と警告", async () => {
    const serverError = await loadColorMap(respond("x", { status: 500 }));
    expect(serverError.colors).toEqual({});
    expect(serverError.warnings).toHaveLength(1);

    const notJson = await loadColorMap(respond("<html></html>"));
    expect(notJson.colors).toEqual({});
    expect(notJson.warnings).toHaveLength(1);

    const failed = await loadColorMap((async () => {
      throw new TypeError("Failed to fetch");
    }) as typeof fetch);
    expect(failed.colors).toEqual({});
    expect(failed.warnings[0]).toContain("Failed to fetch");
  });

  it("不正な項目は飛ばして警告し、使える項目は使う", async () => {
    const result = await loadColorMap(
      respond({ ok: "#ff0000", bad1: "red", bad2: "#fff" }),
    );
    expect(result.colors).toEqual({ ok: "#ff0000" });
    expect(result.warnings).toHaveLength(2);
    expect(result.warnings[0]).toContain("bad1");
    expect(result.warnings[1]).toContain("bad2");
  });
});
