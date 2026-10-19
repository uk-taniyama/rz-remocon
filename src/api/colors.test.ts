import { describe, expect, it } from "vitest";
import {
  createColorResolver,
  defaultColorMap,
  mergeColorMap,
  parseColorMap,
} from "./colors";

describe("parseColorMap", () => {
  it("名前と #RRGGBB の表を受け入れる（キー名・kind）", () => {
    expect(
      parseColorMap({
        powerOn: "#112233",
        media: "#AABBCC",
        etc: "#000000",
      }),
    ).toEqual({
      colors: { powerOn: "#112233", media: "#AABBCC", etc: "#000000" },
      errors: [],
    });
  });

  it("JSON のオブジェクトでなければ、空の表とエラー", () => {
    for (const value of [null, [], "x", 1]) {
      const result = parseColorMap(value);
      expect(result.colors).toEqual({});
      expect(result.errors).toHaveLength(1);
    }
  });

  it("不正な項目は飛ばしてエラーに記録し、正常な項目は残す", () => {
    const result = parseColorMap({
      ok: "#ff0000",
      short: "#fff",
      named: "red",
      num: 1,
      "": "#000000",
    });
    expect(result.colors).toEqual({ ok: "#ff0000" });
    expect(result.errors).toHaveLength(4);
    expect(result.errors.join("\n")).toContain("short");
    expect(result.errors.join("\n")).toContain("named");
    expect(result.errors.join("\n")).toContain("num");
  });

  it("__proto__ は使えない名前", () => {
    const result = parseColorMap(JSON.parse('{"__proto__": "#000000"}'));
    expect(result.errors).toHaveLength(1);
    expect(Object.keys(result.colors)).toEqual([]);
  });
});

describe("mergeColorMap", () => {
  it("標準の色に重ね、同じ名前は上書きする", () => {
    const resolve = createColorResolver(
      mergeColorMap({ powerOn: "#111111", media: "#222222" }),
    );
    expect(resolve("powerOn")).toBe("#111111");
    // kind の上書きは、その kind のキーに効く（キー個別の指定がなければ）。
    expect(resolve("mediaPlay")).toBe("#222222");
  });

  it("空の表なら、標準の色と同じ", () => {
    expect(mergeColorMap({})).toEqual(defaultColorMap);
  });

  it("どの接頭辞にも当たらない名前は、etc の色になる", () => {
    const resolve = createColorResolver(mergeColorMap({ etc: "#123456" }));
    expect(resolve("customKey")).toBe("#123456");
  });
});

describe("defaultColorMap", () => {
  it("DEFAULT 以外は、そのまま color-map.json として読める（default-color-map コマンドの出力）", () => {
    const { DEFAULT: _, ...colors } = defaultColorMap;
    expect(parseColorMap(JSON.parse(JSON.stringify(colors)))).toEqual({
      colors,
      errors: [],
    });
  });
});
