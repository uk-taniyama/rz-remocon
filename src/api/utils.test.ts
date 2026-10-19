import { describe, expect, it } from "vitest";
import type { EditorRemoconConfig } from "./schema";
import { parseNameTable, toRemoconConfig } from "./utils";

const editor: EditorRemoconConfig = {
  version: 1,
  grid: { columns: 20, unit: 4 },
  background: "#112233",
  keys: [
    {
      id: "a",
      name: "powerOn",
      code: "40BF7E",
      x: 0,
      y: 0,
      w: 4,
      h: 4,
      label: "電源ON",
      showLabel: true,
      icon: undefined,
      color: "#ef4444",
    },
    {
      id: "b",
      name: "volUp",
      code: "40BF1A",
      x: 4,
      y: 0,
      w: 4,
      h: 4,
      label: "音量＋",
      showLabel: false,
      icon: "volUp",
      color: "#f59e0b",
    },
  ],
};

describe("toRemoconConfig", () => {
  it("表示用の形に変換する（id は持たない）", () => {
    const config = toRemoconConfig(editor);

    expect(config.version).toBe(1);
    expect(config.grid).toEqual({ columns: 20, unit: 4 });
    expect(config.background).toBe("#112233");
    expect(config.keys[0]).not.toHaveProperty("id");
    expect(config.keys[0]).toMatchObject({
      name: "powerOn",
      code: "40BF7E",
      x: 0,
      y: 0,
      w: 4,
      h: 4,
      color: "#ef4444",
    });
  });

  it("showLabel が false のキーは、ラベルを省く", () => {
    const config = toRemoconConfig(editor);

    expect(config.keys[0].label).toBe("電源ON");
    expect(config.keys[1].label).toBeUndefined();
    expect(config.keys[1].icon).toBe("volUp");
  });
});

describe("toRemoconConfig（特殊キー）", () => {
  it("タブ・ラベルは code を落とす（押せないキーになる）", () => {
    const config = toRemoconConfig({
      ...editor,
      keys: [
        {
          id: "t",
          name: "$TAB$",
          code: "40BF7E",
          x: 0,
          y: 0,
          w: 20,
          h: 4,
          label: "メイン",
          showLabel: true,
          color: "#111111",
        },
      ],
    });

    expect(config.keys[0].code).toBeUndefined();
    expect(config.keys[0].label).toBe("メイン");
  });

  it("表示用キーを上から左の順に並べ、同じ位置ではタブを先にする", () => {
    const config = toRemoconConfig({
      ...editor,
      keys: [
        {
          ...editor.keys[0],
          id: "later",
          name: "volUp",
          x: 4,
          y: 4,
        },
        {
          ...editor.keys[0],
          id: "tab",
          name: "$TAB$",
          x: 0,
          y: 0,
        },
        {
          ...editor.keys[0],
          id: "first",
          name: "powerOn",
          x: 0,
          y: 0,
        },
      ],
    });

    expect(config.keys.map((key) => key.name)).toEqual([
      "$TAB$",
      "powerOn",
      "volUp",
    ]);
  });
});

describe("parseNameTable", () => {
  const labels = { table: "名前と数の表", value: "数" };
  const toNumber = (value: string) =>
    Number.isNaN(Number(value))
      ? { error: `数ではありません: ${value}` }
      : { value: Number(value) };

  it("値を変換した表を返し、変換に失敗した項目は飛ばしてエラーにする", () => {
    expect(parseNameTable({ a: "1", b: "x", c: 3 }, labels, toNumber)).toEqual({
      table: { a: 1 },
      errors: ["b: 数ではありません: x", "c: 数は文字列で指定してください"],
    });
  });

  it("オブジェクトでない入力は、空の表と1件のエラー", () => {
    expect(parseNameTable([], labels, toNumber)).toEqual({
      table: {},
      errors: ["名前と数の表（JSON のオブジェクト）ではありません"],
    });
  });
});
