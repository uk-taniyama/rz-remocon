import { z } from "zod";

/**
 * 座標はセル単位の整数で表す。
 *
 * - 1キーあたりのセル数は `grid.unit` で指定する（既定値は 4）。
 * - キー単位や rem 単位への換算は描画側で行う。
 */

/** #RRGGBB 形式の色のスキーマ。 */
export const hexColorSchema = z
  .string()
  .regex(/^#[0-9a-f]{6}$/i)
  .describe("色（#RRGGBB）");

/** リモコン全体の既定の背景色。 */
export const DEFAULT_BACKGROUND = "#ffffff";

/** リモコン全体の背景色のスキーマ。 */
const backgroundSchema = hexColorSchema.describe("リモコン全体の背景色");

/** キーコードのスキーマ。 */
export const keyCodeSchema = z
  .string()
  .regex(/^[0-9A-F]{6}$/i)
  .describe("キーコード（6桁の16進数）");

/** キーの位置と大きさを表すスキーマ。 */
export const rect = {
  x: z.number().int().min(0).describe("左端の位置（セル）"),
  y: z.number().int().min(0).describe("上端の位置（セル）"),
  w: z.number().int().min(1).describe("幅（セル）"),
  h: z.number().int().min(1).describe("高さ（セル）"),
};

/** グリッドの寸法を表すスキーマ。 */
export const gridSchema = z.object({
  columns: z.number().int().positive().describe("グリッドの幅（セル数）"),
  unit: z.number().int().positive().describe("1キーのセル数"),
});

/** 表示用リモコン設定に含まれるキーのスキーマ。 */
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
    .describe("表示するラベル。非表示の場合は省略される"),
  icon: z
    .string()
    .optional()
    .describe("アイコン名（標準の名前）または画像 URL。省略するとアイコンなし"),
  color: hexColorSchema.describe("背景色"),
  ...rect,
});

/** 表示用リモコン設定のスキーマ。 */
export const remoconConfigSchema = z.object({
  version: z.literal(1),
  grid: gridSchema,
  background: backgroundSchema,
  keys: z.array(remoteKeyConfigSchema),
});

/** 表示用リモコン設定のキー型。 */
export type RemoteKeyConfig = z.infer<typeof remoteKeyConfigSchema>;
/** 表示用リモコン設定の型。 */
export type RemoconConfig = z.infer<typeof remoconConfigSchema>;

// Editor

/** 編集用リモコン設定に含まれるキーのスキーマ。 */
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
    .describe("アイコン名（標準の名前）または画像 URL。省略するとアイコンなし"),
  color: hexColorSchema.describe("背景色"),
});

/**
 * 編集用リモコン設定のスキーマ。
 *
 * - 編集内容を保持し、非表示のラベルも保存する。
 * - 表示用設定は {@link toRemoconConfig} で導出する。
 * - キー ID の重複と、グリッド幅からのはみ出しを検証する。
 * - キーの縦方向の範囲と、キー同士の重なりは検証しない。
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

/** 編集用リモコン設定のキー型。 */
export type EditorRemoteKeyConfig = z.infer<typeof editorRemoteKeyConfigSchema>;
/** 編集用リモコン設定の型。 */
export type EditorRemoconConfig = z.infer<typeof editorRemoconConfigSchema>;

// Editor Errors

/** `STORAGE_ERROR` の data のスキーマ。 */
export const storageErrorDataSchema = z
  .string()
  .describe("エラーの詳細メッセージ");

/** `REVISION_CONFLICT` の data のスキーマ。 */
export const revisionConflictDataSchema = z
  .object({
    revision: z.string().describe("サーバー上の最新のリビジョン"),
  })
  .describe("競合の詳細");

export type StorageErrorData = z.infer<typeof storageErrorDataSchema>;
export type RevisionConflictData = z.infer<typeof revisionConflictDataSchema>;

/** 編集用データ API のエラーコード。 */
export const editorErrorCodes = ["STORAGE_ERROR", "REVISION_CONFLICT"] as const;
export type EditorErrorCode = (typeof editorErrorCodes)[number];

// Editor data (GET /editor の結果)

/**
 * 編集用データの取得結果のスキーマ。
 *
 * - 未保存の場合は `config: null`、`invalid: false`。
 * - 正常な保存データがある場合は `config` に設定内容を返す。
 * - 保存データが不正な場合は `config: null`、`invalid: true`。
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
