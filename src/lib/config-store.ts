import fs from "node:fs/promises";

/**
 * 設定用ストア。
 */
export interface ConfigStore<T> {
  /**
   * 設定を読み込む。
   *
   * @returns 読み込んだ設定。
   */
  load(): Promise<T>;
  /**
   * 設定を保存する。
   *
   * @param config - 保存する設定。
   */
  save(config: T): Promise<void>;
}

/**
 * @internal
 * 未設定状態の設定ストアを生成する。
 *
 * - 読み込みも保存も、常にエラーを投げる。
 *
 * @returns 未設定状態の設定ストア。
 */
export function createUnconfiguredStore<T>(): ConfigStore<T> {
  const fail = async (): Promise<never> => {
    throw new Error("ConfigStore が設定されていません。");
  };
  return { load: fail, save: fail };
}

/**
 * ファイルを使用する設定ストアのオプション。
 */
export interface FileConfigStoreOptions {
  /** ファイルが存在しない場合のエラーメッセージ。 */
  notFoundMessage?: string;
}

/**
 * ファイルに設定を保存する設定ストアを生成する。
 *
 * - 設定は JSON 形式で保存する。
 * - ファイルのパーミッションは `0600` に設定する。
 *
 * @param path - 設定ファイルのパス。
 * @param options - 設定ストアのオプション。
 * @returns ファイルを使用する設定ストア。
 */
export function createFileConfigStore<T>(
  path: string,
  options: FileConfigStoreOptions = {},
): ConfigStore<T> {
  return {
    async save(config) {
      await fs.writeFile(path, `${JSON.stringify(config, null, 2)}\n`, {
        mode: 0o600,
      });
    },

    async load() {
      let text: string;
      try {
        text = await fs.readFile(path, "utf8");
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
          throw new Error(
            options.notFoundMessage ?? `設定ファイルがありません: ${path}`,
          );
        }
        throw error;
      }

      return JSON.parse(text) as T;
    },
  };
}

/**
 * 読み取り専用の設定ストアを生成する。
 *
 * - 読み込みは可能だが、保存するとエラーを投げる。
 *
 * @param data - ストアから読み込む設定。
 * @returns 読み取り専用の設定ストア。
 */
export function createReadonlyStore<T>(data: T): ConfigStore<T> {
  return {
    async load() {
      return data;
    },

    async save() {
      throw new Error("設定は保存できません。");
    },
  };
}
