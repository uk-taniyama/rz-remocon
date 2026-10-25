import { useCallback, useEffect, useRef, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";

export const DEFAULT_COLOR_PRESETS = [
  "#0094ff",
  "#39ff88",
  "#ff4d4f",
  "#faad14",
  "#722ed1",
  "#eb2f96",
  "#13c2c2",
  "#64748b",
  "#0f172a",
  "#334155",
  "#94a3b8",
  "#e2e8f0",
  "#ffffff",
  "#f97316",
  "#84cc16",
  "#06b6d4",
];

/** 最近使った色を `localStorage` に保存するキー。 */
const COLOR_HISTORY_KEY = "editor-color-history";

/** 最近使った色を、`localStorage` から読み込む。読み込めない場合は、空の履歴を返す。 */
function loadColorHistory(): string[] {
  try {
    const saved = window.localStorage.getItem(COLOR_HISTORY_KEY);
    return saved ? (JSON.parse(saved) as string[]) : [];
  } catch {
    return [];
  }
}

/** 最近使った色を、`localStorage` に保存する。 */
function saveColorHistory(colors: string[]) {
  try {
    window.localStorage.setItem(COLOR_HISTORY_KEY, JSON.stringify(colors));
  } catch {
    // 保存に失敗しても、処理は続行する（無視する）。
  }
}

/**
 * 色を、保存形式（#RRGGBB）に整える。
 * HexColorInput は、3桁（#abc）も有効な入力として返すことがある。スキーマは #RRGGBB のみのため、6桁に展開する。
 */
export function normalizeHexColor(color: string): string {
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(color);
  if (!short) return color;
  const [, r, g, b] = short;
  return `#${r}${r}${g}${g}${b}${b}`;
}

/** `SwatchList` の props。 */
type SwatchListProps = {
  title: string;
  colors: string[];
  selectedColor: string;
  onSelect: (color: string) => void;
};

/** 色の見本を一覧表示し、クリックで色を選択できるようにする。`colors` が空の場合は何も表示しない。 */
function SwatchList({
  title,
  colors,
  selectedColor,
  onSelect,
}: SwatchListProps) {
  if (colors.length === 0) {
    return null;
  }
  return (
    <section className="swatch-list">
      <h3 className="swatch-list__title">{title}</h3>
      <div className="swatch-list__items">
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            className={
              c.toLowerCase() === selectedColor.toLowerCase()
                ? "swatch-list__swatch swatch-list__swatch--selected"
                : "swatch-list__swatch"
            }
            style={{ backgroundColor: c }}
            title={c}
            aria-label={c}
            onClick={() => onSelect(c)}
          />
        ))}
      </div>
    </section>
  );
}

/** `ColorPicker` の props。 */
export type ColorPickerProps = {
  color: string;
  onChange: (color: string) => void;
  presets?: string[];
  history?: string[];
};

/** 色を選択するコンポーネント。色の選択、HEX の入力、プリセットと履歴からの選択ができる。 */
export function ColorPicker({
  color,
  onChange,
  presets = DEFAULT_COLOR_PRESETS,
  history = [],
}: ColorPickerProps) {
  return (
    <div className="color-picker">
      <HexColorPicker color={color} onChange={onChange} />

      <label className="color-picker__hex-field">
        <span className="color-picker__hex-label">HEX</span>
        <HexColorInput
          color={color}
          onChange={onChange}
          prefixed
          className="color-picker__hex-input"
        />
      </label>

      <SwatchList
        title="プリセット"
        colors={presets}
        selectedColor={color}
        onSelect={onChange}
      />
      <SwatchList
        title="最近使った色"
        colors={history}
        selectedColor={color}
        onSelect={onChange}
      />
    </div>
  );
}

/**
 * 最近使った色の履歴を管理するフック。履歴は `localStorage` に保存する。
 *
 * @param limit - 保持する履歴の最大件数。
 * @returns 履歴（新しい順）と、色を履歴に追加する `push` 関数。
 */
export function useColorHistory(limit = 8) {
  const [history, setHistory] = useState<string[]>(loadColorHistory);

  const push = useCallback(
    (color: string) => {
      const value = color.toLowerCase();
      const next = [value, ...history.filter((c) => c !== value)].slice(
        0,
        limit,
      );
      setHistory(next);
      saveColorHistory(next);
    },
    [history, limit],
  );

  return { history, push };
}

/** `ColorPickerDialog` の props。 */
export type ColorPickerDialogProps = {
  initialColor: string;
  presets?: string[];
  /** ダイアログが閉じたときに呼び出される。決定した場合は確定した色、キャンセルした場合は `undefined` が渡される。 */
  onClose: (confirmedColor?: string) => void;
};

/** 色を選択するモーダルダイアログ。決定した色は、最近使った色の履歴に追加する。 */
export function ColorPickerDialog({
  initialColor,
  presets,
  onClose,
}: ColorPickerDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState(initialColor);
  const { history, push } = useColorHistory();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="color-picker-dialog"
      onClose={(event) => {
        // Esc キーで閉じた場合や、引数なしで `close()` を呼んだ場合は、`returnValue` が "" のままになる。
        if (event.currentTarget.returnValue === "") {
          onClose(undefined);
          return;
        }
        const confirmed = normalizeHexColor(draft);
        push(confirmed);
        onClose(confirmed);
      }}
      // ダイアログの外側（背景）のクリックは、キャンセルとして扱う。
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          dialogRef.current.close();
        }
      }}
    >
      <article className="color-picker-dialog__body">
        <header className="color-picker-dialog__header">
          <strong>COLOR</strong>
        </header>
        <ColorPicker
          color={draft}
          presets={presets}
          history={history}
          onChange={setDraft}
        />
        <footer className="color-picker-dialog__footer">
          <button
            type="button"
            className="color-picker-dialog__action color-picker-dialog__action--cancel"
            onClick={() => dialogRef.current?.close()}
          >
            キャンセル
          </button>
          <button
            type="button"
            className="color-picker-dialog__action color-picker-dialog__action--ok"
            onClick={() => dialogRef.current?.close("ok")}
          >
            決定
          </button>
        </footer>
      </article>
    </dialog>
  );
}

/** `ColorPickerButton` の props。履歴はボタン側で管理するため、`history` は指定できない。 */
export type ColorPickerButtonProps = Omit<ColorPickerProps, "history">;

/** 現在の色を表示するボタン。クリックすると `ColorPickerDialog` が開き、決定した色で `onChange` を呼び出す。 */
export function ColorPickerButton({
  color,
  presets,
  onChange,
}: ColorPickerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="secondary outline color-picker-button"
        onClick={() => setIsOpen(true)}
      >
        <span
          className="color-picker-button__swatch"
          style={{ backgroundColor: color }}
        />
        <span className="color-picker-button__hex">{color.toUpperCase()}</span>
      </button>

      {isOpen && (
        <ColorPickerDialog
          initialColor={color}
          presets={presets}
          onClose={(confirmedColor) => {
            setIsOpen(false);
            if (confirmedColor && confirmedColor !== color) {
              onChange(confirmedColor);
            }
          }}
        />
      )}
    </>
  );
}
