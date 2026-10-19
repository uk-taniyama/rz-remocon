import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { parseColorMap } from "../api";
import { buildDefaultColorMapJson, commandDefaultColorMap } from "./color-map";

describe("default-color-map コマンド", () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const dir of dirs.splice(0))
      fs.rmSync(dir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });
  const tmp = () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rz-colormap-"));
    dirs.push(dir);
    return dir;
  };

  it("出力は、そのまま color-map.json として読め、DEFAULT を含まない", () => {
    const json: unknown = JSON.parse(buildDefaultColorMapJson());
    const { colors, errors } = parseColorMap(json);
    expect(errors).toEqual([]);
    expect(colors).toHaveProperty("power");
    expect(colors).not.toHaveProperty("DEFAULT");
  });

  it("出力先に color-map.json を書き出す（ディレクトリがなくても作る）", () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const dir = path.join(tmp(), "data");
    commandDefaultColorMap({ outputDir: dir });
    expect(fs.readFileSync(path.join(dir, "color-map.json"), "utf8")).toBe(
      buildDefaultColorMapJson(),
    );
  });

  it("すでにあるときは、上書きせずにエラー。force なら上書きする", () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const dir = tmp();
    const file = path.join(dir, "color-map.json");
    fs.writeFileSync(file, '{"power":"#000000"}');

    expect(() => commandDefaultColorMap({ outputDir: dir })).toThrow(/--force/);
    expect(fs.readFileSync(file, "utf8")).toBe('{"power":"#000000"}');

    commandDefaultColorMap({ outputDir: dir, force: true });
    expect(fs.readFileSync(file, "utf8")).toBe(buildDefaultColorMapJson());
  });
});
