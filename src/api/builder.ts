import { defaultColorResolver } from "./colors";
import {
  isSpecialKey,
  LABEL_KEY_NAME,
  type RemoteKey,
  TAB_KEY_NAME,
} from "./remote-keys";
import {
  DEFAULT_BACKGROUND,
  type EditorRemoconConfig,
  type RemoconConfig,
  type RemoteKeyConfig,
} from "./schema";

/**
 * Builder 内部でキーを組み立てるための中間データ。
 *
 * - color は decorator や overrides で決定できるよう、未設定を許容する。
 * - showLabel は label の文字列を保持したまま、表示するかどうかを管理する。
 * - x / y は配置時に決まるため、draft の生成時点では仮の値を使用する。
 * - 最終的な出力形式への変換時に showLabel を解決する。
 */
export type RemoteKeyDraft = Omit<RemoteKeyConfig, "color"> & {
  color?: string;
  showLabel?: boolean;
};

/** キーに適用する上書き指定。座標 x / y は自動配置専用のため変更できない。 */
export type RemoteKeyOverrides = Partial<Omit<RemoteKeyDraft, "x" | "y">>;

/**
 * 操作キーの定義から、Builder 用の draft を生成する。
 *
 * - 幅と高さは 1 キー分の unit、座標は配置前の仮の値とする。
 *
 * @param key - 操作キーの定義。
 * @param unit - 1 キー分のセル数。
 */
export function createRemoteKeyDraft(
  key: RemoteKey,
  unit: number,
): RemoteKeyDraft {
  return {
    name: key.name,
    code: key.code,
    // showLabel が未指定の場合は decorator に判断を委ねる。
    label: key.label,
    showLabel: key.showLabel,
    x: 0,
    y: 0,
    w: unit,
    h: unit,
  };
}

/** キーを更新する関数。*/
export type RemoteKeyDecorator = (key: RemoteKeyDraft) => RemoteKeyDraft;

/**  色を付けるdecorator。 */
const colorDecorator: RemoteKeyDecorator = (key) => {
  const color = key.color ?? defaultColorResolver(key.name);
  return { ...key, color };
};

/**
 * Builder が内部で保持するキー情報。
 *
 * - 出力用のキー設定に、ラベルの表示状態を管理する showLabel を加えたもの。
 */
type BuilderKey = RemoteKeyConfig & { showLabel: boolean };

/**
 * draft に overrides を適用し、Builder 内部で保持するキーを生成する。
 *
 * 値の優先順位は overrides、decorator 適用後の draft、既定値の順。
 * ただし showLabel は、明示的な showLabel の指定、label の指定、
 * draft の showLabel の順で表示状態を決定する。
 *
 * - showLabel が未指定なら true として扱う。
 * - label が undefined なら、showLabel にかかわらず表示しない。
 * - color が未設定なら fallbackColor を使用する。
 */
function resolveKey(
  draft: RemoteKeyDraft,
  overrides: RemoteKeyOverrides[],
  fallbackColor: string,
): BuilderKey {
  const given: RemoteKeyOverrides = Object.assign({}, ...overrides);
  const merged = { ...draft, ...given };
  const showLabel =
    "showLabel" in given
      ? given.showLabel
      : "label" in given
        ? given.label !== undefined
        : draft.showLabel;
  return {
    ...merged,
    color: merged.color ?? fallbackColor,
    showLabel: (showLabel ?? true) && merged.label !== undefined,
  };
}

/** Builder の生成オプション。 */
export interface RemoconBuilderOptions {
  /** グリッドの列数。出力の grid.columns に反映する。 */
  columns: number;
  /** 1 キー分のセル数。出力の grid.unit に反映する。省略時は 4。 */
  unit?: number;
  /** リモコン全体の背景色。省略時は DEFAULT_BACKGROUND を使用する。 */
  background?: string;
  /** キーを更新する関数。省略時は何もしない。 */
  decorator?: RemoteKeyDecorator;
}

/** 1 キー分のセル数の既定値。 */
const DEFAULT_UNIT = 4;
/**
 * リモコン設定を組み立てる Builder。
 *
 * キーを順番に追加し、グリッドへの自動配置や値の補完を行う。
 * build() は表示用、buildEditor() は編集用の設定を生成する。
 */
export class RemoconBuilder {
  /** 次の配置位置。 */
  private cursorX = 0;
  private cursorY = 0;

  /** 現在の行の最大高さ。 */
  private rowHeight = 0;

  /** 配置済みのキー。 */
  private keys: BuilderKey[] = [];

  /** 既定値を補完したオプション。 */
  private readonly opts: Required<RemoconBuilderOptions>;

  constructor(options: RemoconBuilderOptions) {
    this.opts = {
      columns: options.columns,
      unit: options.unit ?? DEFAULT_UNIT,
      background: options.background ?? DEFAULT_BACKGROUND,
      decorator: options.decorator ?? colorDecorator,
    };
  }

  /**
   * キーを現在の位置に配置する。
   *
   * - 行に収まらない場合は改行する。
   * - グリッド幅を超えるキーはエラーにする。
   */
  private place(key: BuilderKey): this {
    if (key.w > this.opts.columns) {
      throw new Error(
        `キー ${key.name} の幅（${key.w}）がグリッドの幅（${this.opts.columns}）を超えています`,
      );
    }
    if (this.cursorX > 0 && this.cursorX + key.w > this.opts.columns) {
      this.newline();
    }
    key.x = this.cursorX;
    key.y = this.cursorY;

    this.keys.push(key);
    this.cursorX += key.w;
    this.rowHeight = Math.max(this.rowHeight, key.h);
    return this;
  }

  /**
   * 操作キーを追加する。
   *
   * = decorator 適用後に overrides を適用する。
   * - 未設定の color は背景色で補完する。
   * - x / y は自動配置するため、overrides では指定できない。
   * - 特殊キーは追加できない。
   *
   * @param remoteKey - 追加する操作キー。
   * @param overrides - キーの上書き指定。後の指定を優先する。
   */
  add(remoteKey: RemoteKey, ...overrides: RemoteKeyOverrides[]): this {
    if (isSpecialKey(remoteKey.name)) {
      throw new Error(`不正な名前です: ${remoteKey.name}`);
    }
    const draft = this.opts.decorator(
      createRemoteKeyDraft(remoteKey, this.opts.unit),
    );
    return this.place(resolveKey(draft, overrides, this.opts.background));
  }

  /**
   * タブを追加する。
   *
   * - 最初のタブはキーを追加する前に呼び出す必要がある。
   * - 配置後は改行する。
   *
   * @param label - タブに表示する文字列。
   * @param color - 背景色。省略時は既定色を使用する。
   */
  tab(label: string, color?: string): this {
    const hasTab = this.keys.some((key) => key.name === TAB_KEY_NAME);
    if (!hasTab && this.keys.length > 0) {
      throw new Error("tabは一番最初に呼んでください。");
    }
    const tab = {
      name: TAB_KEY_NAME,
      showLabel: true,
      x: 0,
      y: 0,
      w: this.opts.columns,
      h: this.opts.unit,
    };
    const draft = this.opts.decorator({ ...tab, label, color });
    const key = resolveKey(draft, [tab], DEFAULT_BACKGROUND);
    this.place(key);
    return this.newline();
  }

  /**
   * 表示用ラベルを追加する。
   *
   * @param text - 表示する文字列。
   * @param overrides - 幅・高さ・色などの上書き指定。
   */
  label(text: string, ...overrides: RemoteKeyOverrides[]): this {
    const draft: RemoteKeyDraft = {
      name: LABEL_KEY_NAME,
      label: text,
      code: "",
      x: 0,
      y: 0,
      w: this.opts.unit,
      h: this.opts.unit,
    };
    return this.place(resolveKey(draft, overrides, this.opts.background));
  }

  /**
   * カタログにないキーを追加する。
   *
   * - 既定では name をラベルに設定するが、ラベルは表示しない。
   * - 特殊キー名（`$` で始まる名前）は指定できない。
   *
   * @param name - キー名。
   * @param code - キーコード。空文字列の場合は操作コードを持たない。
   * @param overrides - キーの上書き指定。
   */
  addCustom(
    name: string,
    code: string,
    ...overrides: RemoteKeyOverrides[]
  ): this {
    return this.add(
      { name, code, label: name, showLabel: false },
      ...overrides,
    );
  }

  /**
   * 次の行の先頭へ移動する。
   *
   * - 移動量は h、現在の行の最大高さ、unit の順に決定する。
   *
   * @param h - Y 方向の移動量。省略時または 0 の場合は自動計算する。
   */
  newline(h?: number): this {
    this.cursorX = 0;
    this.cursorY += h || this.rowHeight || this.opts.unit;
    this.rowHeight = 0;
    return this;
  }

  /**
   * キーを配置せず、カーソルを右へ移動する。
   *
   * @param w - 空ける幅（セル単位）。省略時は unit。
   */
  spacer(w = this.opts.unit): this {
    this.cursorX += w;
    return this;
  }

  /**
   * 表示用の設定を生成する。
   *
   * - showLabel が false のキーは label を undefined にする。
   */
  build(): RemoconConfig {
    return {
      version: 1,
      grid: { columns: this.opts.columns, unit: this.opts.unit },
      background: this.opts.background,
      keys: this.keys.map(({ showLabel, ...key }) => ({
        ...key,
        label: showLabel ? key.label : undefined,
      })),
    };
  }

  /**
   * 編集用の設定を生成する。
   *
   * - ラベル文字列を保持し、追加順に id を割り当てる。
   * - 特殊キーの code は undefined にする。
   */
  buildEditor(): EditorRemoconConfig {
    return {
      version: 1,
      grid: { columns: this.opts.columns, unit: this.opts.unit },
      background: this.opts.background,
      keys: this.keys.map((key, i) => ({
        ...key,
        id: `k${i + 1}`,
        code: isSpecialKey(key.name) ? undefined : key.code,
      })),
    };
  }
}

/**
 * リモコン設定を組み立てる Builder を生成する。
 *
 * @param options - グリッド幅や背景色、キーの既定値などの設定。
 */
export function remoteKeysBuilder(options: RemoconBuilderOptions) {
  return new RemoconBuilder(options);
}
