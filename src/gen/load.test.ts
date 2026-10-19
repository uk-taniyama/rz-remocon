import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  defaultIconUrlsPath,
  loadColorMapFile,
  loadIconUrlsFile,
} from "./load";

describe("icon-urls.json の読み込み（load）", () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const dir of dirs.splice(0))
      rmSync(dir, { recursive: true, force: true });
  });
  const tmp = () => {
    const dir = mkdtempSync(path.join(tmpdir(), "rz-icons-"));
    dirs.push(dir);
    return dir;
  };

  it("既定の場所は、入力の remocon.json と同じディレクトリ", () => {
    expect(defaultIconUrlsPath("data/remocon.json")).toBe(
      path.resolve("data/icon-urls.json"),
    );
    expect(defaultIconUrlsPath("/x/y/remocon.json")).toBe(
      path.join("/x/y", "icon-urls.json"),
    );
  });

  it("あれば表を返す", () => {
    const file = path.join(tmp(), "icon-urls.json");
    writeFileSync(file, JSON.stringify({ logo: "/logo.svg" }));
    expect(loadIconUrlsFile(file, true)).toEqual({ logo: "/logo.svg" });
    expect(loadIconUrlsFile(file, false)).toEqual({ logo: "/logo.svg" });
  });

  it("既定の場所になければ空の表。指定したのになければ例外", () => {
    const file = path.join(tmp(), "icon-urls.json");
    expect(loadIconUrlsFile(file, false)).toEqual({});
    expect(() => loadIconUrlsFile(file, true)).toThrow(
      /アイコン設定を読み込めません/,
    );
  });

  it("JSON でないときは、既定の場所でも例外", () => {
    const broken = path.join(tmp(), "broken.json");
    writeFileSync(broken, "{");
    expect(() => loadIconUrlsFile(broken, false)).toThrow(
      /アイコン設定を読み込めません/,
    );
  });

  it("不正な項目は、警告して飛ばし、使える項目は使う", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const file = path.join(tmp(), "icon-urls.json");
      writeFileSync(
        file,
        JSON.stringify({ ok: "logo.svg", bad1: "file:///a.svg", bad2: 1 }),
      );
      expect(loadIconUrlsFile(file, true)).toEqual({ ok: "logo.svg" });
      expect(warn).toHaveBeenCalledTimes(1);
      expect(String(warn.mock.calls[0][0])).toMatch(/bad1[\s\S]*bad2/);
    } finally {
      warn.mockRestore();
    }
  });

  it("先頭に / が付かない相対パスも読める", () => {
    const file = path.join(tmp(), "icon-urls.json");
    writeFileSync(file, JSON.stringify({ a: "logo.svg", b: "icons/b.svg" }));
    expect(loadIconUrlsFile(file, true)).toEqual({
      a: "logo.svg",
      b: "icons/b.svg",
    });
  });
});

describe("color-map.json の読み込み（loadColorMapFile）", () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const dir of dirs.splice(0))
      rmSync(dir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });
  const tmp = () => {
    const dir = mkdtempSync(path.join(tmpdir(), "rz-colors-"));
    dirs.push(dir);
    return dir;
  };

  it("あれば表を返す", () => {
    const file = path.join(tmp(), "color-map.json");
    writeFileSync(file, JSON.stringify({ powerOn: "#112233" }));
    expect(loadColorMapFile(file, true)).toEqual({ powerOn: "#112233" });
    expect(loadColorMapFile(file, false)).toEqual({ powerOn: "#112233" });
  });

  it("既定の場所になければ空の表。指定したのになければ例外", () => {
    const file = path.join(tmp(), "color-map.json");
    expect(loadColorMapFile(file, false)).toEqual({});
    expect(() => loadColorMapFile(file, true)).toThrow(
      /色設定を読み込めません/,
    );
  });

  it("JSON でないときは、既定の場所でも例外", () => {
    const broken = path.join(tmp(), "broken.json");
    writeFileSync(broken, "{");
    expect(() => loadColorMapFile(broken, false)).toThrow(
      /色設定を読み込めません/,
    );
  });

  it("不正な項目は警告を出して飛ばし、正常な項目は返す", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const file = path.join(tmp(), "color-map.json");
    writeFileSync(file, JSON.stringify({ ok: "#ff0000", bad: "red" }));
    expect(loadColorMapFile(file, true)).toEqual({ ok: "#ff0000" });
    expect(warn).toHaveBeenCalledOnce();
    expect(String(warn.mock.calls[0][0])).toContain("bad");
  });
});
