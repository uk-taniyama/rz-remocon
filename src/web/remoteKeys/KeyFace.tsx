import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { readableTextColor } from "./contrast";

/*
 * キーの見た目（外枠、アイコン、ラベル）。ビューア（`RemoteKeyButton`）とエディタ（`EditorKeyView`）で共有する。
 * 外枠は常に `<div>` で、キーボード操作は扱わない（押下は、クリックイベントの委譲で受け付ける）。
 * スタイルは、`remote-keys.css` の `.key-face` / `.key-face__icon` / `.key-face__label` を参照。
 *
 * 大きさの決め方:
 *   アイコン本体は、枠（`.key-face__icon`）いっぱい（100%）に描画し、大きさは枠で決める。
 *   枠の大きさ（`.key-face` の内側に対する割合）は、アイコンのみの場合は 100%、ラベルと一緒の場合は 70%（割合は `remote-keys.css` で定義）。
 */

/** `KeyFace` の props。 */
export interface KeyFaceProps extends HTMLAttributes<HTMLDivElement> {
  /** キーの色（#RRGGBB）。`--key-bg` に設定する。文字色（`--key-fg`）は、読みやすい白または黒を自動で選択する。 */
  color: string;
  /** タブとして表示するか（背景と文字を反転する）。省略した場合は通常のキー（`.key-button`）。 */
  tab?: boolean;
  /** 選択中か（エディタ用）。`true` の場合は `.selected` を付与する。 */
  selected?: boolean;
  /** 描画済みのアイコン。ない場合は `null` または `undefined`。 */
  icon?: ReactNode;
  /** ラベルの文字列。表示しない場合は省略する。 */
  label?: string;
}

/** キーの見た目（外枠、アイコン、ラベル）を描画するコンポーネント。 */
export function KeyFace({
  color,
  tab = false,
  selected = false,
  icon,
  label,
  className,
  ...divProps
}: KeyFaceProps) {
  const hasIcon = icon != null;
  const hasLabel = Boolean(label);
  const classes = [
    "key-face",
    tab ? "tab" : "key-button",
    selected ? "selected" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  const colorVars = {
    "--key-bg": color,
    "--key-fg": readableTextColor(color),
  } as CSSProperties;
  return (
    <div {...divProps} className={classes} style={{ ...colorVars }}>
      {hasIcon && (
        <span
          className={
            hasLabel
              ? "key-face__icon key-face__icon--with-label"
              : "key-face__icon"
          }
        >
          {icon}
        </span>
      )}
      {hasLabel && (
        <span
          className={
            hasIcon
              ? "key-face__label key-face__label--small"
              : "key-face__label"
          }
        >
          {label}
        </span>
      )}
    </div>
  );
}
