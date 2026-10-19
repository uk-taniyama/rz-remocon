import { oc as base } from "@orpc/contract";
import { z } from "zod";
import {
  editorDataSchema,
  keyCodeSchema,
  revisionConflictDataSchema,
  saveEditorInputSchema,
  saveEditorOutputSchema,
  storageErrorDataSchema,
} from "./schema";

/**
 * すべての API に共通のエラー定義。
 */
export const errors = {
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: "REGZA との通信に失敗しました",
    data: z.string().describe("エラーの詳細メッセージ"),
  },
};

/**
 * 編集用データ API のエラー定義。
 * 共通の INTERNAL_SERVER_ERROR は REGZA との通信失敗を想定したメッセージのため、別に定義している。
 */
export const remoconConfigErrors = {
  STORAGE_ERROR: {
    status: 500,
    message: "リモコン設定の読み書きに失敗しました",
    data: storageErrorDataSchema,
  },
  REVISION_CONFLICT: {
    status: 409,
    message: "別の場所で更新されたため、保存できませんでした",
    data: revisionConflictDataSchema,
  },
};

const oc = base.errors(errors);

export const sendCode = oc
  .route({
    method: "POST",
    summary: "リモコンキー送信",
    description: "キーコードを受け取り、REGZA API のステータスコードを返す",
    tags: ["REGZA"],
    successDescription: "REGZA API が返したステータスコード",
  })
  .input(
    z.object({
      code: keyCodeSchema,
    }),
  )
  .output(z.number().describe("REGZA API のステータスコード"));

export const status = oc
  .route({
    method: "GET",
    summary: "ヘルスチェック API",
    description: "REGZA への接続を確認する",
    tags: ["REGZA"],
    successDescription: "REGZA API が返したステータスコード",
  })
  .output(z.number().describe("REGZA API のステータスコード"));

export const getEditorData = oc
  .errors(remoconConfigErrors)
  .route({
    method: "GET",
    path: "/editor",
    summary: "編集用データ取得",
    description:
      "エディタで編集するリモコン設定を返す。" +
      "未保存、または保存済みデータが不正な場合、config は null。" +
      "不正な場合は invalid が true になり、返した revision で保存すると上書きされる",
    tags: ["Editor"],
    successDescription: "編集用のリモコン設定とリビジョン",
  })
  .output(editorDataSchema);

export const saveEditorData = oc
  .errors(remoconConfigErrors)
  .route({
    method: "PUT",
    path: "/editor",
    summary: "編集用データ保存",
    description:
      "編集用のリモコン設定を保存し、あわせて表示用のデータをサーバーで導出して保存する。" +
      "渡したリビジョンが最新でない場合は、保存せずに 409 を返す",
    tags: ["Editor"],
    successDescription: "保存後のリビジョン",
  })
  .input(saveEditorInputSchema)
  .output(saveEditorOutputSchema);

/**
 * API のパスプレフィックス。
 */
export const apiPrefix = "/api";

/**
 * API の契約（エンドポイント定義の集合）。
 */
export const contract = {
  sendCode,
  status,
  editor: {
    get: getEditorData,
    save: saveEditorData,
  },
};

/**
 * API の契約の型。
 */
export type Contract = typeof contract;
