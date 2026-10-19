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

const PORT = 4430;

// API のパス定義。
// public: 認証が不要なエンドポイント
// remote: Digest 認証が必要なエンドポイント
const PATHS = {
  // public
  requestConnection: "/v2/public/request_connection",
  publicSupport: "/public/support",
  publicFeature: "/public/feature",
  // remote (Digest 認証)
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
 * @returns 生成された HTTPS URL。
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
 * REGZA への接続設定。
 */
export interface RegzaConfig {
  host: string;
  userId: string;
  password: string;
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
 * 保存済みの設定を読み込み、setup と confirm が完了していることを検証する。
 * 未完了の場合は、次に行う操作を示すメッセージを付けてエラーを投げる。
 *
 * @internal
 * @returns 検証済みの設定。
 */
export async function validateRegzaConfig() {
  const config = await configStore.load();

  if (!config.host || !config.userId) {
    throw new Error("設定ファイルがありません。先に setup してください。");
  }
  if (config.salt) {
    throw new Error("設定が完了していません。先に confirm してください。");
  }
  return config;
}

/**
 * 現在の設定を検証して読み込み、読み取り専用の設定ストアに差し替える。
 *
 * @internal
 */
export async function freezeRegzaConfig() {
  const config = await validateRegzaConfig();
  setRegzaConfigStore(createReadonlyStore(config));
}

/**
 * Fetch のレスポンスの本文を解釈する。
 *
 * - 本文が空の場合は `null` を返す。
 * - JSON として解析できる場合は、解析した値を返す。
 * - それ以外の場合は、本文のテキストをそのまま返す。
 *
 * @internal
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
//   publicPostForm      認証なしで、フォームを POST する
//   regzaPublicRequest  認証なしで、GET する（保存済みの設定を使用）
//   digestRequest       Digest 認証（資格情報を引数で指定）
//   regzaAuthRequest    Digest 認証（保存済みの設定を使用）
// ---------------------------------------------------------------------------

/**
 * 認証なしで、フォームを POST する。
 *
 * @remarks
 * 低レイヤーのリクエスト関数。
 * 通常は API レイヤーの関数を使用する。
 *
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
  userId: string;
  password: string;
}

/**
 * 指定した資格情報で、Digest 認証付きのリクエストを送信する。
 *
 * @remarks
 * 低レイヤーのリクエスト関数。
 * 通常は API レイヤーの関数を使用する。
 *
 * @param host - REGZA のホスト名または IP アドレス。
 * @param credentials - Digest 認証に使用する資格情報。
 * @param path - API のパス。
 * @param options - Fetch のリクエストオプション。
 * @returns API のレスポンス。
 */
export async function digestRequest<T>(
  host: string,
  { userId, password }: DigestCredentials,
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const client = createDigestClient(userId, password);
  const response = await client.fetch(buildUrl(host, path), options);

  return (await parseResponse(response as Response)) as T;
}

/**
 * 保存済みの設定のホストに、認証なしで GET リクエストを送信する。
 *
 * @remarks
 * 低レイヤーのリクエスト関数。
 * 通常は API レイヤーの関数を使用する。
 *
 * @param path - API のパス。
 * @returns API のレスポンス。
 */
export async function regzaPublicRequest<T>(path: string): Promise<T> {
  const { host } = await validateRegzaConfig();
  const url = buildUrl(host, path);
  const response = await fetch(url, { method: "GET" });

  return (await parseResponse(response)) as T;
}

/**
 * 保存済みの設定を使用して、Digest 認証付きのリクエストを送信する。
 *
 * @remarks
 * 低レイヤーのリクエスト関数。
 * 通常は API レイヤーの関数を使用する。
 *
 * @param path - API のパス。
 * @param options - Fetch のリクエストオプション。
 * @returns API のレスポンス。
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
  status: number;
}

/**
 * 接続要求 API のレスポンス。
 *
 * @internal
 */
export interface ConnectionResponse extends RegzaResponse {
  password: string;
  salt: string;
}

/**
 * REGZA に接続要求を送信し、取得した認証情報を設定ストアに保存する。
 *
 * @param host - REGZA のホスト名または IP アドレス。
 * @param userId - 接続に使用するユーザー ID。
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
 * PIN を使用して接続を確定する。
 *
 * `requestConnection` で取得した認証情報を復号し、
 * REGZA への Digest 認証による接続を確認する。
 *
 * @param pin - REGZA に表示された PIN。
 */
export async function confirmConnection(pin: string) {
  const config = await configStore.load();
  if (!config.host || !config.userId || !config.password || !config.salt) {
    throw new Error("設定ファイルがありません。先に setup してください。");
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
  http_method: string;
  resource: string;
  params: string[];
}

/**
 * リモートサポート API のレスポンス。
 */
export interface SupportResponse extends RegzaResponse {
  command: SupportCommand[];
}

/**
 * REGZA がサポートするリモートコマンドの一覧を取得する。
 *
 * @returns リモートサポート API のレスポンス（コマンドの一覧を含む）。
 */
export async function getSupport(): Promise<SupportResponse> {
  return regzaAuthRequest<SupportResponse>(PATHS.remoteSupport);
}

/**
 * 公開情報 API のレスポンス。
 */
export interface PublicFeatureResponse extends RegzaResponse {
  device_type: string;
  dtv_version: string;
  id: string;
  ipc_version: string;
  mac: string;
  model: string;
  month: string;
  region: string;
  size: string;
  support_token_protocol: boolean;
  token: string;
  year: string;
  dtv_feature: string[];
  ipc_feature: string[];
}

/**
 * REGZA の公開情報を取得する。
 *
 * @returns デバイス情報およびトークンを含む公開情報。
 */
export async function getPublicFeature(): Promise<PublicFeatureResponse> {
  return regzaPublicRequest<PublicFeatureResponse>(PATHS.publicFeature);
}

/**
 * REGZA のトークンを取得する。
 *
 * @returns REGZA のトークン。
 */
export async function getToken(): Promise<string> {
  const response = await getPublicFeature();
  return response.token;
}

/**
 * REGZA の公開サポート API を呼び出し、レスポンスを取得する。
 * 接続の確認（ヘルスチェック）にも使用する。
 *
 * @returns 公開サポート API のレスポンス。
 */
export async function getPublicSupport(): Promise<RegzaResponse> {
  return regzaPublicRequest<RegzaResponse>(PATHS.publicSupport);
}

/**
 * REGZA にリモコンキーを送信する。
 *
 * @param code - 送信するリモコンキーのコード。
 * @param token - 指定する場合のトークン。省略可。
 * @returns REGZA API のステータスコード。
 */
export async function sendKeyCode(
  code: string,
  token?: string,
): Promise<number> {
  const query: Record<string, string> = { key: code };
  if (token != null) {
    query.token = token;
  }
  return regzaAuthRequest<number>(withQuery(PATHS.remote, query));
}
