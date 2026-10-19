import { RiEditLine } from "@remixicon/react";
import { useEffect } from "react";
import { DEFAULT_BACKGROUND } from "../../api";
import { apiClient } from "../client";
import {
  RemoteKeyLayout,
  RemoteKeySender,
} from "../remoteKeys/RemoteKeyLayout";
import { useRegzaApi } from "../remoteKeys/useRegzaApi";
import { useRemoconData } from "../remoteKeys/useRemoconData";

/** ビューア（リモコン画面）。リモコン設定を読み込み、キーを押すと REGZA に送信する。 */
export default function MainView() {
  const { result, busy, onSendCode } = useRegzaApi(apiClient);
  const remocon = useRemoconData();

  useEffect(() => {
    if (result) {
      console.log(result);
    }
  }, [result]);

  return (
    <main
      className="container"
      style={{
        backgroundColor:
          remocon.type === "loaded"
            ? remocon.props.background
            : DEFAULT_BACKGROUND,
      }}
    >
      <a className="viewer-editor-link" href="/editor.html">
        <RiEditLine aria-hidden="true" size={16} />
        Editor
      </a>
      <div className="content" inert={busy}>
        {remocon.type === "loading" && <p>読み込み中…</p>}
        {remocon.type === "error" && <p role="alert">{remocon.message}</p>}
        {remocon.type === "loaded" && (
          <RemoteKeySender onSendCode={onSendCode}>
            <RemoteKeyLayout
              keys={remocon.props.keys}
              cellsPerKey={remocon.props.grid.unit}
              columns={remocon.props.grid.columns}
              iconRender={remocon.iconRender}
            />
          </RemoteKeySender>
        )}
      </div>
    </main>
  );
}
