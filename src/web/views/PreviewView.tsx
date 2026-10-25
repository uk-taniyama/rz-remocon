import { useMemo } from "react";
import { toRemoconConfig } from "../../api";
import { defaultIconRender, type RemoteKeyIconRender } from "../remoteKeys";
import { RemoteKeyLayout } from "../remoteKeys/RemoteKeyLayout";
import type { EditorKey } from "./editor-grid";

/** `PreviewView` の props。 */
export interface PreviewViewProps {
  keys: EditorKey[];
  background: string;
  grid: { columns: number; unit: number };
  /** アイコンを描画する関数。省略した場合は、標準のアイコンだけで描画する。 */
  iconRender?: RemoteKeyIconRender;
}

/**
 * エディタの隣に表示するプレビュー。
 * - 編集中のキーを、ビューア（`MainView`）と同じ見た目で描画する。
 * - タブの切り替えは操作できる。
 * - キー送信の仕組み（`RemoteKeySender`）を持たないため、キーを押しても TV には送信されない。
 *
 * 枠の幅は、`.remote-key-container`（`common.css` ではなく `remote-keys.css` に定義）が
 * 100cqw で受けるため、枠の大きさに合わせて縮小される。
 */
export function PreviewView({
  keys,
  background,
  grid,
  iconRender = defaultIconRender,
}: PreviewViewProps) {
  const config = useMemo(
    () => toRemoconConfig({ version: 1, grid, background, keys }),
    [keys, background, grid],
  );

  return (
    <aside className="editor-preview" aria-label="プレビュー">
      <h2 className="editor-preview__title">プレビュー</h2>
      <div
        className="editor-preview__screen"
        style={{ backgroundColor: config.background }}
      >
        <div className="remote-key-container">
          <RemoteKeyLayout
            keys={config.keys}
            cellsPerKey={config.grid.unit}
            columns={config.grid.columns}
            iconRender={iconRender}
          />
        </div>
      </div>
    </aside>
  );
}
