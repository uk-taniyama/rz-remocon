import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  editorRemoconConfigSchema,
  remoconConfigSchema,
  TAB_KEY_NAME,
} from "../api";
import {
  writeDefaultRemoconEditorJson,
  writeDefaultRemoconJson,
} from "./default-remocon";

describe("default-remocon", () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const dir of dirs.splice(0))
      rmSync(dir, { recursive: true, force: true });
  });

  it("生成した remocon.json がスキーマを通る", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "rz-default-"));
    dirs.push(dir);
    const file = writeDefaultRemoconJson(path.join(dir, "data"));
    const json = JSON.parse(readFileSync(file, "utf8"));

    expect(remoconConfigSchema.safeParse(json).success).toBe(true);
  });

  it("先頭がタブで、キーがはみ出さない（タブ表示になる）", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "rz-default-"));
    dirs.push(dir);
    const file = writeDefaultRemoconJson(path.join(dir, "data"));
    const { keys, grid } = remoconConfigSchema.parse(
      JSON.parse(readFileSync(file, "utf8")),
    );

    expect(keys[0].name).toBe(TAB_KEY_NAME);
    for (const key of keys) {
      expect(key.x + key.w).toBeLessThanOrEqual(grid.columns);
    }
  });

  it("出力先に remocon.json と remocon.editor.json を書き出す（なければ作る）", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "rz-default-"));
    dirs.push(dir);
    const outDir = path.join(dir, "data");

    const remoconFile = writeDefaultRemoconJson(outDir);
    const editorFile = writeDefaultRemoconEditorJson(outDir);

    expect(remoconFile).toBe(path.join(outDir, "remocon.json"));
    expect(editorFile).toBe(path.join(outDir, "remocon.editor.json"));
    expect(
      remoconConfigSchema.safeParse(
        JSON.parse(readFileSync(remoconFile, "utf8")),
      ).success,
    ).toBe(true);
    expect(
      editorRemoconConfigSchema.safeParse(
        JSON.parse(readFileSync(editorFile, "utf8")),
      ).success,
    ).toBe(true);
  });
});
