import { useEffect, useMemo, useState } from "react";
import { type RemoconConfig, remoconConfigSchema } from "../../api";
import type { RemoteKeyIconRender } from "./types";
import { useIconSet } from "./useIconUrls";

/*
 * remocon.json の座標はセル単位で、そのまま表示に使用する。
 * 単位の換算は RemoteKeyLayout.tsx の中だけで行い、ここでは変換しない。
 *
 * 保存側（api/utils.ts の toRemoconConfig）は、編集用データの x, y, w, h を
 * 変更せずにコピーしている。そのため remocon.json は、remocon.editor.json と同じ単位（セル）になる。
 */

/** remocon.json の取得先 URL。 */
export const REMOCON_CONFIG_URL = "/data/remocon.json";

export type RemoconFileState =
  | { type: "loading" }
  | { type: "loaded"; props: RemoconConfig }
  | { type: "error"; message: string };

/** remocon.json を読み込むフック。毎回サーバーから取得し直す。 */
export function useRemoconFile(): RemoconFileState {
  const [state, setState] = useState<RemoconFileState>({ type: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetch(REMOCON_CONFIG_URL, { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 404) {
          throw new Error(
            "リモコン設定がありません。エディタで保存してください。",
          );
        }
        if (!response.ok) {
          throw new Error(`読み込みに失敗しました (${response.status})`);
        }
        const parsed = remoconConfigSchema.safeParse(await response.json());
        if (!parsed.success) {
          throw new Error("リモコン設定の形式が不正です");
        }
        return parsed.data;
      })
      .then(
        (props) => {
          if (!cancelled) {
            setState({ type: "loaded", props });
          }
        },
        (error: unknown) => {
          if (!cancelled) {
            setState({
              type: "error",
              message: error instanceof Error ? error.message : String(error),
            });
          }
        },
      );

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

/** リモコン設定の読み込み状態。 */
export type RemoconDataState =
  | { type: "loading" }
  | {
      type: "loaded";
      props: RemoconConfig;
      iconRender: RemoteKeyIconRender;
    }
  | { type: "error"; message: string };

/**
 * ビューア用のフック。
 * - remocon.json と icon-urls.json を読み込み、描画に必要なものをまとめて返す。
 * - 両方が揃うまでは loading とする（名前のアイコンが、壊れた画像として一瞬表示されるのを防ぐため）。
 * - icon-urls.json に問題がある場合も、表示は止めず、警告（console.warn）の出力だけにする。
 */
export function useRemoconData(): RemoconDataState {
  const file = useRemoconFile();
  const { ready, iconRender } = useIconSet();

  return useMemo<RemoconDataState>(() => {
    if (file.type !== "loaded") return file;
    if (!ready) return { type: "loading" };
    return { type: "loaded", props: file.props, iconRender };
  }, [file, ready, iconRender]);
}
