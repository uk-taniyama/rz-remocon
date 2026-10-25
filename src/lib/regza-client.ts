import {
  type ConfigStore,
  createReadonlyStore,
  createUnconfiguredStore,
} from "./config-store";
import { createDigestClient, decryptPassword } from "./utils";

export {
  type ConfigStore,
  createFileConfigStore,
  createReadonlyStore,
  type FileConfigStoreOptions,
} from "./config-store";

/** REGZA の HTTPS ポート。固定値。 */
const PORT = 4430;

// API のパス定義。
const PATHS = {
  // `public`（認証不要）
  requestConnection: "/v2/public/request_connection",
  publicSupport: "/public/support",
  publicFeature: "/public/feature",
  // `remote`（Digest 認証要）
  confirmConnection: "/v2/remote/confirm_connection",
  remoteSupport: "/v2/remote/support",
  remoteV2: "/v2/remote/remote",
  remote: "/remote/remote.htm",
} as const;

/**
 * 指定されたホストとパスから HTTPS URL を生成する。
 *
 * @param host - REGZA のホスト名または IP アドレス。
 * @param path - API のパス。
 * @returns 生成された HTTPS URL（ポートは {@link PORT} 固定）。
 */
const buildUrl = (host: string, path: string) =>
  `https://${host}:${PORT}${path}`;

/**
 * 指定されたパスにクエリパラメータを付加する。
 *
 * @param path - API のパス。
 * @param params - クエリパラメータ。
 * @returns クエリパラメータが付加されたパス。
 */
const withQuery = (path: string, params: Record<string, string>) =>
  `${path}?${new URLSearchParams(params)}`;

/**
 * @internal
 * REGZA への接続設定。
 *
 * 接続は 2 段階で確立する。段階によって `password` と `salt` の意味が変わる。
 *
 * - 接続要求後（{@link requestConnection}）:
 *   - `password` は REGZA が返した暗号化済みのパスワード。
 *   - `salt` はその復号に使う値。
 * - 接続確定後（{@link confirmConnection}）:
 *   - `password` は復号済みの平文パスワード。
 *   - `salt` は空文字。
 *
 * `salt` が空文字かどうかで、接続が確定済みかを判定する。
 */
export interface RegzaConfig {
  /** REGZA のホスト名または IP アドレス。 */
  host: string;
  /** 接続に使用するユーザー ID。 */
  userId: string;
  /** パスワード。確定前は暗号化済み、確定後は平文。 */
  password: string;
  /** パスワードの復号に使う値。確定後は空文字。 */
  salt: string;
}

let configStore = createUnconfiguredStore<RegzaConfig>();

/**
 * 使用する設定ストアを差し替える。
 *
 * @param store - 新しく使用する設定ストア。
 */
export function setRegzaConfigStore(store: ConfigStore<RegzaConfig>) {
  configStore = store;
}

/**
 * @internal
 * 接続情報を検証する。
 *
 * - 保存済みの設定を読み込み、接続が確定済みであることを検証する。
 * - 条件を満たさない場合は、次に行う操作を示すメッセージを付けてエラーを投げる。
 *
 * @returns 検証済みの設定。
 * @throws `host`・`userId`・`password` のいずれかが未設定の場合（未セットアップ）。
 * @throws `salt` が空でない場合（接続が未確定）。
 */
export async function validateRegzaConfig() {
  const config = await configStore.load();

  if (!config.host || !config.userId || !config.password) {
    throw new Error("設定がありません。先に setup してください。");
  }
  if (config.salt) {
    throw new Error("設定が完了していません。先に confirm してください。");
  }
  return config;
}

/**
 * @internal
 * 設定を固定する。
 *
 * - 現在の設定を {@link validateRegzaConfig} で検証し、その値を読み取り専用の設定ストアに差し替える。
 * - 以降は、固定した値が使われる。
 * - 固定後に保存を行った場合の挙動は、{@link createReadonlyStore} の実装に依存する。
 *
 * @throws 接続情報が不正の場合。
 */
export async function freezeRegzaConfig() {
  // 検証済みの値を取得
  const config = await validateRegzaConfig();
  // 取得した値を読み取り専用の設定ストアで保持
  setRegzaConfigStore(createReadonlyStore(config));
}

/**
 * @internal
 * Fetch のレスポンスの本文を解釈する。
 *
 * - 本文が空の場合は `null` を返す。
 * - JSON として解析できる場合は、解析した値を返す。
 * - それ以外の場合は、本文のテキストをそのまま返す。
 *
 * @param response - Fetch のレスポンス。
 * @returns 解釈したレスポンスの本文。
 */
async function parseResponse(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    const json = JSON.parse(text);
    return json;
  } catch {
    return text;
  }
}

// ---------------------------------------------------------------------------
// 低レイヤー: 認証方式ごとのリクエスト関数
//
// 通常は API レイヤーの関数を使用する。
//   `publicPostForm`      認証なしで、フォームを POST する
//   `regzaPublicRequest`  認証なしで、GET する（保存済みの設定を使用）
//   `digestRequest`       Digest 認証（資格情報を引数で指定）
//   `regzaAuthRequest`    Digest 認証（保存済みの設定を使用）
// ---------------------------------------------------------------------------

/**
 * 認証なしで、フォームを POST する。
 *
 * - 低レイヤーのリクエスト関数。
 * - 通常は API レイヤーの関数を使用する。
 * - 保存済みの設定は使用せず、ホストを引数で指定する。
 * - HTTP ステータスは検証しない。
 * - 本文が JSON ならその値、JSON でなければ文字列、空なら `null` が、検証なしで `T` として返る。
 *
 * @typeParam T - レスポンス本文の型。
 * @param host - REGZA のホスト名または IP アドレス。
 * @param path - API のパス。
 * @param form - 送信するフォームデータ。
 * @returns API のレスポンス。
 */
export async function publicPostForm<T>(
  host: string,
  path: string,
  form: Record<string, string>,
): Promise<T> {
  const url = buildUrl(host, path);
  console.log(`POST ${url}`, form);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(form),
  });

  return (await parseResponse(response)) as T;
}

/**
 * Digest 認証に使用する資格情報。
 */
export interface DigestCredentials {
  /** 接続時に指定したユーザー ID。 */
  userId: string;
  /** Digest 認証のパスワード。 */
  password: string;
}

/**
 * 指定した資格情報で、Digest 認証付きのリクエストを送信する。
 *
 * - 低レイヤーのリクエスト関数。
 * - 通常は API レイヤーの関数を使用する。
 * - HTTP ステータスは検証しない。
 * - 本文が JSON ならその値、JSON でなければ文字列、空なら `null` が、検証なしで `T` として返る。
 *
 * @typeParam T - レスポンス本文の型。
 * @param host - REGZA のホスト名または IP アドレス。
 * @param credentials - Digest 認証に使用する資格情報。
 * @param path - API のパス。
 * @param options - Fetch のリクエストオプション。
 * @returns API のレスポンス。
 */
export async function digestRequest<T>(
  host: string,
  credentials: DigestCredentials,
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const { userId, password } = credentials;
  const client = createDigestClient(userId, password);
  const response = await client.fetch(buildUrl(host, path), options);

  return (await parseResponse(response as Response)) as T;
}

/**
 * 保存済みのホストに、認証なしで GET リクエストを送信する。
 *
 * - 低レイヤーのリクエスト関数。
 * - 通常は API レイヤーの関数を使用する。
 * - 接続情報が不正の場合は、エラーを投げる。
 * - HTTP ステータスは検証しない。
 * - 本文が JSON ならその値、JSON でなければ文字列、空なら `null` が、検証なしで `T` として返る。
 *
 * @typeParam T - レスポンス本文の型。
 * @param path - API のパス。
 * @returns API のレスポンス。
 * @throws 接続情報が不正の場合。
 */
export async function regzaPublicRequest<T>(path: string): Promise<T> {
  const { host } = await validateRegzaConfig();
  const url = buildUrl(host, path);
  const response = await fetch(url, { method: "GET" });

  return (await parseResponse(response)) as T;
}

/**
 * 保存済みのホストに、Digest 認証付きのリクエストを送信する。
 *
 * - 低レイヤーのリクエスト関数。
 * - 通常は API レイヤーの関数を使用する。
 * - 接続情報が不正の場合は、エラーを投げる。
 * - HTTP ステータスは検証しない。
 * - 本文が JSON ならその値、JSON でなければ文字列、空なら `null` が、検証なしで `T` として返る。
 *
 * @typeParam T - レスポンス本文の型。
 * @param path - API のパス。
 * @param options - Fetch のリクエストオプション。
 * @returns API のレスポンス。
 * @throws 接続情報が不正の場合。
 */
export async function regzaAuthRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const { host, userId, password } = await validateRegzaConfig();
  return digestRequest(host, { userId, password }, path, options);
}

// ---------------------------------------------------------------------------
// API レイヤー
// ---------------------------------------------------------------------------

/**
 * REGZA API の共通レスポンス。
 */
export interface RegzaResponse {
  /** REGZA API のステータス。`0` が成功。 */
  status: number;
}

/**
 * 接続要求 API のレスポンス。
 */
export interface ConnectionResponse extends RegzaResponse {
  /** 暗号化されたパスワード。復号には REGZA に表示された PIN が必要。 */
  password: string;
  /** パスワードの復号に使う値。 */
  salt: string;
}

/**
 * REGZA に接続を要求する。
 *
 * - REGZA の接続手順の最初に呼び出す。
 * - 既存の設定があっても、無条件に接続を要求する。
 * - REGZA が返した接続情報で設定ストアを上書きする（この時点では接続は未確定）。
 * - この関数のあとに REGZA の画面に PIN が表示されるので、{@link confirmConnection} に PIN を指定して接続を確定する。
 *
 * @param host - REGZA のホスト名または IP アドレス。
 * @param userId - 接続に使用するユーザー ID。
 * @throws REGZA が成功（`status` が `0`）を返さなかった場合。
 */
export async function requestConnection(host: string, userId: string) {
  const regza = await publicPostForm<ConnectionResponse>(
    host,
    PATHS.requestConnection,
    { user_id: userId },
  );
  if (regza.status !== 0) {
    throw new Error(`request_connection failed: ${JSON.stringify(regza)}`);
  }

  await configStore.save({
    host,
    userId,
    password: regza.password,
    salt: regza.salt,
  });
}

/**
 * REGZA の接続を確定する。
 *
 * - {@link requestConnection} 実行後に呼び出す。
 * - 確定した接続情報を設定ストアに保存する。
 *
 * @param pin - REGZA に表示された PIN。
 * @throws {@link requestConnection} が済んでいない場合。
 * @throws REGZA が成功（`status` が `0`）を返さなかった場合。
 */
export async function confirmConnection(pin: string) {
  const config = await configStore.load();
  if (!config.host || !config.userId || !config.password || !config.salt) {
    throw new Error("設定がありません。先に setup してください。");
  }

  const password = decryptPassword(config.password, pin, config.salt);
  const response = (await digestRequest(
    config.host,
    { userId: config.userId, password },
    PATHS.confirmConnection,
    { method: "POST", body: "" },
  )) as RegzaResponse;
  if (response.status !== 0) {
    throw new Error(`confirm_connection failed: ${JSON.stringify(response)}`);
  }

  await configStore.save({
    host: config.host,
    userId: config.userId,
    password,
    salt: "",
  });
}

/**
 * REGZA がサポートするリモートコマンド。
 */
export interface SupportCommand {
  /** コマンドの HTTP メソッド。 */
  http_method: string;
  /** コマンドのパス。 */
  resource: string;
  /** コマンドが受け取るパラメータ名の一覧。 */
  params: string[];
}

/**
 * リモートサポート API のレスポンス。
 */
export interface SupportResponse extends RegzaResponse {
  /** サポートしているコマンドの一覧。 */
  command: SupportCommand[];
}

/**
 * REGZA がサポートするリモートコマンドの一覧を取得する。
 *
 * @returns リモートサポート API のレスポンス（コマンドの一覧を含む）。
 * @throws 接続情報が不正の場合。
 */
export async function getSupport(): Promise<SupportResponse> {
  return regzaAuthRequest<SupportResponse>(PATHS.remoteSupport);
}

/**
 * 公開情報 API のレスポンス。
 */
export interface PublicFeatureResponse extends RegzaResponse {
  /** デバイスの種別。 */
  device_type: string;
  /** DTV（デジタル放送）部のバージョン。 */
  dtv_version: string;
  /** デバイスの ID。 */
  id: string;
  /** IPC 部のバージョン。 */
  ipc_version: string;
  /** MAC アドレス。 */
  mac: string;
  /** 機種名。 */
  model: string;
  /** 月。 */
  month: string;
  /** 地域。 */
  region: string;
  /** 画面サイズ。 */
  size: string;
  /** トークン方式に対応しているか。 */
  support_token_protocol: boolean;
  /** キーコードの送信に使用するトークン。{@link sendKeyCode} に渡す。 */
  token: string;
  /** 年。 */
  year: string;
  /** DTV（デジタル放送）部の機能の一覧。 */
  dtv_feature: string[];
  /** IPC 部の機能の一覧。 */
  ipc_feature: string[];
}

/**
 * REGZA の公開情報を取得する。
 *
 * @returns デバイス情報およびトークンを含む公開情報。
 * @throws 接続情報が不正の場合。
 */
export async function getPublicFeature(): Promise<PublicFeatureResponse> {
  return regzaPublicRequest<PublicFeatureResponse>(PATHS.publicFeature);
}

/**
 * REGZA のトークンを取得する。
 *
 * - {@link getPublicFeature} の `token` を返す。
 * - キーコードの送信（{@link sendKeyCode}）に使用する。
 *
 * @returns REGZA のトークン。
 * @throws 接続情報が不正の場合。
 */
export async function getToken(): Promise<string> {
  const response = await getPublicFeature();
  return response.token;
}

/**
 * REGZA の公開サポート API を呼び出し、レスポンスを取得する。
 *
 * - 接続の確認（ヘルスチェック）に使用可能。
 *
 * @returns 公開サポート API のレスポンス。
 * @throws 接続情報が不正の場合。
 */
export async function getPublicSupport(): Promise<RegzaResponse> {
  return regzaPublicRequest<RegzaResponse>(PATHS.publicSupport);
}

/**
 * REGZA にリモコンのキーコードを送信する。
 *
 * @param code - 送信するリモコンのキーコード。
 * @param token - {@link getToken} で取得したトークン。トークン未サポートの場合、省略可能。
 * @returns REGZA API のステータス。`0` が成功。
 * @throws 接続情報が不正の場合。
 */
export async function sendKeyCode(
  code: string,
  token?: string,
): Promise<number> {
  return regzaAuthRequest<number>(
    withQuery(PATHS.remote, { key: code, ...(token ? { token } : {}) }),
  );
}
