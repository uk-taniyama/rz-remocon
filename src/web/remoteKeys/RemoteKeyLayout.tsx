import type { FC, MouseEvent, ReactNode } from "react";
import { Fragment, memo, useId } from "react";
import { type RemoteKeyConfig, TAB_KEY_NAME } from "../../api";
import { KeyFace } from "./KeyFace";
import { groupRemoteKeysByTab, type RemoteKeyTabGroup } from "./tab-group";
import type { OnChangeCode, RemoteKeyIconRender } from "./types";

/*
 * ==========================================================================
 * 座標と大きさの単位（この画面の全体像）
 * ==========================================================================
 *
 * 単位は次の3つだけで、変換はこのファイルの中で完結する。
 *
 *   ① セル（cell）: 座標 x, y, w, h の単位。整数。
 *      remocon.json と remocon.editor.json は、どちらもセル単位で保存する。
 *
 *   ② キー（key）: セルをまとめた、ボタン1個分の単位。
 *      1キー = cellsPerKey セル。cellsPerKey は remocon.json の grid.unit（既定は 4）。
 *      1キーを4セルに分割しているのは、キーの位置を 1/4 キー単位で指定できるようにするため。
 *
 *   ③ rem: 描画の単位。画面幅に合わせて縮小する。
 *      1キー = KEY_REM（5rem）。キーの見た目の大きさは、この値で決まる。
 *
 * つまり、変換は「キー → rem」の1回だけで、その比率は次の式になる。
 *
 *   1セル = KEY_REM / cellsPerKey rem = 5 / 4 = 1.25rem   （広い画面での上限）
 *
 * 枠（.remote-key-container。cqw の基準）が狭い場合は、--cell（1セルの長さ）を縮小する。
 * すべての長さは --cell の倍数で決まるため、キーも文字も余白も、同じ比率で縮小される。
 *
 * --scaled-rem は「文字や余白の基準になる rem」。--cell から導出するため、
 * 広い画面では 1rem、狭い画面では --cell と同じ比率で縮小される。
 * ==========================================================================
 */

/** 1キーの大きさ（rem）。広い画面でのキーの見た目の大きさを決める。 */
const KEY_REM = 5;

/**
 * n セル分の長さを表す CSS の値を返す。--cell を掛けるため、画面幅に合わせて縮小される。
 * 座標（left / top / width / height）に使用する。
 */
function cells(n: number) {
  return `calc(var(--cell) * ${n})`;
}

/**
 * 文字や余白などの長さを表す CSS の値を返す。--scaled-rem を掛けるため、キーと同じ比率で縮小される。
 * 単位は rem と同じで、「1 = 1rem 相当」。
 */
function scaled(n: number) {
  return `calc(var(--scaled-rem) * ${n})`;
}

/** RemoteKeyButton の props。 */
export interface RemoteKeyButtonProps {
  keyConfig: RemoteKeyConfig;
  iconRender?: RemoteKeyIconRender;
}

/** キー1個分のボタン。座標と大きさに従って、絶対配置で描画する。 */
export function RemoteKeyButton({
  keyConfig: key,
  iconRender,
}: RemoteKeyButtonProps) {
  // キーの見た目は、エディタのタイルと同じ KeyFace で描画する（大きさの割合は remote-keys.css で定義）。
  // iconRender は関数のまま渡さず、実行した結果を渡す（KeyFace が、アイコンの有無でレイアウトを決めるため）。
  const icon = iconRender?.(key);
  return (
    <div
      style={{
        position: "absolute",
        // 座標はセル単位（整数）。換算せず、そのまま --cell に掛ける。
        left: cells(key.x),
        top: cells(key.y),
        width: cells(key.w),
        height: cells(key.h),
        boxSizing: "border-box",
        padding: scaled(0.2),
      }}
    >
      <KeyFace
        data-code={key.code}
        color={key.color}
        tab={key.name === TAB_KEY_NAME}
        icon={icon}
        label={key.label}
      />
    </div>
  );
}

/** 配置層の各コンポーネントに共通の props。 */
export interface CommonProps {
  /**
   * 1キーのセル数（remocon.json の grid.unit）。
   * セルの大きさ（1セル = KEY_REM / cellsPerKey rem）を決めるために使用する。
   */
  cellsPerKey: number;
  /** グリッドの幅（セル数）。remocon.json の grid.columns に当たる。 */
  columns: number;
  iconRender?: RemoteKeyIconRender;
}

/** RemoteKeyLayout の props。 */
export interface RemoteKeyLayoutProps extends CommonProps {
  /** 表示するキー。座標はセル単位。 */
  keys: RemoteKeyConfig[];
}

/*
 * ==========================================================================
 * 2つの階層
 * ==========================================================================
 *
 * 配置層（RemoteKeyLayout）: キーを座標どおりに並べる。イベントは扱わない。
 * 送信層（RemoteKeySender）: クリックを1か所で受け、data-code のコードを送信する。配置は関知しない。
 *
 * 送信層は、子の中で data-code を持つ要素を、イベントの委譲（1つの onClick）で検出する。
 * キーごとにハンドラを設定しないため、配置を変更しても送信には影響しない。
 * ==========================================================================
 */

/** 送信層。子の中の [data-code] をクリックしたときに、そのコードを送信する。 */
export const RemoteKeySender: FC<{
  onSendCode: OnChangeCode;
  children: ReactNode;
}> = ({ onSendCode, children }) => {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>(
      "[data-code]",
    );
    if (!target) return;
    const code = target.dataset.code;
    if (!code) return;
    onSendCode(code);
  };

  return (
    <div onClick={handleClick} className="remote-key-container">
      {children}
    </div>
  );
};

/** 配置層。キーを座標どおりに並べて表示する。 */
export function RemoteKeyButtonsGrid({
  keys,
  columns,
  iconRender,
}: RemoteKeyLayoutProps) {
  // キーが占める範囲を、セル単位で求める。rows もセル単位。
  const rows = keys.reduce(
    (max, remoKey) => Math.max(max, remoKey.y + remoKey.h),
    0,
  );

  return (
    <div
      style={{
        position: "relative",
        width: cells(columns),
        height: cells(rows),
        margin: "0 auto",
      }}
    >
      {keys.map((config, index) => (
        <RemoteKeyButton
          key={index}
          keyConfig={config}
          iconRender={iconRender}
        />
      ))}
    </div>
  );
}

interface RemoteKeyLayoutWithTabsProps extends CommonProps {
  groups: RemoteKeyTabGroup[];
}

/**
 * タブ付きの表示。JavaScript なしで切り替えられるよう、radio と CSS だけで実現する（静的 HTML でも動作する）。
 * グループごとに「input → 内容 → label」の順で兄弟要素として並べ、
 *   input:checked + 内容         … 選択中のタブの内容だけを表示する
 *   input:checked + 内容 + label … 選択中のタブの見た目にする
 * を CSS の兄弟セレクタで指定する。label は grid の下の行に配置し、sticky で画面下に固定する。
 */
function RemoteKeyButtonsWithTabs({
  groups,
  columns,
  ...props
}: RemoteKeyLayoutWithTabsProps) {
  const id = useId();
  // 列の数（タブの数）。CSS でタブバーを等幅に分割するために使用する。理由は remote-keys.css の .remote-key-tabs を参照。
  return (
    <div
      className="remote-key-tabs"
      role="radiogroup"
      style={{ ["--remote-key-tabs-count" as string]: groups.length }}
    >
      {groups.map((group, index) => {
        const inputId = `${id}-${index}`;
        return (
          <Fragment key={inputId}>
            <input
              className="remote-key-tabs__input"
              type="radio"
              name={id}
              id={inputId}
              defaultChecked={index === 0}
            />
            <div className="remote-key-tabs__panel">
              <RemoteKeyButtonsGrid
                {...props}
                keys={group.buttons}
                columns={columns}
              />
            </div>
            <label
              className="remote-key-tabs__label"
              htmlFor={inputId}
              style={{ ["--remote-key-tabs-color" as string]: group.tab.color }}
            >
              {group.tab.label || `タブ ${index + 1}`}
            </label>
          </Fragment>
        );
      })}
    </div>
  );
}

/** キーの配置の入口。セルの大きさを決め、タブがあればタブ付き、なければタブなしで表示する。 */
function RemoteKeyLayoutEntry(props: RemoteKeyLayoutProps) {
  const { columns, keys, ...gridProps } = props;
  const cellMaxRem = KEY_REM / props.cellsPerKey;
  const groups = groupRemoteKeysByTab(keys);

  // 枠の幅（cqw）に合わせてセルの大きさを補正し、全体の横幅も、それに合わせる。
  return (
    <div
      className="remote-key-layout key-scale-root"
      style={{
        ["--cell" as string]: `min(${cellMaxRem}rem, calc(100cqw / ${columns}))`,
        ["--scaled-rem" as string]: `calc(var(--cell) * ${1 / cellMaxRem})`,
        width: `min(${cellMaxRem}rem * ${columns}, 100cqw)`,
      }}
    >
      {/* タブの数が変わったときに、選択状態を初期化して先頭のタブに戻すため、key にタブの数を指定する。 */}
      {groups ? (
        <RemoteKeyButtonsWithTabs
          key={groups.length}
          {...gridProps}
          columns={columns}
          groups={groups}
        />
      ) : (
        <RemoteKeyButtonsGrid {...gridProps} columns={columns} keys={keys} />
      )}
    </div>
  );
}

/** リモコンのキーを配置して表示するコンポーネント。 */
export const RemoteKeyLayout = memo(RemoteKeyLayoutEntry);
