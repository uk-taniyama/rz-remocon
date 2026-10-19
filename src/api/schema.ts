import { z } from "zod";

/*
 * ==========================================================================
 * 座標の単位
 * ==========================================================================
 *
 * 保存するファイルは次の2つ。どちらも、座標 x / y / w / h は「セル」単位の整数で表す。
 *
 *   remocon.editor.json（編集用。正本）: editorRemoconConfigSchema
 *   remocon.json（表示用。editor から導出）: remoconConfigSchema
 *
 * 1キーのセル数は grid.unit で指定する（既定は 4）。
 * キー単位や rem への換算は描画側で行い、このファイルでは行わない。
 * ==========================================================================
 */

export const hexColorSchema = z
  .string()
  .regex(/^#[0-9a-f]{6}$/i)
  .describe("色（#RRGGBB）");

/**
 * リモコン全体の背景色の既定値（白）。
 * Builder で背景色を省略した場合、エディタでの新規作成時、読み込み中の表示に使用する。
 * 保存済みファイルでは背景色が必須のため、読み込んだデータには適用しない。
 */
export const DEFAULT_BACKGROUND = "#ffffff";

/** リモコン全体の背景色のスキーマ（必須）。 */
const backgroundSchema = hexColorSchema.describe("リモコン全体の背景色");

/** キーコードのスキーマ */
export const keyCodeSchema = z
  .string()
  .regex(/^[0-9A-F]{6}$/i)
  .describe("キーコード（6桁の16進数）");

/** キーの位置と大きさ（単位はセル、整数）。editor と remocon で共通。 */
export const rect = {
  x: z.number().int().min(0).describe("左端の位置（セル）"),
  y: z.number().int().min(0).describe("上端の位置（セル）"),
  w: z.number().int().min(1).describe("幅（セル）"),
  h: z.number().int().min(1).describe("高さ（セル）"),
};

/** グリッドの寸法のスキーマ。columns（グリッドの幅）と unit（1キーの大きさ）は、どちらもセル単位。 */
export const gridSchema = z.object({
  columns: z.number().int().positive().describe("グリッドの幅（セル数）"),
  unit: z.number().int().positive().describe("1キーのセル数"),
});

/**
 * 表示用のキー1個分（remocon.json）のスキーマ。
 * editorRemoteKeyConfigSchema から導出する（api/utils.ts の toRemoconConfig）。
 * 編集用の id と showLabel は持たない。
 */
export const remoteKeyConfigSchema = z.object({
  name: z.string().describe("キー名（カタログのキー名。カスタムは custom）"),
  code: z
    .union([z.literal(""), keyCodeSchema])
    .optional()
    .describe(
      "送信するキーコード。空または省略なら、押せない（ラベルだけの）キー",
    ),
  label: z
    .string()
    .optional()
    .describe("表示するラベル。editor の showLabel が false なら省略される"),
  icon: z
    .string()
    .optional()
    .describe(
      "アイコン名（標準の名前）か画像 URL。描画側（defaultIconRender）で解決する。省略するとアイコンなし",
    ),
  color: hexColorSchema.describe("背景色"),
  ...rect,
});

/** 表示用のリモコン設定（remocon.json）のスキーマ。リモコン画面（/）が読み込んで描画する。 */
export const remoconConfigSchema = z.object({
  version: z.literal(1),
  grid: gridSchema,
  background: backgroundSchema,
  keys: z.array(remoteKeyConfigSchema),
});

export type RemoteKeyConfig = z.infer<typeof remoteKeyConfigSchema>;
export type RemoconConfig = z.infer<typeof remoconConfigSchema>;

// Editor

/** 編集用のキー1個分（remocon.editor.json）のスキーマ。 */
export const editorRemoteKeyConfigSchema = z.object({
  id: z.string().describe("エディタ上のキーID（ファイル内で一意）"),
  name: z.string().describe("カタログのキー名。カスタムは custom"),
  code: z
    .union([z.literal(""), keyCodeSchema])
    .optional()
    .describe(
      "送信するキーコード。空または省略なら、押せない（ラベルだけの）キー",
    ),
  ...rect,
  label: z.string().optional().describe("ラベル（非表示でも保持する）"),
  showLabel: z.boolean().describe("ラベルを表示するか"),
  icon: z
    .string()
    .optional()
    .describe(
      "アイコン名（標準の名前）か画像 URL。描画側（defaultIconRender）で解決する。省略するとアイコンなし",
    ),
  color: hexColorSchema.describe("背景色"),
});

/**
 * 編集用のリモコン設定（remocon.editor.json）のスキーマ。正本として扱う。
 *
 * 編集内容をそのまま保存する（例: ラベルを隠していても、文字列は残す）。
 * 表示用の remocon.json は、toRemoconConfig()（api/utils.ts）で導出する。
 *
 * 保存時の検証（check）は次の2つのみ。
 * - キー ID が重複していない。
 * - x + w が grid.columns を超えない（幅がはみ出さない）。
 *
 * y / h の範囲と、キー同士の重なりは検証しない。
 */
export const editorRemoconConfigSchema = z
  .object({
    version: z.literal(1).describe("ファイル形式のバージョン"),
    grid: gridSchema,
    background: backgroundSchema,
    keys: z.array(editorRemoteKeyConfigSchema),
  })
  .check((ctx) => {
    const { grid, keys } = ctx.value;
    const seen = new Set<string>();

    keys.forEach((key, i) => {
      if (seen.has(key.id)) {
        ctx.issues.push({
          code: "custom",
          message: `IDが重複しています: ${key.id}`,
          input: key.id,
          path: ["keys", i, "id"],
        });
      }
      seen.add(key.id);

      if (key.x + key.w > grid.columns) {
        ctx.issues.push({
          code: "custom",
          message: "キーがグリッドの幅をはみ出しています",
          input: key.w,
          path: ["keys", i, "w"],
        });
      }
    });
  });

export type EditorRemoteKeyConfig = z.infer<typeof editorRemoteKeyConfigSchema>;
export type EditorRemoconConfig = z.infer<typeof editorRemoconConfigSchema>;

// Editor Errors

/** STORAGE_ERROR の data のスキーマ。読み書きに失敗した理由を表すメッセージ。 */
export const storageErrorDataSchema = z
  .string()
  .describe("エラーの詳細メッセージ");

/** REVISION_CONFLICT の data のスキーマ。サーバー上の最新のリビジョンを返す。 */
export const revisionConflictDataSchema = z
  .object({
    revision: z.string().describe("サーバー上の最新のリビジョン"),
  })
  .describe("競合の詳細");

export type StorageErrorData = z.infer<typeof storageErrorDataSchema>;
export type RevisionConflictData = z.infer<typeof revisionConflictDataSchema>;

/** 編集用データ API が返すエラーコード。 */
export const editorErrorCodes = ["STORAGE_ERROR", "REVISION_CONFLICT"] as const;
export type EditorErrorCode = (typeof editorErrorCodes)[number];

// Editor data (GET /editor の結果)

/**
 * 編集用データの取得結果のスキーマ。
 * - 未保存: config = null, invalid = false
 * - 保存済み: config = 保存内容, invalid = false
 * - 保存済みだが不正: config = null, invalid = true
 */
export const editorDataSchema = z
  .object({
    revision: z.string().describe("保存時に渡すリビジョン"),
    config: editorRemoconConfigSchema
      .nullable()
      .describe("未保存、または保存済みデータが不正な場合は null"),
    invalid: z
      .boolean()
      .describe(
        "保存済みデータが壊れている場合は true。revision を渡して保存すると上書きされる",
      ),
  })
  .describe("編集用データの取得結果");

export type EditorData = z.infer<typeof editorDataSchema>;

// Save (PUT /editor の入出力)

/** 編集用データの保存リクエストのスキーマ。 */
export const saveEditorInputSchema = z
  .object({
    revision: z
      .string()
      .nullable()
      .describe("取得時のリビジョン。初回保存の場合は null"),
    config: editorRemoconConfigSchema,
  })
  .describe("編集用データの保存リクエスト");

/** 編集用データの保存結果のスキーマ。 */
export const saveEditorOutputSchema = z
  .object({
    revision: z.string().describe("保存後のリビジョン"),
  })
  .describe("編集用データの保存結果");

export type SaveEditorInput = z.infer<typeof saveEditorInputSchema>;
export type SaveEditorResult = z.infer<typeof saveEditorOutputSchema>;
