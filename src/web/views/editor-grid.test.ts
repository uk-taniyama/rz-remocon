import type { GridStackNode } from "gridstack";
import { describe, expect, it } from "vitest";
import { TAB_KEY_NAME, toRemoconConfig } from "../../api";
import {
  canRemoveEditorKey,
  type EditorKey,
  editorKeyToWidget,
  findNextEditorKeySlot,
  GRID_COLUMNS,
  getKeyRules,
  nodeToEditorKey,
  normalizeEditorKey,
  UNIT,
} from "./editor-grid";

const key = (x: number, y: number, w = UNIT, h = UNIT): EditorKey => ({
  id: `${x}-${y}`,
  name: "custom",
  x,
  y,
  w,
  h,
  showLabel: false,
  color: "#000000",
});

describe("findNextEditorKeySlot", () => {
  it("キーがなければ、左上", () => {
    expect(findNextEditorKeySlot([], UNIT)).toEqual({ x: 0, y: 0 });
  });

  it("最後のキーの右が空いていれば、そこ", () => {
    expect(findNextEditorKeySlot([key(0, 0)], UNIT)).toEqual({
      x: UNIT,
      y: 0,
    });
  });

  it("右に入らなければ、いちばん下の次の行の左端", () => {
    const row = Array.from({ length: GRID_COLUMNS / UNIT }, (_, i) =>
      key(i * UNIT, 0),
    );

    expect(findNextEditorKeySlot(row, UNIT)).toEqual({ x: 0, y: UNIT });
  });
});

describe("getKeyRules / normalizeEditorKey（タブ）", () => {
  it("タブは x / 幅 / 高さを固定し、ラベルを常に表示し、コードを持たない", () => {
    expect(getKeyRules({ ...key(0, UNIT), name: TAB_KEY_NAME })).toEqual({
      fixedX: true,
      fixedY: false,
      fixedW: true,
      fixedH: true,
      alwaysShowLabel: true,
      hasCode: false,
    });
  });

  it("古いデータのタブも、全幅・ラベル表示に直る（y と色は保つ）", () => {
    const tab: EditorKey = {
      ...key(8, 12, 4, 8),
      name: TAB_KEY_NAME,
      showLabel: false,
    };

    expect(normalizeEditorKey(tab)).toEqual({
      ...tab,
      x: 0,
      w: GRID_COLUMNS,
      h: UNIT,
      showLabel: true,
    });
  });

  it("タブ以外は変えない", () => {
    const normal = key(8, 12, 4, 8);

    expect(normalizeEditorKey(normal)).toEqual(normal);
    expect(getKeyRules({ ...key(0, 0), name: "powerOn" }).hasCode).toBe(true);
    expect(getKeyRules({ ...key(0, 0), name: "$_LABEL$" }).hasCode).toBe(false);
  });
});

describe("getKeyRules（先頭のタブ）", () => {
  const tab = (y: number): EditorKey => ({
    ...key(0, y, GRID_COLUMNS),
    name: TAB_KEY_NAME,
  });

  it("y = 0 のタブだけ、y も固定される", () => {
    expect(getKeyRules(tab(0)).fixedY).toBe(true);
    expect(getKeyRules(tab(UNIT)).fixedY).toBe(false);
  });

  it("タブ以外は y = 0 でも固定されない", () => {
    expect(getKeyRules(key(0, 0)).fixedY).toBe(false);
  });
});

describe("canRemoveEditorKey", () => {
  const tab = (y: number): EditorKey => ({
    ...key(0, y, GRID_COLUMNS),
    id: `tab-${y}`,
    name: TAB_KEY_NAME,
  });

  it("先頭のタブは、他のタブがあると消せない", () => {
    expect(canRemoveEditorKey([tab(0), tab(UNIT)], tab(0))).toBe(false);
  });

  it("先頭のタブでも、他のタブがなければ消せる", () => {
    expect(canRemoveEditorKey([tab(0), key(0, UNIT)], tab(0))).toBe(true);
  });

  it("先頭以外のタブと、普通のキーは消せる", () => {
    expect(canRemoveEditorKey([tab(0), tab(UNIT)], tab(UNIT))).toBe(true);
    expect(canRemoveEditorKey([tab(0), key(0, UNIT)], key(0, UNIT))).toBe(true);
  });
});

describe("icon の保持", () => {
  // エディタに icon の編集 UI はないが、手書きや Builder で設定した名前・URL は、開いて保存し直しても保持される。
  it.each([["logo"], ["/logo.svg"], ["powerOn"]])(
    "icon: %s は、読み込み → 保存の経路で変わらない",
    (icon) => {
      const original: EditorKey = { ...key(0, 4), icon };

      const widget = editorKeyToWidget(original);
      const restored = nodeToEditorKey({
        ...widget,
        id: original.id,
      } as GridStackNode);
      expect(restored.icon).toBe(icon);

      const remocon = toRemoconConfig({
        version: 1,
        grid: { columns: GRID_COLUMNS, unit: UNIT },
        background: "#ffffff",
        keys: [restored],
      });
      expect(remocon.keys[0].icon).toBe(icon);
    },
  );
});
