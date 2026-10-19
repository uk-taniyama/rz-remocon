/*
 * エディタのグリッド（GridStack）上のキーを、読み取り・配置・移動する処理。
 * 描画（React のコンポーネントやフック）は使用せず、GridStack の React 版の型のみを import する。
 * カタログ（追加できるキーの一覧）は、editor-catalog.ts で管理する。
 */
import type { GridStack } from "gridstack";
import type { GridStackNode, GridStackWidget } from "gridstack/dist/react";
import { nanoid } from "nanoid";
import {
  type EditorRemoteKeyConfig,
  isSpecialKey,
  type RemoteKeyKind,
  TAB_KEY_NAME,
} from "../../api";

/** 1キーのセル数。 */
export const UNIT = 4;
/** グリッドの幅に並べるキーの数。 */
export const KEY_COLUMNS = 5;
/** グリッドの幅（セル数）。 */
export const GRID_COLUMNS = KEY_COLUMNS * UNIT;
/** リサイズで縮められる最小サイズ（1セル = 1rem）。実用上は 2 で足りるが、実装上の下限は 1 にしている。 */
export const MIN_SIZE = 1;

/** ウィジェットに色が設定されていない場合に使用する色（通常は使用されない）。 */
export const FALLBACK_COLOR = "#94a3b8";

/**
 * GridStack のウィジェットに設定する、描画コンポーネントの名前。
 * このファイルには名前の定数のみを定義する。描画の対応表（EditorView の COMPONENTS）は、この名前をキーとして持つ必要がある。
 */
export const EDITOR_KEY_COMPONENT = "EditorKeyView";

/**
 * エディタ内のキー。保存形式（remocon.editor.json のキー）と同じ型。
 * code は追加時にカタログからコピーし、グリッドの props に保持する。
 * color は常に持つ（追加時にカタログの既定色をコピーし、以後は編集できる）。
 */
export type EditorKey = EditorRemoteKeyConfig;

/** ウィジェットの `props` に保持する、キーの表示に関するデータ。 */
export type EditorKeyProps = Pick<
  EditorKey,
  "name" | "code" | "label" | "showLabel" | "icon" | "color"
>;

/** カタログの項目。エディタに追加できるキー1個分の、初期値を表す。 */
export interface RemoteKeyCatalogEntry {
  kind: RemoteKeyKind;
  name: string;
  code?: string;
  icon?: string;
  label: string;
  showLabel: boolean;
  color: string;
  w: number;
  h: number;
}

/** ウィジェットを追加する関数（React 版の addWidget も、GridStack の addWidget も指定できる）。 */
export type AddWidget = (widget: GridStackWidget) => unknown;

/* -------------------------------------------------------------------------- */
/* 読み取りと変換                                                             */
/* -------------------------------------------------------------------------- */

/**
 * キーの種類ごとの制約。エディタの操作（プロパティ欄、ドラッグ、読み込み）は、すべてこの制約に従う。
 * - タブ: 行の全幅を使用する見出し。x / w / h は固定で、ラベルは常に表示する
 *   （描画側がタブバーの表示名に使用するため）。
 * - 先頭のタブ（y = 0 のタブ）: 描画側は「先頭がタブ」の場合にのみタブ表示にするため、
 *   y も 0 に固定する。全幅のため、固定すれば他のキーがその上に入ることもない。
 * - 特殊キー（タブ・ラベル）: 送信しないため、コードを持たない。
 */
export interface KeyRules {
  /** x を 0 に固定する。 */
  fixedX: boolean;
  /** 幅を全幅に固定する。 */
  fixedW: boolean;
  /** y を現在の位置に固定する（動かせない）。 */
  fixedY: boolean;
  /** 高さを UNIT に固定する。 */
  fixedH: boolean;
  /** 「ラベルを表示する」を常に true にする（切り替えを許可しない）。 */
  alwaysShowLabel: boolean;
  /** コードを持つか（false の場合は CODE 欄を表示しない）。 */
  hasCode: boolean;
}

/** 制約のない、通常のキーの制約。 */
export const DEFAULT_RULES: KeyRules = {
  fixedX: false,
  fixedY: false,
  fixedW: false,
  fixedH: false,
  alwaysShowLabel: false,
  hasCode: true,
};

/** キーの種類（名前）に応じた制約を返す。 */
export function getKeyRules(editorKey: EditorKey): KeyRules {
  const { name } = editorKey;
  if (name === TAB_KEY_NAME) {
    return {
      fixedX: true,
      fixedY: editorKey.y === 0,
      fixedW: true,
      fixedH: true,
      alwaysShowLabel: true,
      hasCode: false,
    };
  }
  if (isSpecialKey(name)) return { ...DEFAULT_RULES, hasCode: false };
  return DEFAULT_RULES;
}

/**
 * キーを削除してよいかを判定する。削除の操作（タイルの×、プロパティ欄の削除）は、必ずこの判定を通す。
 * y が固定のキー（先頭のタブ）は、他のタブが存在する間は削除できない。
 * 削除すると先頭がタブでなくなり、タブ表示が崩れるため。
 */
export function canRemoveEditorKey(
  editorKeys: EditorKey[],
  editorKey: EditorKey,
): boolean {
  if (!getKeyRules(editorKey).fixedY) return true;
  return !editorKeys.some(
    (key) => key.name === TAB_KEY_NAME && key.id !== editorKey.id,
  );
}

/** 制約に反する値を、制約に合う値に修正する。読み込み時（古いデータ）と追加時に適用する。 */
export function normalizeEditorKey(editorKey: EditorKey): EditorKey {
  const rules = getKeyRules(editorKey);
  return {
    ...editorKey,
    x: rules.fixedX ? 0 : editorKey.x,
    w: rules.fixedW ? GRID_COLUMNS : editorKey.w,
    h: rules.fixedH ? UNIT : editorKey.h,
    showLabel: rules.alwaysShowLabel ? true : editorKey.showLabel,
  };
}

/** エディタのキーを、GridStack のウィジェットに変換する。制約に応じて、移動やリサイズの可否も設定する。 */
export function editorKeyToWidget(rawEditorKey: EditorKey): GridStackWidget {
  const editorKey = normalizeEditorKey(rawEditorKey);
  const rules = getKeyRules(editorKey);
  return {
    ...(rules.fixedW || rules.fixedH ? { noResize: true } : {}),
    // y が固定のキー（先頭のタブ）は移動できない。locked は、他のキーに押し出されることも防ぐ。
    ...(rules.fixedY ? { noMove: true, locked: true } : {}),
    id: editorKey.id,
    x: editorKey.x,
    y: editorKey.y,
    w: editorKey.w,
    h: editorKey.h,
    minW: MIN_SIZE,
    minH: MIN_SIZE,
    component: EDITOR_KEY_COMPONENT,
    props: {
      name: editorKey.name,
      code: editorKey.code,
      label: editorKey.label,
      showLabel: editorKey.showLabel,
      icon: editorKey.icon,
      color: editorKey.color,
    } satisfies EditorKeyProps,
  };
}

/** GridStack のノードから、ウィジェットの props（キーの表示に関するデータ）を取り出す。 */
export function getNodeProps(
  node: object | undefined,
): Partial<EditorKeyProps> {
  return ((node as GridStackWidget | undefined)?.props ??
    {}) as Partial<EditorKeyProps>;
}

/** GridStack のノードを、エディタのキーに変換する。 */
export function nodeToEditorKey(node: GridStackNode): EditorKey {
  const props = getNodeProps(node);
  return {
    id: String(node.id),
    name: props.name ?? "",
    code: props.code,
    x: node.x ?? 0,
    y: node.y ?? 0,
    w: node.w ?? 1,
    h: node.h ?? 1,
    label: props.label,
    showLabel: props.showLabel ?? false,
    icon: props.icon,
    color: props.color ?? FALLBACK_COLOR,
  };
}

/** グリッドに配置されているキーを、すべて読み取る。状態の正は grid（gridstack）であり、React 側には複製を持たず、必要なときにここから読み取る。 */
export function readEditorKeys(
  grid: GridStack | null | undefined,
): EditorKey[] {
  if (!grid) return [];
  return grid.engine.nodes.map(nodeToEditorKey);
}

/* -------------------------------------------------------------------------- */
/* 位置の操作                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * キーが1つも配置されていない「空の行」を取り除き、下にあるキーを上へ詰める。
 * x / w / h は変更せず、y だけをずらす。
 * （grid.compact() は各キーを最初の空きに置き直すため、x まで変わる可能性がある）
 */
export function removeEmptyRows(grid: GridStack) {
  const nodes = [...grid.engine.nodes].sort(
    (a, b) => (a.y ?? 0) - (b.y ?? 0) || (a.x ?? 0) - (b.x ?? 0),
  );

  // キーが少しでもかかっている行を集め、新しい行番号（0, 1, 2, …）に対応づける。
  const covered = new Set<number>();
  for (const node of nodes) {
    const y = node.y ?? 0;
    const h = node.h ?? 1;
    for (let row = y; row < y + h; row++) covered.add(row);
  }
  const newRow = new Map(
    [...covered].sort((a, b) => a - b).map((row, index) => [row, index]),
  );

  // 上にあるキーから順に移動する。変更をまとめて反映し、change イベントは1回だけ発火させる。
  // 途中で例外が出ても、バッチ状態のままにしない。
  grid.batchUpdate();
  try {
    for (const node of nodes) {
      const y = node.y ?? 0;
      const next = newRow.get(y);
      if (next !== undefined && next !== y && node.el) {
        grid.update(node.el, { y: next });
      }
    }
  } finally {
    grid.batchUpdate(false);
  }
}

/**
 * 既存のキーを、すべて rows セル分だけ下へずらす。キー同士の相対的な位置は変えない。
 *
 * GridStack は、移動先に別のキーがある場合、そのキーを押し出す（batchUpdate を使用しても同様）。
 * 移動の途中で node.y を読み取ると、押し出された後の値を読み取って、二重にずれてしまう。
 * そのため、移動後の y を先にすべて決めておき、下にあるキーから順に移動する。
 */
export function shiftEditorKeysDown(
  grid: GridStack | null | undefined,
  rows: number,
) {
  if (!grid) return;
  const targets = grid.engine.nodes
    .flatMap((node) =>
      node.el ? [{ el: node.el, y: (node.y ?? 0) + rows }] : [],
    )
    .sort((a, b) => b.y - a.y);

  // 途中で例外が出ても、バッチ状態のままにしない。
  grid.batchUpdate();
  try {
    for (const { el, y } of targets) {
      grid.update(el, { y });
    }
  } finally {
    grid.batchUpdate(false);
  }
}

/* -------------------------------------------------------------------------- */
/* 配置                                                                       */
/* -------------------------------------------------------------------------- */

/** カタログの項目から、エディタのキーを生成する。id は新規に採番し、位置は仮の値（0, 0）にする。 */
export function createEditorKey(entry: RemoteKeyCatalogEntry): EditorKey {
  return {
    id: nanoid(),
    name: entry.name,
    code: entry.code,
    x: 0,
    y: 0,
    w: entry.w,
    h: entry.h,
    label: entry.label,
    showLabel: entry.showLabel,
    icon: entry.icon,
    color: entry.color,
  };
}

/**
 * 新しいキーを配置する位置を求める。
 * 最後のキーの右側に収まる場合はその位置、収まらない場合は次の行の先頭を返す。
 *
 * @param editorKeys - 現在のキー。
 * @param width - 追加するキーの幅（セル）。
 */
export function findNextEditorKeySlot(editorKeys: EditorKey[], width: number) {
  // NOTE 追加時の配置は単純に、末尾の右側か、次の行にする。
  if (editorKeys.length === 0) {
    return { x: 0, y: 0 };
  }

  const lastEditorKey = editorKeys.reduce((last, editorKey) => {
    if (editorKey.y > last.y) return editorKey;
    if (editorKey.y === last.y && editorKey.x > last.x) return editorKey;
    return last;
  });

  const right = lastEditorKey.x + lastEditorKey.w;
  if (right + width <= GRID_COLUMNS) {
    return { x: right, y: lastEditorKey.y };
  }

  const y = Math.max(
    ...editorKeys.map((editorKey) => editorKey.y + editorKey.h),
  );
  return { x: 0, y };
}

/**
 * キーをグリッドの先頭（y = 0）に挿入し、その id を返す。
 * 既存のキーは、挿入したキーの高さの分だけ、相対的な位置を保ったまま下がる。
 * x は 0 にし、幅と高さは entry に従う。
 */
export function placeEditorKeyAtTop(
  grid: GridStack | null | undefined,
  addWidget: AddWidget,
  entry: RemoteKeyCatalogEntry,
): string {
  const editorKey = createEditorKey(entry);
  editorKey.x = 0;
  editorKey.y = 0;

  shiftEditorKeysDown(grid, editorKey.h);
  addWidget(editorKeyToWidget(editorKey));
  return editorKey.id;
}

/**
 * キーをグリッドに追加し、その id を返す。キーの追加は、必ずこの関数を通す。
 * - タブが1つもない状態でタブを追加する場合: 先頭に挿入し、既存のキーを下へずらす。
 * - それ以外の場合: 空いている位置（末尾の右側か、次の行）に配置する。
 */
export function placeEditorKey(
  grid: GridStack | null | undefined,
  addWidget: AddWidget,
  entry: RemoteKeyCatalogEntry,
): string {
  const editorKeys = readEditorKeys(grid);
  const isFirstTab =
    entry.name === TAB_KEY_NAME &&
    !editorKeys.some((key) => key.name === TAB_KEY_NAME);
  if (isFirstTab) {
    return placeEditorKeyAtTop(grid, addWidget, entry);
  }

  const editorKey = createEditorKey(entry);
  const slot = findNextEditorKeySlot(editorKeys, entry.w);
  editorKey.x = slot.x;
  editorKey.y = slot.y;

  addWidget(editorKeyToWidget(editorKey));
  return editorKey.id;
}
