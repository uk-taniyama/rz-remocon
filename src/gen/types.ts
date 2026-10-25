/**
 * JSON ファイルから静的リモコンを生成するときのオプション。
 */
export interface GenerateFromFileOpts {
  /** 入力する `remocon.json` のパス。 */
  inputJson: string;
  /** 出力先のディレクトリ。`index.html` と `assets/` を出力する。 */
  outputDir: string;
  /**
   * アイコン URL 対応表（`icon-urls.json`）のパス。
   *
   * - 省略した場合は、入力の `remocon.json` と同じディレクトリの `icon-urls.json` を使用する（存在しなければ空のアイコン URL 対応表）。
   * - 指定したファイルが見つからない場合は、エラーを投げる。
   */
  iconUrls?: string;
  /** @internal 開発用。 */
  isDev?: boolean;
}

/** JSON ファイルから静的リモコンを生成する関数の型。 */
export type GenerateFromFile = (opts: GenerateFromFileOpts) => Promise<void>;

export type GenExport = {
  _generateFromFile: GenerateFromFile;
};
