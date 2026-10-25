/*
 * 静的リモコンの入力（`remocon.json`、`icon-urls.json`、`color-map.json`）の読み込み。
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  type IconUrls,
  parseColorMap,
  parseIconUrls,
  type RemoconConfig,
  remoconConfigSchema,
} from "../api";

/** 入力 JSON と同じディレクトリにある、`icon-urls.json` のパスを返す。 */
export function defaultIconUrlsPath(inputJson: string): string {
  return path.join(path.dirname(path.resolve(inputJson)), "icon-urls.json");
}

/**
 * 名前から値への対応表を読み込む共通の処理。
 *
 * - `required` が `false` の場合、ファイルが存在しなければ `empty` を返す。
 * - `required` が `true` の場合、ファイルが存在しなければエラーを投げる。
 * - `required` の値にかかわらず、ファイルの読み込みまたは JSON の解析に失敗した場合はエラーを投げる。
 * - 不正な項目がある場合は、警告を出して不正な項目だけを除外し、正常な項目を返す。
 *
 * @param file - JSON ファイルのパス。
 * @param required - ファイルの存在を必須とするか。
 * @param label - メッセージに表示する名称（「アイコン設定」など）。
 * @param empty - ファイルがない場合の、空の対応表。
 * @param parse - JSON として読み込んだ値を、対応表とエラーに変換する関数。
 */
function loadJsonTableFile<T>(
  file: string,
  required: boolean,
  label: string,
  empty: T,
  parse: (json: unknown) => { table: T; errors: string[] },
): T {
  const target = path.resolve(file);
  if (!required && !existsSync(target)) {
    return empty;
  }

  let json: unknown;
  try {
    json = JSON.parse(readFileSync(target, "utf8"));
  } catch (error) {
    throw new Error(
      `${label}を読み込めません: ${target}\n${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const { table, errors } = parse(json);
  if (errors.length > 0) {
    console.warn(
      `${label}に使えない項目があります（飛ばします）: ${target}\n${errors.map((message) => `  - ${message}`).join("\n")}`,
    );
  }

  return table;
}

/**
 * ファイルを読み込み、アイコン URL 対応表を返す。
 *
 * - `required` が `false` の場合、ファイルが存在しなければ空のアイコン URL 対応表を返す。
 * - `required` が `true` の場合、ファイルが存在しなければエラーを投げる。
 * - `required` の値にかかわらず、ファイルの読み込みまたは JSON の解析に失敗した場合はエラーを投げる。
 * - 不正な項目がある場合は、警告を出して不正な項目だけを除外し、正常な項目を返す。
 *
 * @param file - `icon-urls.json` のパス。
 * @param required - ファイルの存在を必須とするか。
 */
export function loadIconUrlsFile(file: string, required: boolean): IconUrls {
  return loadJsonTableFile<IconUrls>(
    file,
    required,
    "アイコン設定",
    {},
    (json) => {
      const { urls, errors } = parseIconUrls(json);
      return { table: urls, errors };
    },
  );
}

/**
 * `color-map.json` を読み込み、色マップを返す。
 *
 * - 既定の色に上書きする分だけを書く。
 * - {@link rz-remocon-api#mergeColorMap} に渡すと、既定の色に重ねられる。
 * - `required` が `false` の場合、ファイルが存在しなければ空の色マップを返す。
 * - `required` が `true` の場合、ファイルが存在しなければエラーを投げる。
 * - `required` の値にかかわらず、ファイルの読み込みまたは JSON の解析に失敗した場合はエラーを投げる。
 * - 不正な項目がある場合は、警告を出して不正な項目だけを除外し、正常な項目を返す。
 *
 * @param file - `color-map.json` のパス。
 * @param required - ファイルの存在を必須とするか。
 */
export function loadColorMapFile(
  file: string,
  required: boolean,
): Record<string, string> {
  return loadJsonTableFile<Record<string, string>>(
    file,
    required,
    "色設定",
    {},
    (json) => {
      const { colors, errors } = parseColorMap(json);
      return { table: colors, errors };
    },
  );
}

/**
 * `remocon.json` を読み込み、リモコン設定として検証する。
 *
 * @param input - `remocon.json` のパス。
 * @returns 検証済みのリモコン設定。
 * @throws ファイルの読み込み、JSON の解析、または設定の検証に失敗した場合。
 */
export function loadRemoconConfig(input: string): RemoconConfig {
  let config: unknown;

  try {
    config = JSON.parse(readFileSync(input, "utf8"));
  } catch (error) {
    throw new Error(
      `設定ファイルを読み込めません: ${input}\n${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const parsed = remoconConfigSchema.safeParse(config);
  if (!parsed.success) {
    throw new Error(`リモコン設定の形式が不正です\n${parsed.error.message}`);
  }

  return parsed.data;
}
