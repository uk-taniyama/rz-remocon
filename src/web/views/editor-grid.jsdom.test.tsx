import { GridStack } from "gridstack";
import type { GridStackWidget } from "gridstack/dist/react";
import { describe, expect, it } from "vitest";
import {
  GRID_COLUMNS,
  placeEditorKey,
  placeEditorKeyAtTop,
  type RemoteKeyCatalogEntry,
  readEditorKeys,
  removeEmptyRows,
  shiftEditorKeysDown,
  UNIT,
} from "./editor-grid";

type Box = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** キー名（EditorKey.name）。省略した場合は、名前なしになる。 */
  name?: string;
};

function makeGrid(boxes: Box[]): GridStack {
  document.body.innerHTML = '<div id="g" class="grid-stack"></div>';
  const grid = GridStack.init(
    { column: GRID_COLUMNS, mode: "float", cellHeight: 10, animate: false },
    "#g",
  );
  if (!grid) {
    throw new Error("GridStack を初期化できない");
  }
  for (const { name, ...box } of boxes) {
    // props は、React 版の GridStackWidget にのみ存在する。いったん変数に代入して、型の違いを回避する。
    const widget: GridStackWidget = {
      ...box,
      content: box.id,
      props: { name },
    };
    grid.addWidget(widget);
  }
  return grid;
}

const ys = (grid: GridStack) =>
  Object.fromEntries(
    grid.engine.nodes.map((node) => [String(node.id), [node.x, node.y]]),
  );

const entry = (name: string, w = UNIT, h = UNIT): RemoteKeyCatalogEntry => ({
  kind: "other" as RemoteKeyCatalogEntry["kind"],
  name,
  label: name,
  showLabel: true,
  color: "#ffffff",
  w,
  h,
});

/** 画面の例: 全幅のキーの下に、2つのキーが並んでいる。 */
const SCREEN_EXAMPLE: Box[] = [
  { id: "wide", x: 0, y: 0, w: GRID_COLUMNS, h: UNIT },
  { id: "power", x: 0, y: UNIT, w: UNIT, h: UNIT },
  { id: "custom", x: UNIT, y: UNIT, w: UNIT, h: UNIT },
];

describe("shiftEditorKeysDown", () => {
  it("全キーを、相対の位置を保って下げる", () => {
    const grid = makeGrid(SCREEN_EXAMPLE);

    shiftEditorKeysDown(grid, UNIT);

    expect(ys(grid)).toEqual({
      wide: [0, 4],
      power: [0, 8],
      custom: [4, 8],
    });
  });

  it("キーの間に隙間があっても、上下の関係を保つ", () => {
    const grid = makeGrid([
      { id: "wide", x: 0, y: 0, w: GRID_COLUMNS, h: UNIT },
      { id: "custom", x: UNIT, y: UNIT, w: UNIT, h: UNIT },
      { id: "power", x: 0, y: 2 * UNIT, w: UNIT, h: UNIT },
    ]);

    shiftEditorKeysDown(grid, UNIT);

    expect(ys(grid)).toEqual({
      wide: [0, 4],
      custom: [4, 8],
      power: [0, 12],
    });
  });

  it("grid がなければ、何もしない", () => {
    expect(() => shiftEditorKeysDown(null, UNIT)).not.toThrow();
  });
});

describe("placeEditorKeyAtTop", () => {
  it("幅いっぱいのキーを y=0 に入れ、既存のキーは相対の位置を保って下がる", () => {
    const grid = makeGrid(SCREEN_EXAMPLE);

    const id = placeEditorKeyAtTop(
      grid,
      (w) => grid.addWidget(w),
      entry("$TAB$", GRID_COLUMNS),
    );

    const top = readEditorKeys(grid).find((k) => k.id === id);
    expect(top).toMatchObject({ x: 0, y: 0, w: GRID_COLUMNS, h: UNIT });
    expect(ys(grid)).toMatchObject({
      wide: [0, 4],
      power: [0, 8],
      custom: [4, 8],
    });
  });

  it("キーが1つもなくても入る", () => {
    const grid = makeGrid([]);

    const id = placeEditorKeyAtTop(
      grid,
      (w) => grid.addWidget(w),
      entry("$TAB$", GRID_COLUMNS),
    );

    expect(readEditorKeys(grid)).toMatchObject([{ id, x: 0, y: 0 }]);
  });
});

describe("placeEditorKey", () => {
  it("最後のキーの右の空きに入れる", () => {
    const grid = makeGrid([{ id: "a", x: 0, y: 0, w: UNIT, h: UNIT }]);

    const id = placeEditorKey(grid, (w) => grid.addWidget(w), entry("b"));

    expect(readEditorKeys(grid).find((k) => k.id === id)).toMatchObject({
      x: UNIT,
      y: 0,
    });
  });
});

describe("placeEditorKey（タブ）", () => {
  it("最初のタブは、先頭に入り、既存のキーが下がる", () => {
    const grid = makeGrid(SCREEN_EXAMPLE);

    const id = placeEditorKey(
      grid,
      (w) => grid.addWidget(w),
      entry("$TAB$", GRID_COLUMNS),
    );

    expect(readEditorKeys(grid).find((k) => k.id === id)).toMatchObject({
      x: 0,
      y: 0,
    });
    expect(ys(grid)).toMatchObject({ wide: [0, 4], power: [0, 8] });
  });

  it("タブが既にあれば、2つ目は末尾に入る（既存のキーは動かない）", () => {
    const grid = makeGrid([
      { id: "tab", name: "$TAB$", x: 0, y: 0, w: GRID_COLUMNS, h: UNIT },
      { id: "power", x: 0, y: UNIT, w: UNIT, h: UNIT },
    ]);

    const id = placeEditorKey(
      grid,
      (w) => grid.addWidget(w),
      entry("$TAB$", GRID_COLUMNS),
    );

    expect(readEditorKeys(grid).find((k) => k.id === id)).toMatchObject({
      x: 0,
      y: 2 * UNIT,
    });
    expect(ys(grid)).toMatchObject({ tab: [0, 0], power: [0, 4] });
  });
});

describe("placeEditorKey（タブ以外は、全幅にも先頭にもならない）", () => {
  it("既存のキーがあっても、幅は entry のまま", () => {
    const grid = makeGrid(SCREEN_EXAMPLE);

    const id = placeEditorKey(
      grid,
      (w) => grid.addWidget(w),
      entry("powerToggle"),
    );

    expect(readEditorKeys(grid).find((k) => k.id === id)).toMatchObject({
      w: UNIT,
      h: UNIT,
    });
  });

  it("既存のキーは動かず、新しいキーは先頭（y=0）に入らない", () => {
    const grid = makeGrid(SCREEN_EXAMPLE);
    const before = ys(grid);

    const id = placeEditorKey(
      grid,
      (w) => grid.addWidget(w),
      entry("powerToggle"),
    );

    expect(readEditorKeys(grid).find((k) => k.id === id)?.y).not.toBe(0);
    expect(ys(grid)).toMatchObject(before);
  });
});

describe("placeEditorKey（最初のタブ）: 既存のキーは一律に下がる", () => {
  it("既存のキーは、x / w / h が変わらず、y だけが entry.h 下がる", () => {
    const grid = makeGrid([
      { id: "a", x: 0, y: 0, w: UNIT, h: UNIT },
      { id: "b", x: UNIT, y: 2 * UNIT, w: 2 * UNIT, h: UNIT },
      { id: "c", x: 0, y: 5 * UNIT, w: UNIT, h: 2 * UNIT },
    ]);
    const before = Object.fromEntries(
      readEditorKeys(grid).map((k) => [k.id, k]),
    );

    const tabId = placeEditorKey(
      grid,
      (w) => grid.addWidget(w),
      entry("$TAB$", GRID_COLUMNS, UNIT),
    );

    const after = readEditorKeys(grid);
    for (const [id, old] of Object.entries(before)) {
      const now = after.find((k) => k.id === id);
      expect(now).toMatchObject({
        x: old.x,
        w: old.w,
        h: old.h,
        y: old.y + UNIT,
      });
    }
    expect(after.find((k) => k.id === tabId)).toMatchObject({ x: 0, y: 0 });
  });
});

describe("removeEmptyRows", () => {
  const rowsOf = (grid: GridStack) =>
    Object.fromEntries(
      readEditorKeys(grid).map((k) => [
        k.id,
        { x: k.x, y: k.y, w: k.w, h: k.h },
      ]),
    );

  it("キーのない行を取り除き、下のキーを上へ詰める", () => {
    const grid = makeGrid([
      { id: "a", x: 0, y: 0, w: UNIT, h: UNIT },
      { id: "b", x: 0, y: 2 * UNIT, w: UNIT, h: UNIT },
    ]);

    removeEmptyRows(grid);

    expect(ys(grid)).toEqual({ a: [0, 0], b: [0, UNIT] });
  });

  it("詰めるときは、x / w / h を変えない", () => {
    const grid = makeGrid([
      { id: "a", x: 0, y: 0, w: UNIT, h: UNIT },
      { id: "b", x: UNIT, y: 3 * UNIT, w: 2 * UNIT, h: 2 * UNIT },
    ]);
    const before = rowsOf(grid);

    removeEmptyRows(grid);

    const after = rowsOf(grid);
    for (const [id, old] of Object.entries(before)) {
      expect(after[id]).toMatchObject({ x: old.x, w: old.w, h: old.h });
    }
  });

  it("高さが2行以上のキーは、掛かっている行をすべて残す", () => {
    // セル 0〜7 を a が、セル 16〜23 を b が占める。セル 8〜15 は空いている。
    const grid = makeGrid([
      { id: "a", x: 0, y: 0, w: UNIT, h: 2 * UNIT },
      { id: "b", x: 0, y: 4 * UNIT, w: UNIT, h: 2 * UNIT },
    ]);

    removeEmptyRows(grid);

    // 占められているセル 0〜7 は動かず、セル 16〜23 は 8〜15 へ詰められる。
    expect(ys(grid)).toEqual({ a: [0, 0], b: [0, 2 * UNIT] });
  });

  it("空の行がなければ、何も動かさない", () => {
    const grid = makeGrid([
      { id: "a", x: 0, y: 0, w: UNIT, h: UNIT },
      { id: "b", x: 0, y: UNIT, w: UNIT, h: UNIT },
    ]);
    const before = ys(grid);

    removeEmptyRows(grid);

    expect(ys(grid)).toEqual(before);
  });

  it("キーが1つもなければ、例外を出さない", () => {
    const grid = makeGrid([]);

    expect(() => removeEmptyRows(grid)).not.toThrow();
  });
});
