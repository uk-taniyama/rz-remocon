import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { findCssFile } from "./assets";

describe("findCssFile", () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const dir of dirs.splice(0))
      rmSync(dir, { recursive: true, force: true });
  });

  // publicDir/index.html（ビューア）が参照する CSS を用意する。ファイル名は、index-*.css でなくてもよい。
  const publicWith = (html: string) => {
    const dir = mkdtempSync(path.join(tmpdir(), "rz-public-"));
    dirs.push(dir);
    mkdirSync(path.join(dir, "assets"));
    writeFileSync(path.join(dir, "index.html"), html);
    return dir;
  };

  it("ビューアの index.html が読む CSS を返す（web-*.css でもよい）", () => {
    const dir = publicWith(
      '<html><head><script type="module" crossorigin src="/assets/index-abc.js"></script><link rel="stylesheet" crossorigin href="/assets/web-DWLXfdWN.css"></head></html>',
    );

    expect(findCssFile(dir)).toBe("web-DWLXfdWN.css");
  });

  it("stylesheet が無い、または複数あるときは例外", () => {
    expect(() => findCssFile(publicWith("<html></html>"))).toThrow();
    expect(() =>
      findCssFile(
        publicWith(
          '<link rel="stylesheet" href="/assets/a.css"><link rel="stylesheet" href="/assets/b.css">',
        ),
      ),
    ).toThrow();
  });
});
