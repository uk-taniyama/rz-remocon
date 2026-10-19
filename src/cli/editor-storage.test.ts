import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { EditorRemoconConfig } from "../api";
import {
  configureEditorStorage,
  loadEditorConfig,
  saveEditorConfig,
} from "./editor-storage";

const config = (label: string): EditorRemoconConfig => ({
  version: 1,
  grid: { columns: 20, unit: 4 },
  background: "#ffffff",
  keys: [
    {
      id: "k1",
      name: "custom",
      code: "40BF7E",
      x: 0,
      y: 0,
      w: 4,
      h: 4,
      label,
      showLabel: true,
      color: "#0094ff",
    },
  ],
});

describe("saveEditorConfig のバックアップ", () => {
  let dir: string;
  const bak = () => path.join(dir, "remocon.editor.json.bak");
  const editor = () => path.join(dir, "remocon.editor.json");

  beforeEach(async () => {
    dir = await mkdtemp(path.join(os.tmpdir(), "rz-editor-"));
    configureEditorStorage({ dataDir: dir });
  });
  afterEach(() => rm(dir, { recursive: true, force: true }));

  it("初回の保存では、控えを作らない", async () => {
    const outcome = await saveEditorConfig(null, config("a"));
    expect(outcome.type).toBe("saved");
    await expect(readFile(bak(), "utf8")).rejects.toThrow();
  });

  it("2回目の保存で、直前の内容を控えに残す", async () => {
    const first = await saveEditorConfig(null, config("a"));
    const firstText = await readFile(editor(), "utf8");
    if (first.type !== "saved") throw new Error("saved ではない");

    const second = await saveEditorConfig(first.revision, config("b"));
    expect(second.type).toBe("saved");
    expect(await readFile(bak(), "utf8")).toBe(firstText);
    expect(await readFile(editor(), "utf8")).toContain('"b"');
  });

  it("壊れたファイルを上書きするときも、元の内容を控えに残す", async () => {
    await writeFile(editor(), "{ broken json", "utf8");
    const loaded = await loadEditorConfig();
    expect(loaded.invalid).toBe(true);

    const outcome = await saveEditorConfig(loaded.revision, config("a"));
    expect(outcome.type).toBe("saved");
    expect(await readFile(bak(), "utf8")).toBe("{ broken json");
  });

  it("競合したときは、控えも作らない", async () => {
    await saveEditorConfig(null, config("a"));
    const outcome = await saveEditorConfig("stale", config("b"));
    expect(outcome.type).toBe("conflict");
    await expect(readFile(bak(), "utf8")).rejects.toThrow();
  });
});
