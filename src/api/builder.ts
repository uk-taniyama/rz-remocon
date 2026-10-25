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
 * 操作キーの設定を組み立てる際に使用する中間データ。
 *
 * - {@link RemoconBuilder} 内で {@link RemoteKey} を編集可能な形式に変換する。
 * - `color` は `decorator` や `overrides` で後から決定できるよう、未設定を許容する。
 * - `showLabel` は `label` の文字列を保持したまま、表示するかどうかを管理する。最終的な出力形式への変換時に解決する。
 * - `x` / `y` は配置時に決まるため、`draft` の生成時点では仮の値を使用する。
 */
export type RemoteKeyDraft = Omit<RemoteKeyConfig, "color"> & {
  color?: string;
  showLabel?: boolean;
};

/**
 * 操作キーの設定に適用する上書き指定。
 *
 * - 座標 `x` / `y` は自動配置専用のため変更できない。
 */
export type RemoteKeyOverrides = Partial<Omit<RemoteKeyDraft, "x" | "y">>;

/**
 * @internal
 * {@link RemoconBuilder} が内部で保持するキー情報。
 */
export type RemoteKeyEntry = RemoteKeyConfig & { showLabel: boolean };

/**
 * @internal
 * 操作キーの定義{@link RemoteKey} から、{@link RemoteKeyDraft} を生成する。
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
    label: key.label,
    showLabel: key.showLabel,
    x: 0,
    y: 0,
    w: unit,
    h: unit,
  };
}

/**
 * 操作キーの設定を更新する関数の型。
 *
 *  - キーの色などを共通のルールで変更する。
 */
export type RemoteKeyDecorator = (key: RemoteKeyDraft) => RemoteKeyDraft;

/**
 * デフォルトの色を設定するデコレーター。
 */
const colorDecorator: RemoteKeyDecorator = (key) => {
  const color = key.color ?? defaultColorResolver(key.name);
  return { ...key, color };
};

// TODO 優先順位の見直しが必要。
/**
 * {@link RemoteKeyDraft} に {@link RemoteKeyOverrides} を適用し、{@link RemoteKeyEntry} に変換する。
 *
 * 値の優先順位は `overrides`、`decorator` 適用後の `draft`、既定値の順。
 * ただし `showLabel` は、明示的な `showLabel` の指定、`label` の指定、
 * `draft` の `showLabel` の順で表示状態を決定する。
 *
 * - `showLabel` が未指定なら `true` として扱う。
 * - `label` が `undefined` なら、`showLabel` にかかわらず表示しない。
 * - `color` が未設定なら `fallbackColor` を使用する。
 *
 * @param draft - 変換元のキー情報。
 * @param overrides - 適用する上書き指定。後の指定ほど優先される。
 * @param fallbackColor - 色が未設定の場合に使用する色。
 */
function resolveKey(
  draft: RemoteKeyDraft,
  overrides: RemoteKeyOverrides[],
  fallbackColor: string,
): RemoteKeyEntry {
  const given: RemoteKeyOverrides = Object.assign({}, ...overrides);
  const merged = { ...draft, ...given };
  // TODO どういうルールがいい？
  // 1. `overrides` で `showLabel` が明示されていれば、その値を使う。
  // 2. `showLabel` の指定がなく、`overrides` で `label` が指定されていれば、`label` が `undefined` でないかどうかで決める。
  // 3. どちらもなければ、`draft` の `showLabel` を使う。
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

/** {@link RemoconBuilder} の生成オプション。 */
export interface RemoconBuilderOptions {
  /** グリッドの幅（セル数）。 */
  columns: number;
  /** 1 キー分のセル数。省略時は 4。 */
  unit?: number;
  /** リモコン全体の背景色。省略時は {@link DEFAULT_BACKGROUND} を使用する。 */
  background?: string;
  /** 各キーの設定を更新する関数。 */
  decorator?: RemoteKeyDecorator;
}

/** 1 キー分のセル数の既定値。 */
const DEFAULT_UNIT = 4;

/**
 * リモコン設定を組み立てる Builder。
 *
 * - キーを順番に追加し、グリッドへの自動配置や値の補完を行う。
 * - 座標とサイズは、すべてセル単位で指定する。
 * - 1 セルは、文字 1 つ分の大きさを想定する。
 * - `unit` は 1 キー分のセル数で、既定値は 4。
 *   - 1 キーに 4 文字ほど書ける大きさになる。
 *   - キーの半分（2 セル）や 1/4（1 セル）の単位で指定可能となり、柔軟にレイアウトできる。
 * - 1 キーの標準サイズは `unit` × `unit` セル。
 * - `columns` はグリッドの幅（セル数）。`unit` の倍数にすると、キーが隙間なく並ぶ。
 * - `build()` は表示用、`buildEditor()` は編集用の設定を生成する。
 *
 * @remarks
 * {@link remoconBuilder} で生成すること。
 */
export class RemoconBuilder {
  /** 次の配置位置。 */
  private cursorX = 0;
  private cursorY = 0;

  /** 現在の行の最大高さ。 */
  private rowHeight = 0;

  /** 配置済みのキー。 */
  private keys: RemoteKeyEntry[] = [];

  /** 既定値を補完したオプション。 */
  private readonly opts: Required<RemoconBuilderOptions>;

  /** @internal */
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
  private place(key: RemoteKeyEntry): this {
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
   * - `remoteKey` は {@link RemoteKeys} の値（例：`RemoteKeys.powerOn`）を指定可能。
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

  //  TODO 何を指定させよう？？？nameいらん？？いる？？？
  /**
   * カスタム操作キーを追加する。
   *
   * - 特殊キー名（`$` で始まる名前）は指定できない。
   *
   * @param name - キー名。
   * @param code - キーコード。空文字列の場合はキーコードを持たない。
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
   * タブを追加する。
   *
   * - 他のキーを追加する前（最初）に呼び出す必要がある。
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

    // tabとして必須な情報
    const tab: RemoteKeyDraft = {
      name: TAB_KEY_NAME,
      showLabel: true,
      x: 0,
      y: 0,
      w: this.opts.columns,
      h: this.opts.unit,
    };
    // 共通的な色とかを適用するために、いったんdecoratorを通す。
    const draft = this.opts.decorator({ ...tab, label, color });
    // draftを変換する。このとき、tabで必須な情報は上書きする。
    const key = resolveKey(draft, [tab], DEFAULT_BACKGROUND);
    // 配置後改行する。
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
    const label: RemoteKeyDraft = {
      name: LABEL_KEY_NAME,
      label: text,
      code: undefined,
      x: 0,
      y: 0,
      w: this.opts.unit,
      h: this.opts.unit,
    };
    const draft = this.opts.decorator(label);
    const key = resolveKey(draft, overrides, this.opts.background);
    return this.place({ ...key, showLabel: true });
  }

  /**
   * 次の行の先頭へ移動する。
   *
   * @param h - Y 方向の移動量（セル単位）。省略時または 0 の場合は自動計算する。
   */
  newline(h?: number): this {
    this.cursorX = 0;
    this.cursorY += h || this.rowHeight || this.opts.unit;
    this.rowHeight = 0;
    return this;
  }

  /**
   * カーソルを右へ移動する。
   *
   * @param w - 空ける幅（セル単位）。省略時は 1 キー分のセル数を使用する。
   */
  spacer(w = this.opts.unit): this {
    this.cursorX += w;
    return this;
  }

  /**
   * 表示用の設定を生成する。
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
   */
  buildEditor(): EditorRemoconConfig {
    return {
      version: 1,
      grid: { columns: this.opts.columns, unit: this.opts.unit },
      background: this.opts.background,
      keys: this.keys.map((key, i) => ({
        ...key,
        id: `id${i + 1}`,
        code: isSpecialKey(key.name) ? undefined : key.code,
      })),
    };
  }
}

/**
 * {@link RemoconBuilder} を生成する。
 *
 * @param options - オプション。
 * @returns リモコン設定を組み立てる Builder。
 */
export function remoconBuilder(options: RemoconBuilderOptions) {
  return new RemoconBuilder(options);
}
