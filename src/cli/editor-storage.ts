import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  type EditorRemoconConfig,
  editorRemoconConfigSchema,
  remoconConfigSchema,
  toRemoconConfig,
} from "../api";

/** データの保存先ディレクトリ。起動時に configureEditorStorage() で設定する。 */
let dataDir = path.resolve("./data");

/** 編集用データの保存先の設定。 */
export interface EditorStorageOptions {
  dataDir: string;
}

/** 保存先を設定する。サーバーの起動時に、一度だけ呼び出す。 */
export function configureEditorStorage(options: EditorStorageOptions) {
  dataDir = options.dataDir;
}

const editorFile = () => path.join(dataDir, "remocon.editor.json");
const remoconFile = () => path.join(dataDir, "remocon.json");
/** 上書きする直前の編集用データの控え。直前の1世代だけを残す。 */
const backupFile = () => path.join(dataDir, "remocon.editor.json.bak");

/** ファイルがまだ存在しない場合のリビジョン。初回保存時の null も、同じ値として扱う。 */
const EMPTY_REVISION = "0";

/** 保存の結果。競合した場合は、保存せずに最新のリビジョンを返す。 */
export type SaveOutcome =
  | { type: "saved"; revision: string }
  | { type: "conflict"; revision: string };

/** ファイルの内容からリビジョンを算出する。ファイルが存在しない場合（null）は EMPTY_REVISION を返す。 */
function revisionOf(text: string | null): string {
  if (text === null) return EMPTY_REVISION;
  return createHash("sha256").update(text).digest("hex").slice(0, 16);
}

/** ファイルをテキストとして読み込む。ファイルが存在しない場合は null を返す。 */
async function readText(file: string): Promise<string | null> {
  try {
    return await readFile(file, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

/** 一時ファイルに書き込んでから置き換える。書き込みの途中で処理が失敗しても、不完全なファイルは残らない。 */
async function writeAtomic(file: string, text: string) {
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, text, "utf8");
  await rename(tmp, file);
}

const toJson = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

/** 読み込み、比較、書き込みの一連の処理を、プロセス内で1つずつ順番に実行するためのロック。 */
let lock: Promise<unknown> = Promise.resolve();
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const result = lock.then(fn);
  lock = result.catch(() => {});
  return result;
}

/** 編集用データの読み込み結果。GET /editor の結果と同じ形式。 */
export type LoadResult = {
  revision: string;
  config: EditorRemoconConfig | null;
  invalid: boolean;
};

/**
 * 編集用データ（remocon.editor.json）を読み込む。
 * 内容が不正な場合は例外にせず、invalid を true にして返す。
 *
 * @throws ファイルの読み込みに失敗した場合。
 */
export async function loadEditorConfig(): Promise<LoadResult> {
  const text = await readText(editorFile()); // 読み込みに失敗した場合は、そのまま例外を投げる（STORAGE_ERROR になる）
  if (text === null) {
    return { revision: EMPTY_REVISION, config: null, invalid: false };
  }

  const revision = revisionOf(text);
  try {
    const config = editorRemoconConfigSchema.parse(JSON.parse(text));
    return { revision, config, invalid: false };
  } catch (error) {
    // 内容が不正な場合は例外にせず、リビジョンを返して、上書き保存できるようにする。
    console.error(`${editorFile()} の内容が不正です`, error);
    return { revision, config: null, invalid: true };
  }
}

/**
 * 編集用データ（remocon.editor.json）と、そこから導出した表示用データ（remocon.json）を保存する。
 * 既存の編集用データは、上書きの前に remocon.editor.json.bak へ控える（直前の1世代）。
 * expectedRevision が現在のリビジョンと一致しない場合は、保存せずに競合として返す。
 *
 * @param expectedRevision - 読み込み時のリビジョン。初回保存の場合は null。
 * @param config - 保存する編集用データ。
 */
export function saveEditorConfig(
  expectedRevision: string | null,
  config: EditorRemoconConfig,
): Promise<SaveOutcome> {
  return withLock(async () => {
    const previousText = await readText(editorFile());
    const current = revisionOf(previousText);
    if ((expectedRevision ?? EMPTY_REVISION) !== current) {
      return { type: "conflict", revision: current };
    }

    // 導出と検証を先に行い、書き込みの前に失敗させる。
    const editorText = toJson(config);
    const remoconText = toJson(
      remoconConfigSchema.parse(toRemoconConfig(config)),
    );

    await mkdir(dataDir, { recursive: true });
    // 上書きの前に、直前の内容を控えとして残す（壊れたファイルや、Reset 後の保存で、元の内容を失わないため）。
    // 控えを残せない場合は、保存しない。
    if (previousText !== null) {
      await writeAtomic(backupFile(), previousText);
    }
    // 正本は最後に書き込む。表示用だけを書き込んだ時点で失敗しても、リビジョンは変わらないため、再保存できる。
    await writeAtomic(remoconFile(), remoconText);
    await writeAtomic(editorFile(), editorText);

    return { type: "saved", revision: revisionOf(editorText) };
  });
}
