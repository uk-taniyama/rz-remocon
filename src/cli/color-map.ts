/*
 * `default-color-map` コマンド。既定の色マップを、`color-map.json` として書き出す。
 * 書き出したファイルの色を書き換えると、エディタの新規キーや標準のリモコンの色に反映される。
 */
import fs from "node:fs";
import path from "node:path";
import { defaultColorMap } from "../api";

/** `default-color-map` コマンドのオプション。 */
export type DefaultColorMapCommandOpts = {
  /** 出力先のディレクトリ。`color-map.json` を出力する。 */
  outputDir: string;
  /** すでにファイルがある場合に、上書きするか。 */
  force?: boolean;
};

/**
 * 既定の色マップを、`color-map.json` の内容（JSON 文字列）にする。
 * DEFAULT は、どのキーも kind（最後は etc）に解決されて使われないため、含めない。
 */
export function buildDefaultColorMapJson(): string {
  const colors = Object.fromEntries(
    Object.entries(defaultColorMap).filter(([name]) => name !== "DEFAULT"),
  );
  return `${JSON.stringify(colors, null, 2)}\n`;
}

/**
 * `default-color-map` コマンドを実行し、`color-map.json` を書き出す。
 *
 * @param options - コマンドのオプション。
 * @throws ファイルがすでにあり、`force` が指定されていない場合（編集済みの内容を失わないため）。
 */
export function commandDefaultColorMap(
  options: DefaultColorMapCommandOpts,
): void {
  const outputDir = path.resolve(options.outputDir);
  const file = path.join(outputDir, "color-map.json");
  if (fs.existsSync(file) && !options.force) {
    throw new Error(
      `${file} がすでにあります。上書きする場合は --force を指定してください`,
    );
  }
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(file, buildDefaultColorMapJson());
  console.log(`${file} を書き出しました`);
}
