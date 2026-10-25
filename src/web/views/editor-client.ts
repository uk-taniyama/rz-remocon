import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type ApiFailure,
  type Client,
  type EditorRemoconConfig,
  safeApiCall,
} from "../../api";
import type { RemoteKeyIconRender } from "../remoteKeys";
import { useColorMap } from "../remoteKeys/useColorMap";
import { useIconSet } from "../remoteKeys/useIconUrls";
import { createEditorCatalog } from "./editor-catalog";
import type { RemoteKeyCatalogEntry } from "./editor-grid";

/** 読み込みが完了したエディタのデータ。 */
export type LoadedEditor = {
  revision: string;
  config: EditorRemoconConfig | null;
  /** 保存済みのデータが壊れている。`revision` を指定して保存すると上書きされる。 */
  invalid: boolean;
  /** キーのカタログ。アイコンの有無は、標準のアイコンとアイコン URL 対応表（`icon-urls.json`）で決定済み。 */
  catalog: RemoteKeyCatalogEntry[];
  /** アイコンを描画する関数（標準のアイコンと、アイコン URL 対応表（`icon-urls.json`）を使用する）。 */
  iconRender: RemoteKeyIconRender;
  /** `icon-urls.json` の読み込みで、使用できなかった項目の説明（なければ空）。 */
  iconWarnings: string[];
};

/** 保存の結果。保存できた場合、競合した場合、失敗した場合のいずれか。 */
export type SaveResult =
  | { type: "saved"; revision: string }
  | { type: "conflict"; serverRevision: string }
  | { type: "error"; message: string };

/** API の失敗を、画面に表示するメッセージに変換する。 */
function describeFailure(failure: ApiFailure): string {
  switch (failure.reason) {
    case "server_error":
      return typeof failure.data === "string" ? failure.data : failure.code;
    case "bad_request":
      return "入力内容が不正です";
    case "unexpected_status":
      return `予期しないエラー (${failure.status})`;
    case "network_error":
      return failure.detail;
  }
}

/**
 * 編集用データを保存する。例外は投げず、結果を判別可能な値で返す。
 *
 * @param client - API クライアント。
 * @param revision - 読み込み時のリビジョン。初回保存の場合は `null`。
 * @param config - 保存する編集用データ。
 */
export async function saveEditor(
  client: Client,
  revision: string | null,
  config: EditorRemoconConfig,
): Promise<SaveResult> {
  const result = await safeApiCall(client.editor.save({ revision, config }));
  if (result.ok) return { type: "saved", revision: result.value.revision };

  if (result.reason === "server_error" && result.code === "REVISION_CONFLICT") {
    const data = result.data as { revision?: string } | undefined;
    return { type: "conflict", serverRevision: data?.revision ?? "" };
  }
  return { type: "error", message: describeFailure(result) };
}

/** API から取得できる部分。アイコン URL 対応表（`icon-urls.json`）に由来するものは含まない。 */
type EditorDataResult = Omit<
  LoadedEditor,
  "catalog" | "iconRender" | "iconWarnings"
>;

type FetchState =
  | { type: "loading" }
  | { type: "loaded"; data: EditorDataResult }
  | { type: "error"; message: string };

type LoadState =
  | { type: "loading" }
  | { type: "loaded"; data: LoadedEditor }
  | { type: "error"; message: string };

/**
 * 編集用データを取得するフック。
 *
 * - `reload()` で、編集用データだけを読み直す。
 * - `reloadKey` は `EditorCanvas` の key に使用する。
 * - 読み込み済みの状態で `reload()` が失敗した場合は、画面をそのまま残し、`reloadError` に理由を入れる。
 * - 編集用データと `icon-urls.json`、`color-map.json` が揃うまでは `loading` とする。
 * - キーのカタログ（`catalog`）と、アイコンを描画する関数（`iconRender`）も、ここで生成して返す。
 * アイコン URL 対応表は、ページを開いたときに一度だけ読み込む（`reload` では読み直さない）。
 */
export function useEditorData(client: Client) {
  const [fetched, setState] = useState<FetchState>({ type: "loading" });
  const {
    ready: iconsReady,
    iconRender,
    hasIcon,
    warnings: iconWarnings,
  } = useIconSet();
  // `color-map.json` は、新しく追加するキーの色を決める。警告は console.warn だけに出す。
  const { ready: colorsReady, colorResolver } = useColorMap();
  const ready = iconsReady && colorsReady;
  const catalog = useMemo(
    () => createEditorCatalog(hasIcon, colorResolver),
    [hasIcon, colorResolver],
  );
  const state = useMemo<LoadState>(() => {
    if (fetched.type !== "loaded") return fetched;
    if (!ready) return { type: "loading" };
    return {
      type: "loaded",
      data: { ...fetched.data, catalog, iconRender, iconWarnings },
    };
  }, [fetched, ready, catalog, iconRender, iconWarnings]);
  // `reloadKey` は、読み込みに成功するたびに進める（`EditorCanvas` を、最新のデータで作り直すため）。
  const [reloadKey, setReloadKey] = useState(0);
  // `reload()` を呼ぶたびに進める。読み込みの effect は、これを依存に持つ。
  const [attempt, setAttempt] = useState(0);
  // 読み込み済みの画面があるときの `reload`（バックグラウンドの再読み込み）が失敗した理由。
  const [reloadError, setReloadError] = useState<string | null>(null);
  const loadedRef = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: attempt が変わったときに読み直す。
  useEffect(() => {
    let cancelled = false;
    // 読み込み済みなら、画面（編集中の内容）はそのまま残し、成功したときだけ差し替える。
    // 失敗しても、編集内容と「手元の内容で上書き」の選択肢を失わないため。
    const background = loadedRef.current;
    if (!background) setState({ type: "loading" });
    setReloadError(null);
    safeApiCall(client.editor.get()).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        loadedRef.current = true;
        setState({ type: "loaded", data: result.value });
        setReloadKey((k) => k + 1);
      } else if (background) {
        setReloadError(describeFailure(result));
      } else {
        setState({ type: "error", message: describeFailure(result) });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [client, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { state, reload, reloadKey, reloadError };
}
