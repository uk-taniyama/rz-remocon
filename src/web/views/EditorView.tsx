import { Utils } from "gridstack";
import "gridstack/dist/gridstack.css";
import {
  type GridItemHTMLElement,
  GridStack,
  type GridStackHandle,
  type GridStackWidget,
  useGridStack,
  useGridStackItem,
} from "gridstack/dist/react";
import {
  type CSSProperties,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  type ApiResult,
  DEFAULT_BACKGROUND,
  keyCodeSchema,
  REMOTE_KEY_KIND_DEFS,
  type RemoteKeyKind,
  TAB_KEY_NAME,
} from "../../api";
import { apiClient } from "../client";
import { ColorPickerButton } from "../color/ColorPicker";
import type { RemoteKeyIconRender } from "../remoteKeys";
import { KeyFace } from "../remoteKeys/KeyFace";
import { sendCode as sendRemoteCode } from "../remoteKeys/useRegzaApi";
import { customKeyEntry, renderCatalogIcon } from "./editor-catalog";
import { type SaveResult, saveEditor, useEditorData } from "./editor-client";
import {
  canRemoveEditorKey,
  DEFAULT_RULES,
  EDITOR_KEY_COMPONENT,
  type EditorKey,
  editorKeyToWidget,
  GRID_COLUMNS,
  getKeyRules,
  getNodeProps,
  MIN_SIZE,
  nodeToEditorKey,
  normalizeEditorKey,
  placeEditorKey,
  type RemoteKeyCatalogEntry,
  readEditorKeys,
  removeEmptyRows,
  UNIT,
} from "./editor-grid";
import { PreviewView } from "./PreviewView";

/** 文字列がキーコードの形式かを判定する。前後の空白は無視する。 */
function isKeyCode(value: string): boolean {
  return keyCodeSchema.safeParse(value.trim()).success;
}

/** キーコードを、保存と送信に使用する形に整える（前後の空白を除き、大文字にする）。 */
function normalizeKeyCode(value: string): string {
  return value.trim().toUpperCase();
}

/* -------------------------------------------------------------------------- */
/* データモデル                                                               */
/* -------------------------------------------------------------------------- */

type EditorKeyPatch = Partial<Omit<EditorKey, "id" | "name">>;

/** キーの更新を反映する関数。反映できた場合は true、gridstack に拒否された場合は false を返す。 */
type UpdateEditorKey = (patch: EditorKeyPatch) => boolean;

/** 保存時にサーバーへ渡す、グリッドの設定。 */
const GRID_SPEC = { columns: GRID_COLUMNS, unit: UNIT };

/**
 * 変更の有無を判定するための、編集内容のスナップショット（文字列）を作る。
 * キーの順序の違いを変更とみなさないよう、id で並べ替えてから文字列化する。
 */
function snapshotOf(editorKeys: EditorKey[], background: string): string {
  return JSON.stringify({
    background,
    keys: [...editorKeys].sort((a, b) => a.id.localeCompare(b.id)),
  });
}

/** 画面に表示する保存の状態。SaveResult に、未操作（idle）と保存中（saving）を加えたもの。 */
type SaveStatus = { type: "idle" } | { type: "saving" } | SaveResult;

/* -------------------------------------------------------------------------- */
/* 共有コンテキスト（選択状態とドラッグ状態のみを持ち、レイアウトは持たない） */
/* -------------------------------------------------------------------------- */

type EditorContextValue = {
  selectedId: string | null;
  isDragging: boolean;
  onSelectId: (id: string | null) => void;
  /** レイアウトが変わったことを通知し、未保存かどうかを再判定する。保存は行わない。 */
  syncDirty: () => void;
  /** アイコンを描画する関数（標準のアイコンと、icon-urls.json の対応表を使用する）。 */
  iconRender: RemoteKeyIconRender;
  /** キーコードを送信し、結果を通信ログに記録する。 */
  sendKey: (code: string) => Promise<void>;
  /** 通信ログ。直近の送信結果を1件だけ保持する。 */
  sendLog?: SendLogEntry;
};

const EditorContext = createContext<EditorContextValue | null>(null);

/** EditorContext の値を取得する。EditorContext の外で呼び出した場合は、エラーを投げる。 */
function useEditorContext() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditorContext must be used within <EditorContext>");
  }
  return context;
}

/* -------------------------------------------------------------------------- */
/* ユーティリティ                                                             */
/* -------------------------------------------------------------------------- */

/** 1rem が実際に何 px かを返す。ルートのフォントサイズが変更されても追従する。 */
export function useRem() {
  const [rem, setRem] = useState(16);

  useLayoutEffect(() => {
    const probe = document.createElement("div");
    probe.style.cssText =
      "position:absolute;visibility:hidden;pointer-events:none;width:1rem;height:0;";
    document.body.appendChild(probe);

    const updateRem = () => setRem(probe.getBoundingClientRect().width);
    updateRem();

    const resizeObserver = new ResizeObserver(updateRem);
    resizeObserver.observe(probe);

    return () => {
      resizeObserver.disconnect();
      probe.remove();
    };
  }, []);

  return rem;
}

/* -------------------------------------------------------------------------- */
/* ウィジェット                                                               */
/* -------------------------------------------------------------------------- */

/**
 * グリッド上に配置する、キー1個分のコンポーネント。`components` マップ経由で描画される。
 * 削除ボタンはタイル内に重ねて配置し、表示の切り替えは CSS（ホバー）で行う。
 */
export function EditorKeyView() {
  const { id, node } = useGridStackItem();
  const { grid } = useGridStack();
  const { selectedId, isDragging, onSelectId, iconRender } = useEditorContext();

  const key = node ? nodeToEditorKey(node) : undefined;
  if (!key) return null;

  const Icon = iconRender(key);
  const label = key.label ?? "";
  const rules = node ? getKeyRules(nodeToEditorKey(node)) : DEFAULT_RULES;
  const removable =
    node != null &&
    canRemoveEditorKey(readEditorKeys(grid), nodeToEditorKey(node));
  const labelVisible = rules.alwaysShowLabel || (key.showLabel ?? false);
  const selected = selectedId === id;
  const color = key.color;
  const isTab = key.name === TAB_KEY_NAME;

  return (
    <div className="key-tile">
      <KeyFace
        role="button"
        tabIndex={0}
        className="key-tile__button"
        color={color}
        tab={isTab}
        selected={selected}
        onClick={() => onSelectId(id)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelectId(id);
          }
        }}
        title={label}
        aria-label={label}
        icon={Icon}
        label={labelVisible ? label : undefined}
      />

      {!isDragging && removable && (
        <div className="key-tile-remove">
          <button
            type="button"
            className="key-tile-remove__button"
            title={`${label}を削除`}
            aria-label={`${label}を削除`}
            onClick={() => {
              if (!node?.el || !removable) return;
              grid?.removeWidget(node.el);
              // 削除したキーを選択したままにしない（プロパティパネルの選択状態を、削除と揃える）。
              if (selectedId === id) onSelectId(null);
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* プロパティパネル                                                           */
/* -------------------------------------------------------------------------- */

type EditorKeyPropertyFieldProps = {
  property: "x" | "y" | "w" | "h";
  editorKey: EditorKey;
  /** input の min。矢印キーによる増減（step）は、この値を起点に数える。 */
  min: number;
  max?: number;
  /** この値未満の入力は反映しない（min より大きい値にもできる）。 */
  minValid?: number;
  /** キーの種類による制約で値が固定されている場合は true（入力できない）。 */
  disabled?: boolean;
  updateEditorKey: UpdateEditorKey;
};

/** 入力が止まってから反映するまでの待ち時間（ミリ秒）。入力途中の値（「12」を入力する途中の「1」など）を反映しないための猶予。 */
const FIELD_DEBOUNCE_MS = 300;

/** キーの位置・大きさ（x / y / w / h）を、数値で編集する入力欄。入力が止まってから反映する。 */
function EditorKeyPropertyField({
  property,
  editorKey,
  min,
  max,
  minValid = min,
  disabled = false,
  updateEditorKey,
}: EditorKeyPropertyFieldProps) {
  const [inputValue, setInputValue] = useState(String(editorKey[property]));
  const timerRef = useRef<number | null>(null);

  // 遅延実行されるコールバックが古い props を参照しないよう、最新の値を ref に保持する。
  // レンダー中には更新しない（描画が破棄された場合に、画面に表示されていない値が残るため）。
  // 画面への反映後（useLayoutEffect）に更新する。
  const editorKeyRef = useRef(editorKey);
  const updateRef = useRef(updateEditorKey);
  useLayoutEffect(() => {
    editorKeyRef.current = editorKey;
    updateRef.current = updateEditorKey;
  });

  const cancelPending = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: editorKeyが切り替わったときだけ入力値を初期化する。
  useEffect(() => {
    // 値そのものの変更への追従は、下の effect（currentValue）が行う。
    setInputValue(String(editorKey[property]));
    // 別のキーに切り替わるとき、またはパネルが消えるときは、未反映の入力を破棄する（別のキーに反映しないため）。
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [editorKey.id, property]);

  // ドラッグ・リサイズ・「空行を詰める」・他の欄の変更に伴う押し出しなど、この欄の外で値が変わったときに、表示を追従させる。
  // 入力の途中（反映待ちのタイマーがある間）は、入力中の文字を上書きしない。
  const currentValue = editorKey[property];
  useEffect(() => {
    if (timerRef.current !== null) return;
    setInputValue(String(currentValue));
  }, [currentValue]);

  /**
   * 入力文字列を検証して反映する。
   * 反映した場合（または既に同じ値の場合）はその値を返し、反映しなかった場合は null を返す。
   */
  const apply = (value: string): number | null => {
    // 空欄は Number("") が 0 になるため、先に除外する。
    if (value.trim() === "") return null;
    const number = Number(value);
    if (!Number.isFinite(number)) return null;
    // 矢印キーで 0 などの無効な値に下げた場合は、gridstack に渡さない。
    if (number < minValid) return null;
    // 整数のみ受け付ける。
    if (Math.floor(number) !== number) return null;

    const normalized = Math.min(
      max ?? Number.POSITIVE_INFINITY,
      Math.max(min, number),
    );
    const current = editorKeyRef.current[property];
    if (normalized === current) return current;
    return updateRef.current({ [property]: normalized }) ? normalized : null;
  };

  /** 待機中の入力を、待たずに今すぐ反映し、表示を実際の値に揃える。 */
  const flush = () => {
    const pending = timerRef.current !== null;
    cancelPending();
    const applied = pending ? apply(inputValue) : null;
    setInputValue(String(applied ?? editorKeyRef.current[property]));
  };

  return (
    <label className="key-props__field">
      <span className="key-props__field-label">{property.toUpperCase()}</span>

      <input
        type="number"
        min={min}
        max={max}
        step={UNIT}
        disabled={disabled}
        value={inputValue}
        onChange={(event) => {
          const value = event.target.value;
          setInputValue(value);

          cancelPending();
          timerRef.current = window.setTimeout(() => {
            timerRef.current = null;
            apply(value);
          }, FIELD_DEBOUNCE_MS);
        }}
        // 空欄にして入力し直す途中で値が元に戻らないよう、表示を実際の値に戻すのは、フォーカスが外れたときだけにする。
        onBlur={flush}
        onKeyDown={(event) => {
          if (event.key === "Enter") flush();
        }}
        className="key-props__input"
      />
    </label>
  );
}

/** 選択中のキーのプロパティ（ラベル、コード、位置、大きさ、色）を編集するパネル。 */
export function EditorKeyPropertyPanel() {
  const labelInputId = useId();
  // layoutVersion は add / remove / change / update() のたびに増える。
  // useGridStack 経由でこれを購読することで、パネルが最新の node を読み直す。
  const { grid, addWidget } = useGridStack();
  const { selectedId, isDragging, onSelectId, syncDirty, sendKey, sendLog } =
    useEditorContext();

  const selectedNode = selectedId
    ? (grid && Utils.findInGrid(grid, selectedId, true)) || undefined
    : undefined;
  const selectedEditorKey = selectedNode ? nodeToEditorKey(selectedNode) : null;
  const editable = selectedEditorKey != null && !isDragging;
  const rules = selectedEditorKey
    ? getKeyRules(selectedEditorKey)
    : DEFAULT_RULES;
  const isTab = selectedEditorKey?.name === TAB_KEY_NAME;
  const deletable =
    editable && canRemoveEditorKey(readEditorKeys(grid), selectedEditorKey);

  const updateSelectedEditorKey: UpdateEditorKey = (patch) => {
    if (!grid || !selectedId) return false;
    const el = grid
      .getGridItems()
      .find((item) => item.gridstackNode?.id === selectedId);
    const node = el?.gridstackNode;
    if (!el || !node) return false;

    // 固定されているプロパティは受け付けない（入力欄の無効化に加えた、最後の防御）。
    const nodeRules = getKeyRules(nodeToEditorKey(node));
    const { x, y, w, h, ...others } = patch;
    if (nodeRules.alwaysShowLabel) delete others.showLabel;
    const geometry: { x?: number; y?: number; w?: number; h?: number } = {};
    if (x !== undefined && !nodeRules.fixedX) geometry.x = x;
    if (y !== undefined && !nodeRules.fixedY) geometry.y = y;
    if (w !== undefined && !nodeRules.fixedW) geometry.w = w;
    if (h !== undefined && !nodeRules.fixedH) geometry.h = h;

    const hasGeometry = Object.keys(geometry).length > 0;
    const hasOthers = Object.keys(others).length > 0;
    if (!hasGeometry && !hasOthers) return true;

    const currentProps = getNodeProps(node);
    grid.update(el, {
      ...geometry,
      ...(hasOthers ? { props: { ...currentProps, ...others } } : {}),
    });
    syncDirty();

    if (!hasGeometry) return true;
    return (
      Object.entries(geometry) as [keyof typeof geometry, number][]
    ).every(([key, value]) => node[key] === value);
  };

  const removeSelected = () => {
    if (!grid || !selectedNode?.el || !deletable) return;
    grid.removeWidget(selectedNode.el);
    onSelectId(null);
  };

  return (
    <aside className="key-props">
      <div className="key-props__header">
        <h2 className="key-props__title">選択中のキー</h2>

        <button
          type="button"
          className="secondary outline key-props__delete"
          disabled={!deletable}
          title={
            editable && !deletable
              ? "先頭のタブは、他のタブがある間は削除できません"
              : undefined
          }
          onClick={removeSelected}
        >
          削除
        </button>
      </div>

      {editable ? (
        <div className="key-props__body">
          <div className="key-props__field">
            <div className="key-props__field-head">
              <label htmlFor={labelInputId} className="key-props__field-label">
                {isTab ? "タブ名" : "LABEL"}
              </label>
              <label className="key-props__field-head">
                <span className="key-props__field-label">表示する</span>
                <input
                  type="checkbox"
                  disabled={rules.alwaysShowLabel}
                  checked={selectedEditorKey.showLabel}
                  onChange={(event) => {
                    updateSelectedEditorKey({
                      showLabel: event.target.checked,
                    });
                  }}
                />
              </label>
            </div>
            <input
              id={labelInputId}
              type="text"
              className="key-props__input"
              value={selectedEditorKey.label ?? ""}
              onChange={(event) => {
                updateSelectedEditorKey({ label: event.target.value });
              }}
            />
          </div>

          {rules.hasCode && (
            <div className="key-props__field">
              <span className="key-props__field-label">CODE</span>
              <div className="key-props__code-row">
                <span className="key-props__code">
                  {selectedEditorKey.code || "(なし)"}
                </span>
                <button
                  type="button"
                  className="secondary outline key-props__send"
                  disabled={!selectedEditorKey.code}
                  onClick={() => {
                    const code = selectedEditorKey.code;
                    if (code) void sendKey(code);
                  }}
                >
                  送信
                </button>
              </div>
            </div>
          )}

          <div className="key-props__grid">
            <EditorKeyPropertyField
              property="x"
              editorKey={selectedEditorKey}
              min={0}
              max={GRID_COLUMNS - selectedEditorKey.w}
              disabled={rules.fixedX}
              updateEditorKey={updateSelectedEditorKey}
            />
            <EditorKeyPropertyField
              property="y"
              editorKey={selectedEditorKey}
              min={0}
              disabled={rules.fixedY}
              updateEditorKey={updateSelectedEditorKey}
            />
            <EditorKeyPropertyField
              property="w"
              editorKey={selectedEditorKey}
              min={0}
              minValid={MIN_SIZE}
              max={GRID_COLUMNS - selectedEditorKey.x}
              disabled={rules.fixedW}
              updateEditorKey={updateSelectedEditorKey}
            />
            <EditorKeyPropertyField
              property="h"
              editorKey={selectedEditorKey}
              min={0}
              minValid={MIN_SIZE}
              disabled={rules.fixedH}
              updateEditorKey={updateSelectedEditorKey}
            />
          </div>
          <div className="key-props__field">
            <span className="key-props__field-label">COLOR</span>
            <ColorPickerButton
              color={selectedEditorKey.color}
              onChange={(color) => updateSelectedEditorKey({ color })}
            />
          </div>
        </div>
      ) : isDragging ? (
        <div>ドラッグ中……</div>
      ) : (
        <div>キーを選択してください。</div>
      )}
      <div className="key-props__dev">
        <h2 className="key-props__dev-title">上級者向け</h2>

        <section className="key-props__section">
          <h3 className="key-props__section-title">カスタムキー</h3>
          <CustomKeyForm
            onAdd={(code) =>
              onSelectId(placeEditorKey(grid, addWidget, customKeyEntry(code)))
            }
            onSend={sendKey}
          />
        </section>

        <section className="key-props__section">
          <h3 className="key-props__section-title">通信ログ</h3>
          <SendLog sendLog={sendLog} />
        </section>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* キー一覧パネル                                                             */
/* -------------------------------------------------------------------------- */

/** 直近の送信結果（通信ログに表示する1件）。API の結果は、加工せずそのまま保持する。 */
type SendLogEntry = {
  time: string;
  code: string;
  result: ApiResult<number>;
};

/** 直近の送信結果を JSON で表示する（読み取り専用）。 */
function SendLog({ sendLog }: { sendLog?: SendLogEntry }) {
  return (
    <div className="send-log">
      <textarea
        readOnly
        rows={8}
        value={sendLog ? JSON.stringify(sendLog, null, 2) : "(未送信)"}
      />
    </div>
  );
}

/**
 * 任意のキーコードを入力して、送信またはキーとして追加するフォーム。
 * 入力がキーコードの形式に合わない場合は、送信も追加もできない。
 */
function CustomKeyForm({
  onAdd,
  onSend,
}: {
  onAdd: (code: string) => void;
  onSend: (code: string) => Promise<void>;
}) {
  const [text, setText] = useState("");
  const empty = text.trim() === "";
  const hasCode = isKeyCode(text);
  // 空欄の場合は、「ラベルだけのキー」として追加できる。入力がある場合は、形式が正しいことが条件になる。
  const canAdd = empty || hasCode;
  const code = normalizeKeyCode(text);

  return (
    <div className="custom-key">
      <div className="custom-key__row">
        <input
          type="text"
          className="custom-key__input"
          value={text}
          placeholder="キーコード(例：40BF7E)"
          maxLength={6}
          aria-label="キーコード（6桁の16進数）"
          aria-invalid={!empty && !hasCode ? true : undefined}
          onChange={(event) => setText(event.target.value)}
        />
        <button
          type="button"
          className="secondary outline custom-key__button"
          disabled={!hasCode}
          title="このコードを送信"
          onClick={() => void onSend(code)}
        >
          送信
        </button>
        <button
          type="button"
          className="secondary outline custom-key__button"
          disabled={!canAdd}
          title="このコードのキーを追加（空欄ならラベルだけのキー）"
          onClick={() => {
            onAdd(code);
            setText("");
          }}
        >
          追加
        </button>
      </div>
    </div>
  );
}

/** RemoteKeyCatalogPanel の props。 */
export interface RemoteKeyCatalogPanelProps {
  catalog: RemoteKeyCatalogEntry[];
}

/** キーの種類ごとにカタログを一覧表示し、クリックでグリッドに追加、ボタンで送信できるパネル。 */
export function RemoteKeyCatalogPanel({ catalog }: RemoteKeyCatalogPanelProps) {
  const { grid, addWidget } = useGridStack();
  const { onSelectId, sendKey, iconRender } = useEditorContext();

  const entriesByKind = useMemo(() => {
    const groups: Partial<Record<RemoteKeyKind, RemoteKeyCatalogEntry[]>> = {};
    for (const entry of catalog) {
      const { kind } = entry;
      if (groups[kind]) {
        groups[kind].push(entry);
      } else {
        groups[kind] = [entry];
      }
    }
    return groups;
  }, [catalog]);

  const handleAddEditorKey = (entry: RemoteKeyCatalogEntry) => {
    onSelectId(placeEditorKey(grid, addWidget, entry));
  };

  return (
    <aside className="key-catalog">
      <h2 className="key-catalog__title">キー一覧</h2>

      <div className="key-catalog__list">
        {REMOTE_KEY_KIND_DEFS.map(({ kind, label, color }) => {
          const entries = entriesByKind[kind];
          if (!entries) {
            return null;
          }

          return (
            <details
              key={kind}
              name="key-catalog-kind"
              className="key-catalog__group"
              style={{ "--kind-color": color } as CSSProperties}
            >
              <summary>
                <span className="key-catalog__label">{label}</span>
              </summary>
              <div>
                {entries.map((entry) => {
                  const code = entry.code;
                  return (
                    <div key={entry.name} className="key-catalog__row">
                      <button
                        type="button"
                        className="key-catalog__item"
                        onClick={() => handleAddEditorKey(entry)}
                        style={{ "--kind-color": entry.color } as CSSProperties}
                      >
                        <span className="key-catalog__icon">
                          {renderCatalogIcon(entry, iconRender)}
                        </span>
                        <span className="key-catalog__label">
                          {entry.label}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="secondary outline key-catalog__send"
                        disabled={!code}
                        title={`${entry.label}を送信`}
                        aria-label={`${entry.label}を送信`}
                        onClick={() => {
                          if (code) void sendKey(code);
                        }}
                      >
                        送信
                      </button>
                    </div>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* ツールバー（画面上部に配置し、キー一覧・キャンバス・プロパティの上に表示する） */
/* -------------------------------------------------------------------------- */

/** 画面上部のツールバー。保存、保存状態の表示、背景色の変更、レイアウト操作を行う。 */
function Toolbar({
  dirty,
  invalid,
  iconWarnings,
  reloadError,
  status,
  onSave,
  onOverwrite,
  onReload,
  onCompactLayout,
  onResetLayout,
  background,
  onBackgroundChange,
}: {
  dirty: boolean;
  invalid: boolean;
  /** icon-urls.json の読み込みで、使用できなかった項目の説明。 */
  iconWarnings: string[];
  /** 「最新を読み込む」に失敗した理由。編集中の内容は、そのまま残っている。 */
  reloadError: string | null;
  status: SaveStatus;
  onSave: () => void;
  onOverwrite: (serverRevision: string) => void;
  onReload: () => void;
  onCompactLayout: () => void;
  onResetLayout: () => void;
  background: string;
  onBackgroundChange: (color: string) => void;
}) {
  const saving = status.type === "saving";
  return (
    <header className="editor-toolbar">
      <button
        type="button"
        disabled={(!dirty && !invalid) || saving}
        onClick={onSave}
      >
        {saving ? "保存中…" : "保存"}
      </button>

      <div className="editor-toolbar__status">
        {invalid && (
          <small role="alert">
            保存済みのデータが壊れているため、空の状態で開きました。保存すると上書きされます。
          </small>
        )}

        {iconWarnings.length > 0 && (
          <small role="alert" title={iconWarnings.join("\n")}>
            icon-urls.json に使えない項目があります（飛ばしています。
            {iconWarnings.length} 件）: {iconWarnings[0]}
          </small>
        )}

        {reloadError && (
          <small role="alert">
            最新の読み込みに失敗しました（編集中の内容はそのままです）:{" "}
            {reloadError}
          </small>
        )}

        {dirty && status.type !== "conflict" && (
          <small>未保存の変更があります</small>
        )}
        {!dirty && status.type === "saved" && <small>保存しました</small>}
        {status.type === "error" && (
          <small role="alert">保存に失敗しました: {status.message}</small>
        )}
        {status.type === "conflict" && (
          <small role="alert">
            別の場所で更新されています。{" "}
            <button type="button" onClick={onReload}>
              最新を読み込む（手元の変更は破棄）
            </button>{" "}
            <button
              type="button"
              onClick={() => onOverwrite(status.serverRevision)}
            >
              手元の内容で上書き
            </button>
          </small>
        )}
      </div>

      <div className="editor-toolbar__layout">
        <div className="editor-toolbar__background">
          <span className="editor-toolbar__label">背景</span>
          <ColorPickerButton color={background} onChange={onBackgroundChange} />
        </div>

        <button
          type="button"
          className="secondary outline"
          onClick={onCompactLayout}
        >
          空行を詰める
        </button>
        <button
          type="button"
          className="secondary outline"
          onClick={onResetLayout}
        >
          クリア
        </button>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* エディタ本体                                                               */
/* -------------------------------------------------------------------------- */

const COMPONENTS = { [EDITOR_KEY_COMPONENT]: EditorKeyView };

/** エディタの画面全体。キー一覧、キャンバス（グリッド）、プロパティ、プレビューを配置し、保存を管理する。 */
function EditorCanvas({
  initialRevision,
  initialEditorKeys,
  initialBackground,
  invalid,
  catalog,
  iconRender,
  iconWarnings,
  reloadError,
  onReload,
}: {
  initialRevision: string;
  initialEditorKeys: EditorKey[];
  initialBackground: string;
  invalid: boolean;
  /** キーのカタログ。icon-urls.json の内容を反映済み（useEditorData が生成する）。 */
  catalog: RemoteKeyCatalogEntry[];
  /** アイコンを描画する関数。icon-urls.json の読み込みが完了してから渡される（useEditorData が待機する）。 */
  iconRender: RemoteKeyIconRender;
  /** icon-urls.json の読み込みで、使用できなかった項目の説明。 */
  iconWarnings: string[];
  /** 「最新を読み込む」に失敗した理由（なければ null）。 */
  reloadError: string | null;
  onReload: () => void;
}) {
  const rem = useRem();
  const CELL_SIZE = rem;
  const GRID_WIDTH = GRID_COLUMNS * CELL_SIZE;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dirty, setDirty] = useState(false);
  // Preview に渡す、編集中のキー。レイアウトが変わるたびに、syncDirty で読み直す。
  // グリッドは、読み込み時に制約（タブの幅など）を適用した値で作られる。比較の基準も同じ値にして、読み込んだだけで「未保存」にならないようにする。
  const normalizedInitialKeys = useMemo(
    () => initialEditorKeys.map(normalizeEditorKey),
    [initialEditorKeys],
  );
  const [previewKeys, setPreviewKeys] = useState(normalizedInitialKeys);
  const [status, setStatus] = useState<SaveStatus>({ type: "idle" });
  const handleRef = useRef<GridStackHandle>(null);
  // パネルの描画先。スクロールするのは中央の領域だけにしたいため、パネルは外側のスロットに描画する。
  const [catalogSlot, setCatalogSlot] = useState<HTMLElement | null>(null);
  const [propsSlot, setPropsSlot] = useState<HTMLElement | null>(null);

  // 最後に確認できたサーバー上の revision と、その時点の内容。変更しても再描画は不要なため、ref に保持する。
  const savedRef = useRef({
    revision: initialRevision,
    snapshot: snapshotOf(normalizedInitialKeys, initialBackground),
  });
  const [invalidNotice, setInvalidNotice] = useState(invalid);
  // リモコン全体の背景色。描画用に state で、変更の検知と保存用に ref でも保持する。
  const [background, setBackground] = useState(initialBackground);
  const backgroundRef = useRef(initialBackground);

  // 初期レイアウトは、マウント時に一度だけ生成する。
  const initialChildrenRef = useRef<GridStackWidget[] | null>(null);
  if (initialChildrenRef.current === null) {
    initialChildrenRef.current = initialEditorKeys.map(editorKeyToWidget);
  }

  const options = useMemo(
    () => ({
      column: GRID_COLUMNS,
      cellHeight: CELL_SIZE,
      margin: 0,
      float: true,
      draggable: { handle: ".key-tile__button" },
      resizable: { handles: "se" },
      children: initialChildrenRef.current ?? [],
    }),
    [CELL_SIZE],
  );

  const readCurrent = useCallback(
    () => readEditorKeys(handleRef.current?.getGrid()),
    [],
  );

  const isDirty = useCallback(
    () =>
      snapshotOf(readCurrent(), backgroundRef.current) !==
      savedRef.current.snapshot,
    [readCurrent],
  );

  /**
   * レイアウトが変わったときに呼び出す。保存は行わず、未保存かどうかの判定と、プレビューの更新だけを行う。
   * 編集を再開した時点で、前回の「保存しました」「失敗」の表示は消す。競合中の表示は、ユーザーが選択するまで残す。
   */
  const syncDirty = useCallback(() => {
    setDirty(isDirty());
    setPreviewKeys(readCurrent());
    setStatus((s) =>
      s.type === "saved" || s.type === "error" ? { type: "idle" } : s,
    );
  }, [isDirty, readCurrent]);

  const save = useCallback(
    async (revision: string | null) => {
      // 送信する内容を先に確定する。通信中に編集されても、保存済みとして記録する内容がずれないようにするため。
      const editorKeys = readCurrent();
      const savedBackground = backgroundRef.current;
      setStatus({ type: "saving" });
      const result = await saveEditor(apiClient, revision, {
        version: 1,
        grid: GRID_SPEC,
        background: savedBackground,
        keys: editorKeys,
      });

      if (result.type === "saved") {
        savedRef.current = {
          revision: result.revision,
          snapshot: snapshotOf(editorKeys, savedBackground),
        };
        setInvalidNotice(false);
        // 保存中に編集された場合に備えて、現在の状態で未保存かどうかを判定し直す。
        setDirty(isDirty());
      }
      setStatus(result);
    },
    [readCurrent, isDirty],
  );

  const handleBackgroundChange = (color: string) => {
    backgroundRef.current = color;
    setBackground(color);
    syncDirty();
  };

  const handleSave = () => void save(savedRef.current.revision);
  const handleOverwrite = (serverRevision: string) => void save(serverRevision);

  // レイアウトの操作。GridStack の内側から呼び出す必要はないため、ツールバーと同じ階層に定義する。
  const handleCompactLayout = () => {
    const grid = handleRef.current?.getGrid();
    if (!grid) return;
    removeEmptyRows(grid);
    syncDirty();
  };

  const handleResetLayout = () => {
    // グリッドを空にするだけで、サーバーへの反映は「保存」を押したときに行う。
    handleRef.current?.getGrid()?.removeAll();
    setSelectedId(null);
  };

  // 未保存の状態でタブを閉じたりリロードしたりしようとしたときに、確認を表示する。
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  /* --- <GridStack> のイベント。ハンドラは effect の依存になるため、useCallback で参照を安定させる --- */

  const handleDragOrResizeStart = useCallback(
    (_event: Event, el: GridItemHTMLElement) => {
      setIsDragging(true);
      const id = el.gridstackNode?.id;
      if (id != null) setSelectedId(String(id));
    },
    [],
  );

  const handleDragOrResizeStop = useCallback(() => {
    // 直後のクリックで削除ボタンが誤って押されないよう、少し待ってからドラッグ中の状態を解除する。
    setTimeout(() => setIsDragging(false), 250);
  }, []);

  // 通信ログ。直近の送信結果を1件だけ保持する。
  const [sendLog, setSendLog] = useState<SendLogEntry>();
  // 送信中は、次の送信を受け付けない（連打で TV に連続して送らないため。ビューアの useRegzaApi と同じ扱い）。
  const sendInFlight = useRef(false);
  const sendKey = useCallback(async (code: string) => {
    if (sendInFlight.current) return;
    sendInFlight.current = true;
    try {
      const { result } = await sendRemoteCode(apiClient, code);
      setSendLog({
        time: new Date().toLocaleTimeString("ja-JP", { hour12: false }),
        code,
        result,
      });
    } finally {
      sendInFlight.current = false;
    }
  }, []);

  const contextValue = useMemo<EditorContextValue>(
    () => ({
      selectedId,
      isDragging,
      onSelectId: setSelectedId,
      syncDirty,
      iconRender,
      sendKey,
      sendLog,
    }),
    [selectedId, isDragging, syncDirty, iconRender, sendKey, sendLog],
  );

  return (
    <div className="editor-layout">
      {/* 上段: ツールバー。スクロールしないため、常に表示される。 */}
      <Toolbar
        dirty={dirty}
        invalid={invalidNotice}
        iconWarnings={iconWarnings}
        reloadError={reloadError}
        status={status}
        onSave={handleSave}
        onOverwrite={handleOverwrite}
        onReload={onReload}
        onCompactLayout={handleCompactLayout}
        onResetLayout={handleResetLayout}
        background={background}
        onBackgroundChange={handleBackgroundChange}
      />

      {/* 下段: [キー一覧] [キャンバス] [プロパティ] */}
      <div className="editor-slot editor-slot--catalog" ref={setCatalogSlot} />

      <EditorContext.Provider value={contextValue}>
        {/* スクロールするのは、この中央の領域だけ。 */}
        <main className="editor-main">
          <div
            className="key-grid-stage"
            style={{ width: GRID_WIDTH, backgroundColor: background }}
          >
            <GridStack
              ref={handleRef}
              options={options}
              components={COMPONENTS}
              className="key-grid key-scale-root"
              style={{ width: GRID_WIDTH }}
              onAdded={syncDirty}
              onChange={syncDirty}
              onRemoved={syncDirty}
              onDragStart={handleDragOrResizeStart}
              onResizeStart={handleDragOrResizeStart}
              onDragStop={handleDragOrResizeStop}
              onResizeStop={handleDragOrResizeStop}
            >
              {/*
                useGridStack() を使用するパネルは、<GridStack> の children として配置する必要がある。
                ただし描画先は、ポータルで左右のスロットにする（コンテキストはそのまま引き継がれる）。
              */}
              {catalogSlot &&
                createPortal(
                  <RemoteKeyCatalogPanel catalog={catalog} />,
                  catalogSlot,
                )}
              {propsSlot && createPortal(<EditorKeyPropertyPanel />, propsSlot)}
            </GridStack>
          </div>
        </main>
      </EditorContext.Provider>

      <div className="editor-slot editor-slot--props" ref={setPropsSlot} />

      {/* 4列目: プレビュー。画面幅が広い場合のみ表示する（CSS で切り替える）。 */}
      <PreviewView
        keys={previewKeys}
        background={background}
        grid={GRID_SPEC}
        iconRender={iconRender}
      />
    </div>
  );
}

/**
 * エディタの読み込みを担当するコンポーネント。
 * 読み込みが完了するまでは、グリッドを描画しない（options.children はマウント時にしか参照されないため）。
 */
export default function EditorView() {
  const { state, reload, reloadKey, reloadError } = useEditorData(apiClient);

  if (state.type === "error") {
    return (
      <div role="alert">
        読み込みに失敗しました: {state.message}{" "}
        <button type="button" onClick={reload}>
          再試行
        </button>
      </div>
    );
  }
  if (state.type === "loading") return <div>読み込み中…</div>;

  const { revision, config, invalid, catalog, iconRender, iconWarnings } =
    state.data;
  return (
    <EditorCanvas
      key={reloadKey}
      initialRevision={revision}
      initialEditorKeys={config?.keys ?? []}
      initialBackground={config?.background ?? DEFAULT_BACKGROUND}
      invalid={invalid}
      catalog={catalog}
      iconRender={iconRender}
      iconWarnings={iconWarnings}
      reloadError={reloadError}
      onReload={reload}
    />
  );
}
