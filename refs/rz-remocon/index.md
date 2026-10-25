[README](../../README.md) / rz-remocon

# rz-remocon

REGZA リモコンの操作や設定に関する API と型定義を提供する。

接続は、次の手順で行う。

1. [requestConnection(host, userId)](../rz-remocon/index.md#requestconnection-function) で接続を要求する。REGZA の画面に PIN が表示される。
1. [confirmConnection(pin)](../rz-remocon/index.md#confirmconnection-function) に PIN を指定して接続を確定する。

接続の確定後は、[getToken()](../rz-remocon/index.md#gettoken-function) でトークンを取得し、[sendKeyCode(code, token)](../rz-remocon/index.md#sendkeycode-function) でリモコンのキーコードを送信できる。

## Interfaces

| Interface | Description |
| - | - |
| [ConfigStore](../rz-remocon/index.md#configstore-interface) | 設定用ストア |
| [DigestCredentials](../rz-remocon/index.md#digestcredentials-interface) | Digest 認証に使用する資格情報 |
| [FileConfigStoreOptions](../rz-remocon/index.md#fileconfigstoreoptions-interface) | ファイルを使用する設定ストアのオプション |
| [PublicFeatureResponse](../rz-remocon/index.md#publicfeatureresponse-interface) | 公開情報 API のレスポンス |
| [RegzaResponse](../rz-remocon/index.md#regzaresponse-interface) | REGZA API の共通レスポンス |
| [SupportCommand](../rz-remocon/index.md#supportcommand-interface) | REGZA がサポートするリモートコマンド |
| [SupportResponse](../rz-remocon/index.md#supportresponse-interface) | リモートサポート API のレスポンス |

## Functions

| Function | Description |
| - | - |
| [confirmConnection(pin)](../rz-remocon/index.md#confirmconnection-function) | REGZA の接続を確定する |
| [createFileConfigStore(path, options)](../rz-remocon/index.md#createfileconfigstore-function) | ファイルに設定を保存する設定ストアを生成する |
| [createReadonlyStore(data)](../rz-remocon/index.md#createreadonlystore-function) | 読み取り専用の設定ストアを生成する |
| [digestRequest(host, credentials, path, options)](../rz-remocon/index.md#digestrequest-function) | 指定した資格情報で、Digest 認証付きのリクエストを送信する |
| [getPublicFeature()](../rz-remocon/index.md#getpublicfeature-function) | REGZA の公開情報を取得する |
| [getPublicSupport()](../rz-remocon/index.md#getpublicsupport-function) | REGZA の公開サポート API を呼び出し、レスポンスを取得する |
| [getSupport()](../rz-remocon/index.md#getsupport-function) | REGZA がサポートするリモートコマンドの一覧を取得する |
| [getToken()](../rz-remocon/index.md#gettoken-function) | REGZA のトークンを取得する |
| [publicPostForm(host, path, form)](../rz-remocon/index.md#publicpostform-function) | 認証なしで、フォームを POST する |
| [regzaAuthRequest(path, options)](../rz-remocon/index.md#regzaauthrequest-function) | 保存済みのホストに、Digest 認証付きのリクエストを送信する |
| [regzaPublicRequest(path)](../rz-remocon/index.md#regzapublicrequest-function) | 保存済みのホストに、認証なしで GET リクエストを送信する |
| [requestConnection(host, userId)](../rz-remocon/index.md#requestconnection-function) | REGZA に接続を要求する |
| [sendKeyCode(code, token)](../rz-remocon/index.md#sendkeycode-function) | REGZA にリモコンのキーコードを送信する |
| [setRegzaConfigStore(store)](../rz-remocon/index.md#setregzaconfigstore-function) | 使用する設定ストアを差し替える |

## Interface Details

<a id="configstore-interface"></a>

### ConfigStore

Source: [src/lib/config-store.ts:6](../../src/lib/config-store.ts#L6)

設定用ストア。

<a id="configstore-signature"></a>

#### Signature

```typescript
export interface ConfigStore<T>
```

##### Type Parameters

| Parameter | Description |
| - | - |
| T | |

#### Methods

| Method | Description |
| - | - |
| [load()](../rz-remocon/index.md#configstore-load-methodsignature) | 設定を読み込む |
| [save(config)](../rz-remocon/index.md#configstore-save-methodsignature) | 設定を保存する |

#### Method Details

<a id="configstore-load-methodsignature"></a>

##### load

設定を読み込む。

<a id="load-signature"></a>

###### Signature

```typescript
load(): Promise<T>;
```

<a id="load-returns"></a>

###### Returns

読み込んだ設定。

**Return type**: Promise\<T>

<a id="configstore-save-methodsignature"></a>

##### save

設定を保存する。

<a id="save-signature"></a>

###### Signature

```typescript
save(config: T): Promise<void>;
```

<a id="save-parameters"></a>

###### Parameters

| Parameter | Description |
| - | - |
| config | 保存する設定 |

<a id="save-returns"></a>

###### Returns

**Return type**: Promise\<void>

<a id="digestcredentials-interface"></a>

### DigestCredentials

Source: [src/lib/regza-client.ts:200](../../src/lib/regza-client.ts#L200)

Digest 認証に使用する資格情報。

<a id="digestcredentials-signature"></a>

#### Signature

```typescript
export interface DigestCredentials
```

#### Properties

| Property | Description |
| - | - |
| [password](../rz-remocon/index.md#digestcredentials-password-propertysignature) | Digest 認証のパスワード |
| [userId](../rz-remocon/index.md#digestcredentials-userid-propertysignature) | 接続時に指定したユーザー ID |

#### Property Details

<a id="digestcredentials-password-propertysignature"></a>

##### password

Digest 認証のパスワード。

<a id="password-signature"></a>

###### Signature

```typescript
password: string;
```

**Type**: string

<a id="digestcredentials-userid-propertysignature"></a>

##### userId

接続時に指定したユーザー ID。

<a id="userid-signature"></a>

###### Signature

```typescript
userId: string;
```

**Type**: string

<a id="fileconfigstoreoptions-interface"></a>

### FileConfigStoreOptions

Source: [src/lib/config-store.ts:39](../../src/lib/config-store.ts#L39)

ファイルを使用する設定ストアのオプション。

<a id="fileconfigstoreoptions-signature"></a>

#### Signature

```typescript
export interface FileConfigStoreOptions
```

#### Properties

| Property | Description |
| - | - |
| [notFoundMessage](../rz-remocon/index.md#fileconfigstoreoptions-notfoundmessage-propertysignature) | ファイルが存在しない場合のエラーメッセージ |

#### Property Details

<a id="fileconfigstoreoptions-notfoundmessage-propertysignature"></a>

##### notFoundMessage

ファイルが存在しない場合のエラーメッセージ。

<a id="notfoundmessage-signature"></a>

###### Signature

```typescript
notFoundMessage?: string;
```

**Type**: string

<a id="publicfeatureresponse-interface"></a>

### PublicFeatureResponse

Source: [src/lib/regza-client.ts:400](../../src/lib/regza-client.ts#L400)

公開情報 API のレスポンス。

<a id="publicfeatureresponse-signature"></a>

#### Signature

```typescript
export interface PublicFeatureResponse extends RegzaResponse
```

**Extends**: [RegzaResponse](../rz-remocon/index.md#regzaresponse-interface)

#### Properties

| Property | Description |
| - | - |
| [device_type](../rz-remocon/index.md#publicfeatureresponse-device_type-propertysignature) | デバイスの種別 |
| [dtv_feature](../rz-remocon/index.md#publicfeatureresponse-dtv_feature-propertysignature) | DTV（デジタル放送）部の機能の一覧 |
| [dtv_version](../rz-remocon/index.md#publicfeatureresponse-dtv_version-propertysignature) | DTV（デジタル放送）部のバージョン |
| [id](../rz-remocon/index.md#publicfeatureresponse-id-propertysignature) | デバイスの ID |
| [ipc_feature](../rz-remocon/index.md#publicfeatureresponse-ipc_feature-propertysignature) | IPC 部の機能の一覧 |
| [ipc_version](../rz-remocon/index.md#publicfeatureresponse-ipc_version-propertysignature) | IPC 部のバージョン |
| [mac](../rz-remocon/index.md#publicfeatureresponse-mac-propertysignature) | MAC アドレス |
| [model](../rz-remocon/index.md#publicfeatureresponse-model-propertysignature) | 機種名 |
| [month](../rz-remocon/index.md#publicfeatureresponse-month-propertysignature) | 月 |
| [region](../rz-remocon/index.md#publicfeatureresponse-region-propertysignature) | 地域 |
| [size](../rz-remocon/index.md#publicfeatureresponse-size-propertysignature) | 画面サイズ |
| [support_token_protocol](../rz-remocon/index.md#publicfeatureresponse-support_token_protocol-propertysignature) | トークン方式に対応しているか |
| [token](../rz-remocon/index.md#publicfeatureresponse-token-propertysignature) | キーコードの送信に使用するトークン |
| [year](../rz-remocon/index.md#publicfeatureresponse-year-propertysignature) | 年 |

#### Property Details

<a id="publicfeatureresponse-device_type-propertysignature"></a>

##### device_type

デバイスの種別。

<a id="device_type-signature"></a>

###### Signature

```typescript
device_type: string;
```

**Type**: string

<a id="publicfeatureresponse-dtv_feature-propertysignature"></a>

##### dtv_feature

DTV（デジタル放送）部の機能の一覧。

<a id="dtv_feature-signature"></a>

###### Signature

```typescript
dtv_feature: string[];
```

**Type**: string\[]

<a id="publicfeatureresponse-dtv_version-propertysignature"></a>

##### dtv_version

DTV（デジタル放送）部のバージョン。

<a id="dtv_version-signature"></a>

###### Signature

```typescript
dtv_version: string;
```

**Type**: string

<a id="publicfeatureresponse-id-propertysignature"></a>

##### id

デバイスの ID。

<a id="id-signature"></a>

###### Signature

```typescript
id: string;
```

**Type**: string

<a id="publicfeatureresponse-ipc_feature-propertysignature"></a>

##### ipc_feature

IPC 部の機能の一覧。

<a id="ipc_feature-signature"></a>

###### Signature

```typescript
ipc_feature: string[];
```

**Type**: string\[]

<a id="publicfeatureresponse-ipc_version-propertysignature"></a>

##### ipc_version

IPC 部のバージョン。

<a id="ipc_version-signature"></a>

###### Signature

```typescript
ipc_version: string;
```

**Type**: string

<a id="publicfeatureresponse-mac-propertysignature"></a>

##### mac

MAC アドレス。

<a id="mac-signature"></a>

###### Signature

```typescript
mac: string;
```

**Type**: string

<a id="publicfeatureresponse-model-propertysignature"></a>

##### model

機種名。

<a id="model-signature"></a>

###### Signature

```typescript
model: string;
```

**Type**: string

<a id="publicfeatureresponse-month-propertysignature"></a>

##### month

月。

<a id="month-signature"></a>

###### Signature

```typescript
month: string;
```

**Type**: string

<a id="publicfeatureresponse-region-propertysignature"></a>

##### region

地域。

<a id="region-signature"></a>

###### Signature

```typescript
region: string;
```

**Type**: string

<a id="publicfeatureresponse-size-propertysignature"></a>

##### size

画面サイズ。

<a id="size-signature"></a>

###### Signature

```typescript
size: string;
```

**Type**: string

<a id="publicfeatureresponse-support_token_protocol-propertysignature"></a>

##### support_token_protocol

トークン方式に対応しているか。

<a id="support_token_protocol-signature"></a>

###### Signature

```typescript
support_token_protocol: boolean;
```

**Type**: boolean

<a id="publicfeatureresponse-token-propertysignature"></a>

##### token

キーコードの送信に使用するトークン。[sendKeyCode(code, token)](../rz-remocon/index.md#sendkeycode-function) に渡す。

<a id="token-signature"></a>

###### Signature

```typescript
token: string;
```

**Type**: string

<a id="publicfeatureresponse-year-propertysignature"></a>

##### year

年。

<a id="year-signature"></a>

###### Signature

```typescript
year: string;
```

**Type**: string

<a id="regzaresponse-interface"></a>

### RegzaResponse

Source: [src/lib/regza-client.ts:287](../../src/lib/regza-client.ts#L287)

REGZA API の共通レスポンス。

<a id="regzaresponse-signature"></a>

#### Signature

```typescript
export interface RegzaResponse
```

#### Properties

| Property | Description |
| - | - |
| [status](../rz-remocon/index.md#regzaresponse-status-propertysignature) | REGZA API のステータス |

#### Property Details

<a id="regzaresponse-status-propertysignature"></a>

##### status

REGZA API のステータス。`0` が成功。

<a id="status-signature"></a>

###### Signature

```typescript
status: number;
```

**Type**: number

<a id="supportcommand-interface"></a>

### SupportCommand

Source: [src/lib/regza-client.ts:370](../../src/lib/regza-client.ts#L370)

REGZA がサポートするリモートコマンド。

<a id="supportcommand-signature"></a>

#### Signature

```typescript
export interface SupportCommand
```

#### Properties

| Property | Description |
| - | - |
| [http_method](../rz-remocon/index.md#supportcommand-http_method-propertysignature) | コマンドの HTTP メソッド |
| [params](../rz-remocon/index.md#supportcommand-params-propertysignature) | コマンドが受け取るパラメータ名の一覧 |
| [resource](../rz-remocon/index.md#supportcommand-resource-propertysignature) | コマンドのパス |

#### Property Details

<a id="supportcommand-http_method-propertysignature"></a>

##### http_method

コマンドの HTTP メソッド。

<a id="http_method-signature"></a>

###### Signature

```typescript
http_method: string;
```

**Type**: string

<a id="supportcommand-params-propertysignature"></a>

##### params

コマンドが受け取るパラメータ名の一覧。

<a id="params-signature"></a>

###### Signature

```typescript
params: string[];
```

**Type**: string\[]

<a id="supportcommand-resource-propertysignature"></a>

##### resource

コマンドのパス。

<a id="resource-signature"></a>

###### Signature

```typescript
resource: string;
```

**Type**: string

<a id="supportresponse-interface"></a>

### SupportResponse

Source: [src/lib/regza-client.ts:382](../../src/lib/regza-client.ts#L382)

リモートサポート API のレスポンス。

<a id="supportresponse-signature"></a>

#### Signature

```typescript
export interface SupportResponse extends RegzaResponse
```

**Extends**: [RegzaResponse](../rz-remocon/index.md#regzaresponse-interface)

#### Properties

| Property | Description |
| - | - |
| [command](../rz-remocon/index.md#supportresponse-command-propertysignature) | サポートしているコマンドの一覧 |

#### Property Details

<a id="supportresponse-command-propertysignature"></a>

##### command

サポートしているコマンドの一覧。

<a id="command-signature"></a>

###### Signature

```typescript
command: SupportCommand[];
```

**Type**: [SupportCommand](../rz-remocon/index.md#supportcommand-interface)\[]

## Function Details

<a id="confirmconnection-function"></a>

### confirmConnection

Source: [src/lib/regza-client.ts:342](../../src/lib/regza-client.ts#L342)

REGZA の接続を確定する。

- [requestConnection(host, userId)](../rz-remocon/index.md#requestconnection-function) 実行後に呼び出す。
- 確定した接続情報を設定ストアに保存する。

<a id="confirmconnection-signature"></a>

#### Signature

```typescript
export declare function confirmConnection(pin: string): Promise<void>;
```

<a id="confirmconnection-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| pin | REGZA に表示された PIN |

<a id="confirmconnection-returns"></a>

#### Returns

**Return type**: Promise\<void>

<a id="confirmconnection-throws"></a>

#### Throws

[requestConnection(host, userId)](../rz-remocon/index.md#requestconnection-function) が済んでいない場合。

REGZA が成功（`status` が `0`）を返さなかった場合。

<a id="createfileconfigstore-function"></a>

### createFileConfigStore

Source: [src/lib/config-store.ts:54](../../src/lib/config-store.ts#L54)

ファイルに設定を保存する設定ストアを生成する。

- 設定は JSON 形式で保存する。
- ファイルのパーミッションは `0600` に設定する。

<a id="createfileconfigstore-signature"></a>

#### Signature

```typescript
export declare function createFileConfigStore<T>(path: string, options?: FileConfigStoreOptions): ConfigStore<T>;
```

##### Type Parameters

| Parameter | Description |
| - | - |
| T | |

<a id="createfileconfigstore-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| path | 設定ファイルのパス |
| options | 設定ストアのオプション |

<a id="createfileconfigstore-returns"></a>

#### Returns

ファイルを使用する設定ストア。

**Return type**: [ConfigStore](../rz-remocon/index.md#configstore-interface)\<T>

<a id="createreadonlystore-function"></a>

### createReadonlyStore

Source: [src/lib/config-store.ts:91](../../src/lib/config-store.ts#L91)

読み取り専用の設定ストアを生成する。

- 読み込みは可能だが、保存するとエラーを投げる。

<a id="createreadonlystore-signature"></a>

#### Signature

```typescript
export declare function createReadonlyStore<T>(data: T): ConfigStore<T>;
```

##### Type Parameters

| Parameter | Description |
| - | - |
| T | |

<a id="createreadonlystore-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| data | ストアから読み込む設定 |

<a id="createreadonlystore-returns"></a>

#### Returns

読み取り専用の設定ストア。

**Return type**: [ConfigStore](../rz-remocon/index.md#configstore-interface)\<T>

<a id="digestrequest-function"></a>

### digestRequest

Source: [src/lib/regza-client.ts:222](../../src/lib/regza-client.ts#L222)

指定した資格情報で、Digest 認証付きのリクエストを送信する。

- 低レイヤーのリクエスト関数。
- 通常は API レイヤーの関数を使用する。
- HTTP ステータスは検証しない。
- 本文が JSON ならその値、JSON でなければ文字列、空なら `null` が、検証なしで `T` として返る。

<a id="digestrequest-signature"></a>

#### Signature

```typescript
export declare function digestRequest<T>(host: string, credentials: DigestCredentials, path: string, options?: RequestInit): Promise<T>;
```

##### Type Parameters

| Parameter | Description |
| - | - |
| T | レスポンス本文の型 |

<a id="digestrequest-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| host | REGZA のホスト名または IP アドレス |
| credentials | Digest 認証に使用する資格情報 |
| path | API のパス |
| options | Fetch のリクエストオプション |

<a id="digestrequest-returns"></a>

#### Returns

API のレスポンス。

**Return type**: Promise\<T>

<a id="getpublicfeature-function"></a>

### getPublicFeature

Source: [src/lib/regza-client.ts:437](../../src/lib/regza-client.ts#L437)

REGZA の公開情報を取得する。

<a id="getpublicfeature-signature"></a>

#### Signature

```typescript
export declare function getPublicFeature(): Promise<PublicFeatureResponse>;
```

<a id="getpublicfeature-returns"></a>

#### Returns

デバイス情報およびトークンを含む公開情報。

**Return type**: Promise<[PublicFeatureResponse](../rz-remocon/index.md#publicfeatureresponse-interface)>

<a id="getpublicfeature-throws"></a>

#### Throws

接続情報が不正の場合。

<a id="getpublicsupport-function"></a>

### getPublicSupport

Source: [src/lib/regza-client.ts:463](../../src/lib/regza-client.ts#L463)

REGZA の公開サポート API を呼び出し、レスポンスを取得する。

- 接続の確認（ヘルスチェック）に使用可能。

<a id="getpublicsupport-signature"></a>

#### Signature

```typescript
export declare function getPublicSupport(): Promise<RegzaResponse>;
```

<a id="getpublicsupport-returns"></a>

#### Returns

公開サポート API のレスポンス。

**Return type**: Promise<[RegzaResponse](../rz-remocon/index.md#regzaresponse-interface)>

<a id="getpublicsupport-throws"></a>

#### Throws

接続情報が不正の場合。

<a id="getsupport-function"></a>

### getSupport

Source: [src/lib/regza-client.ts:393](../../src/lib/regza-client.ts#L393)

REGZA がサポートするリモートコマンドの一覧を取得する。

<a id="getsupport-signature"></a>

#### Signature

```typescript
export declare function getSupport(): Promise<SupportResponse>;
```

<a id="getsupport-returns"></a>

#### Returns

リモートサポート API のレスポンス（コマンドの一覧を含む）。

**Return type**: Promise<[SupportResponse](../rz-remocon/index.md#supportresponse-interface)>

<a id="getsupport-throws"></a>

#### Throws

接続情報が不正の場合。

<a id="gettoken-function"></a>

### getToken

Source: [src/lib/regza-client.ts:450](../../src/lib/regza-client.ts#L450)

REGZA のトークンを取得する。

- [getPublicFeature()](../rz-remocon/index.md#getpublicfeature-function) の `token` を返す。
- キーコードの送信（[sendKeyCode(code, token)](../rz-remocon/index.md#sendkeycode-function)）に使用する。

<a id="gettoken-signature"></a>

#### Signature

```typescript
export declare function getToken(): Promise<string>;
```

<a id="gettoken-returns"></a>

#### Returns

REGZA のトークン。

**Return type**: Promise\<string>

<a id="gettoken-throws"></a>

#### Throws

接続情報が不正の場合。

<a id="publicpostform-function"></a>

### publicPostForm

Source: [src/lib/regza-client.ts:179](../../src/lib/regza-client.ts#L179)

認証なしで、フォームを POST する。

- 低レイヤーのリクエスト関数。
- 通常は API レイヤーの関数を使用する。
- 保存済みの設定は使用せず、ホストを引数で指定する。
- HTTP ステータスは検証しない。
- 本文が JSON ならその値、JSON でなければ文字列、空なら `null` が、検証なしで `T` として返る。

<a id="publicpostform-signature"></a>

#### Signature

```typescript
export declare function publicPostForm<T>(host: string, path: string, form: Record<string, string>): Promise<T>;
```

##### Type Parameters

| Parameter | Description |
| - | - |
| T | レスポンス本文の型 |

<a id="publicpostform-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| host | REGZA のホスト名または IP アドレス |
| path | API のパス |
| form | 送信するフォームデータ |

<a id="publicpostform-returns"></a>

#### Returns

API のレスポンス。

**Return type**: Promise\<T>

<a id="regzaauthrequest-function"></a>

### regzaAuthRequest

Source: [src/lib/regza-client.ts:272](../../src/lib/regza-client.ts#L272)

保存済みのホストに、Digest 認証付きのリクエストを送信する。

- 低レイヤーのリクエスト関数。
- 通常は API レイヤーの関数を使用する。
- 接続情報が不正の場合は、エラーを投げる。
- HTTP ステータスは検証しない。
- 本文が JSON ならその値、JSON でなければ文字列、空なら `null` が、検証なしで `T` として返る。

<a id="regzaauthrequest-signature"></a>

#### Signature

```typescript
export declare function regzaAuthRequest<T>(path: string, options?: RequestInit): Promise<T>;
```

##### Type Parameters

| Parameter | Description |
| - | - |
| T | レスポンス本文の型 |

<a id="regzaauthrequest-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| path | API のパス |
| options | Fetch のリクエストオプション |

<a id="regzaauthrequest-returns"></a>

#### Returns

API のレスポンス。

**Return type**: Promise\<T>

<a id="regzaauthrequest-throws"></a>

#### Throws

接続情報が不正の場合。

<a id="regzapublicrequest-function"></a>

### regzaPublicRequest

Source: [src/lib/regza-client.ts:249](../../src/lib/regza-client.ts#L249)

保存済みのホストに、認証なしで GET リクエストを送信する。

- 低レイヤーのリクエスト関数。
- 通常は API レイヤーの関数を使用する。
- 接続情報が不正の場合は、エラーを投げる。
- HTTP ステータスは検証しない。
- 本文が JSON ならその値、JSON でなければ文字列、空なら `null` が、検証なしで `T` として返る。

<a id="regzapublicrequest-signature"></a>

#### Signature

```typescript
export declare function regzaPublicRequest<T>(path: string): Promise<T>;
```

##### Type Parameters

| Parameter | Description |
| - | - |
| T | レスポンス本文の型 |

<a id="regzapublicrequest-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| path | API のパス |

<a id="regzapublicrequest-returns"></a>

#### Returns

API のレスポンス。

**Return type**: Promise\<T>

<a id="regzapublicrequest-throws"></a>

#### Throws

接続情報が不正の場合。

<a id="requestconnection-function"></a>

### requestConnection

Source: [src/lib/regza-client.ts:314](../../src/lib/regza-client.ts#L314)

REGZA に接続を要求する。

- REGZA の接続手順の最初に呼び出す。
- 既存の設定があっても、無条件に接続を要求する。
- REGZA が返した接続情報で設定ストアを上書きする（この時点では接続は未確定）。
- この関数のあとに REGZA の画面に PIN が表示されるので、[confirmConnection(pin)](../rz-remocon/index.md#confirmconnection-function) に PIN を指定して接続を確定する。

<a id="requestconnection-signature"></a>

#### Signature

```typescript
export declare function requestConnection(host: string, userId: string): Promise<void>;
```

<a id="requestconnection-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| host | REGZA のホスト名または IP アドレス |
| userId | 接続に使用するユーザー ID |

<a id="requestconnection-returns"></a>

#### Returns

**Return type**: Promise\<void>

<a id="requestconnection-throws"></a>

#### Throws

REGZA が成功（`status` が `0`）を返さなかった場合。

<a id="sendkeycode-function"></a>

### sendKeyCode

Source: [src/lib/regza-client.ts:475](../../src/lib/regza-client.ts#L475)

REGZA にリモコンのキーコードを送信する。

<a id="sendkeycode-signature"></a>

#### Signature

```typescript
export declare function sendKeyCode(code: string, token?: string): Promise<number>;
```

<a id="sendkeycode-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| code | 送信するリモコンのキーコード |
| token | [getToken()](../rz-remocon/index.md#gettoken-function) で取得したトークン。トークン未サポートの場合、省略可能。 |

<a id="sendkeycode-returns"></a>

#### Returns

REGZA API のステータス。`0` が成功。

**Return type**: Promise\<number>

<a id="sendkeycode-throws"></a>

#### Throws

接続情報が不正の場合。

<a id="setregzaconfigstore-function"></a>

### setRegzaConfigStore

Source: [src/lib/regza-client.ts:84](../../src/lib/regza-client.ts#L84)

使用する設定ストアを差し替える。

<a id="setregzaconfigstore-signature"></a>

#### Signature

```typescript
export declare function setRegzaConfigStore(store: ConfigStore<RegzaConfig>): void;
```

<a id="setregzaconfigstore-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| store | 新しく使用する設定ストア |
