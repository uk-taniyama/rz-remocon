/**
 * @packageDocumentation
 * REGZA リモコンの操作や設定に関する API と型定義を提供する。
 *
 * 接続は、次の手順で行う。
 *
 * 1. {@link requestConnection} で接続を要求する。REGZA の画面に PIN が表示される。
 * 2. {@link confirmConnection} に PIN を指定して接続を確定する。
 *
 * 接続の確定後は、{@link getToken} でトークンを取得し、{@link sendKeyCode} でリモコンのキーコードを送信できる。
 */
export {
  type ConfigStore,
  confirmConnection,
  createFileConfigStore,
  createReadonlyStore,
  type DigestCredentials,
  digestRequest,
  type FileConfigStoreOptions,
  getPublicFeature,
  getPublicSupport,
  getSupport,
  getToken,
  type PublicFeatureResponse,
  publicPostForm,
  type RegzaConfig,
  type RegzaResponse,
  regzaAuthRequest,
  regzaPublicRequest,
  requestConnection,
  type SupportCommand,
  type SupportResponse,
  sendKeyCode,
  setRegzaConfigStore,
} from "./regza-client";
