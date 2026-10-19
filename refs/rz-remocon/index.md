[README](../../README.md) / rz-remocon

# rz-remocon

## Interfaces

| Interface | Description |
| - | - |
| [ConfigStore](../rz-remocon/index.md#configstore-interface) | 設定を読み込み、保存するストア |
| [DigestCredentials](../rz-remocon/index.md#digestcredentials-interface) | Digest 認証に使用する資格情報 |
| [FileConfigStoreOptions](../rz-remocon/index.md#fileconfigstoreoptions-interface) | ファイルを使用する設定ストアのオプション |
| [PublicFeatureResponse](../rz-remocon/index.md#publicfeatureresponse-interface) | 公開情報 API のレスポンス |
| [RegzaConfig](../rz-remocon/index.md#regzaconfig-interface) | REGZA への接続設定 |
| [RegzaResponse](../rz-remocon/index.md#regzaresponse-interface) | REGZA API の共通レスポンス |
| [SupportCommand](../rz-remocon/index.md#supportcommand-interface) | REGZA がサポートするリモートコマンド |
| [SupportResponse](../rz-remocon/index.md#supportresponse-interface) | リモートサポート API のレスポンス |

## Functions

| Function | Description |
| - | - |
| [confirmConnection(pin)](../rz-remocon/index.md#confirmconnection-function) | PIN を使用して接続を確定する |
| [createFileConfigStore(path, options)](../rz-remocon/index.md#createfileconfigstore-function) | ファイルに設定を保存する設定ストアを生成する |
| [createReadonlyStore(data)](../rz-remocon/index.md#createreadonlystore-function) | 読み取り専用の設定ストアを生成する |
| [digestRequest(host, { userId, password }, input, path, options)](../rz-remocon/index.md#digestrequest-function) | 指定した資格情報で、Digest 認証付きのリクエストを送信する |
| [getPublicFeature()](../rz-remocon/index.md#getpublicfeature-function) | REGZA の公開情報を取得する |
| [getPublicSupport()](../rz-remocon/index.md#getpublicsupport-function) | REGZA の公開サポート API を呼び出し、レスポンスを取得する |
| [getSupport()](../rz-remocon/index.md#getsupport-function) | REGZA がサポートするリモートコマンドの一覧を取得する |
| [getToken()](../rz-remocon/index.md#gettoken-function) | REGZA のトークンを取得する |
| [publicPostForm(host, path, form)](../rz-remocon/index.md#publicpostform-function) | 認証なしで、フォームを POST する |
| [regzaAuthRequest(path, options)](../rz-remocon/index.md#regzaauthrequest-function) | 保存済みの設定を使用して、Digest 認証付きのリクエストを送信する |
| [regzaPublicRequest(path)](../rz-remocon/index.md#regzapublicrequest-function) | 保存済みの設定のホストに、認証なしで GET リクエストを送信する |
| [requestConnection(host, userId)](../rz-remocon/index.md#requestconnection-function) | REGZA に接続要求を送信し、取得した認証情報を設定ストアに保存する |
| [sendKeyCode(code, token)](../rz-remocon/index.md#sendkeycode-function) | REGZA にリモコンキーを送信する |
| [setRegzaConfigStore(store)](../rz-remocon/index.md#setregzaconfigstore-function) | 使用する設定ストアを差し替える |

## Interface Details

<a id="configstore-interface"></a>

### ConfigStore

Source: [src/lib/config-store.ts:6](../../src/lib/config-store.ts#L6)

設定を読み込み、保存するストア。

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
| [load()](../rz-remocon/index.md#configstore-load-methodsignature) | |
| [save(config)](../rz-remocon/index.md#configstore-save-methodsignature) | |

#### Method Details

<a id="configstore-load-methodsignature"></a>

##### load

<a id="load-signature"></a>

###### Signature

```typescript
load(): Promise<T>;
```

<a id="load-returns"></a>

###### Returns

**Return type**: Promise\<T>

<a id="configstore-save-methodsignature"></a>

##### save

<a id="save-signature"></a>

###### Signature

```typescript
save(config: T): Promise<void>;
```

<a id="save-parameters"></a>

###### Parameters

| Parameter | Description |
| - | - |
| config | |

<a id="save-returns"></a>

###### Returns

**Return type**: Promise\<void>

<a id="digestcredentials-interface"></a>

### DigestCredentials

Source: [src/lib/regza-client.ts:171](../../src/lib/regza-client.ts#L171)

Digest 認証に使用する資格情報。

<a id="digestcredentials-signature"></a>

#### Signature

```typescript
export interface DigestCredentials
```

#### Properties

| Property | Description |
| - | - |
| [password](../rz-remocon/index.md#digestcredentials-password-propertysignature) | |
| [userId](../rz-remocon/index.md#digestcredentials-userid-propertysignature) | |

#### Property Details

<a id="digestcredentials-password-propertysignature"></a>

##### password

<a id="password-signature"></a>

###### Signature

```typescript
password: string;
```

**Type**: string

<a id="digestcredentials-userid-propertysignature"></a>

##### userId

<a id="userid-signature"></a>

###### Signature

```typescript
userId: string;
```

**Type**: string

<a id="fileconfigstoreoptions-interface"></a>

### FileConfigStoreOptions

Source: [src/lib/config-store.ts:29](../../src/lib/config-store.ts#L29)

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

Source: [src/lib/regza-client.ts:344](../../src/lib/regza-client.ts#L344)

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
| [device_type](../rz-remocon/index.md#publicfeatureresponse-device_type-propertysignature) | |
| [dtv_feature](../rz-remocon/index.md#publicfeatureresponse-dtv_feature-propertysignature) | |
| [dtv_version](../rz-remocon/index.md#publicfeatureresponse-dtv_version-propertysignature) | |
| [id](../rz-remocon/index.md#publicfeatureresponse-id-propertysignature) | |
| [ipc_feature](../rz-remocon/index.md#publicfeatureresponse-ipc_feature-propertysignature) | |
| [ipc_version](../rz-remocon/index.md#publicfeatureresponse-ipc_version-propertysignature) | |
| [mac](../rz-remocon/index.md#publicfeatureresponse-mac-propertysignature) | |
| [model](../rz-remocon/index.md#publicfeatureresponse-model-propertysignature) | |
| [month](../rz-remocon/index.md#publicfeatureresponse-month-propertysignature) | |
| [region](../rz-remocon/index.md#publicfeatureresponse-region-propertysignature) | |
| [size](../rz-remocon/index.md#publicfeatureresponse-size-propertysignature) | |
| [support_token_protocol](../rz-remocon/index.md#publicfeatureresponse-support_token_protocol-propertysignature) | |
| [token](../rz-remocon/index.md#publicfeatureresponse-token-propertysignature) | |
| [year](../rz-remocon/index.md#publicfeatureresponse-year-propertysignature) | |

#### Property Details

<a id="publicfeatureresponse-device_type-propertysignature"></a>

##### device_type

<a id="device_type-signature"></a>

###### Signature

```typescript
device_type: string;
```

**Type**: string

<a id="publicfeatureresponse-dtv_feature-propertysignature"></a>

##### dtv_feature

<a id="dtv_feature-signature"></a>

###### Signature

```typescript
dtv_feature: string[];
```

**Type**: string\[]

<a id="publicfeatureresponse-dtv_version-propertysignature"></a>

##### dtv_version

<a id="dtv_version-signature"></a>

###### Signature

```typescript
dtv_version: string;
```

**Type**: string

<a id="publicfeatureresponse-id-propertysignature"></a>

##### id

<a id="id-signature"></a>

###### Signature

```typescript
id: string;
```

**Type**: string

<a id="publicfeatureresponse-ipc_feature-propertysignature"></a>

##### ipc_feature

<a id="ipc_feature-signature"></a>

###### Signature

```typescript
ipc_feature: string[];
```

**Type**: string\[]

<a id="publicfeatureresponse-ipc_version-propertysignature"></a>

##### ipc_version

<a id="ipc_version-signature"></a>

###### Signature

```typescript
ipc_version: string;
```

**Type**: string

<a id="publicfeatureresponse-mac-propertysignature"></a>

##### mac

<a id="mac-signature"></a>

###### Signature

```typescript
mac: string;
```

**Type**: string

<a id="publicfeatureresponse-model-propertysignature"></a>

##### model

<a id="model-signature"></a>

###### Signature

```typescript
model: string;
```

**Type**: string

<a id="publicfeatureresponse-month-propertysignature"></a>

##### month

<a id="month-signature"></a>

###### Signature

```typescript
month: string;
```

**Type**: string

<a id="publicfeatureresponse-region-propertysignature"></a>

##### region

<a id="region-signature"></a>

###### Signature

```typescript
region: string;
```

**Type**: string

<a id="publicfeatureresponse-size-propertysignature"></a>

##### size

<a id="size-signature"></a>

###### Signature

```typescript
size: string;
```

**Type**: string

<a id="publicfeatureresponse-support_token_protocol-propertysignature"></a>

##### support_token_protocol

<a id="support_token_protocol-signature"></a>

###### Signature

```typescript
support_token_protocol: boolean;
```

**Type**: boolean

<a id="publicfeatureresponse-token-propertysignature"></a>

##### token

<a id="token-signature"></a>

###### Signature

```typescript
token: string;
```

**Type**: string

<a id="publicfeatureresponse-year-propertysignature"></a>

##### year

<a id="year-signature"></a>

###### Signature

```typescript
year: string;
```

**Type**: string

<a id="regzaconfig-interface"></a>

### RegzaConfig

Source: [src/lib/regza-client.ts:55](../../src/lib/regza-client.ts#L55)

REGZA への接続設定。

<a id="regzaconfig-signature"></a>

#### Signature

```typescript
export interface RegzaConfig
```

#### Properties

| Property | Description |
| - | - |
| [host](../rz-remocon/index.md#regzaconfig-host-propertysignature) | |
| [password](../rz-remocon/index.md#regzaconfig-password-propertysignature) | |
| [salt](../rz-remocon/index.md#regzaconfig-salt-propertysignature) | |
| [userId](../rz-remocon/index.md#regzaconfig-userid-propertysignature) | |

#### Property Details

<a id="regzaconfig-host-propertysignature"></a>

##### host

<a id="host-signature"></a>

###### Signature

```typescript
host: string;
```

**Type**: string

<a id="regzaconfig-password-propertysignature"></a>

##### password

<a id="password-signature"></a>

###### Signature

```typescript
password: string;
```

**Type**: string

<a id="regzaconfig-salt-propertysignature"></a>

##### salt

<a id="salt-signature"></a>

###### Signature

```typescript
salt: string;
```

**Type**: string

<a id="regzaconfig-userid-propertysignature"></a>

##### userId

<a id="userid-signature"></a>

###### Signature

```typescript
userId: string;
```

**Type**: string

<a id="regzaresponse-interface"></a>

### RegzaResponse

Source: [src/lib/regza-client.ts:245](../../src/lib/regza-client.ts#L245)

REGZA API の共通レスポンス。

<a id="regzaresponse-signature"></a>

#### Signature

```typescript
export interface RegzaResponse
```

#### Properties

| Property | Description |
| - | - |
| [status](../rz-remocon/index.md#regzaresponse-status-propertysignature) | |

#### Property Details

<a id="regzaresponse-status-propertysignature"></a>

##### status

<a id="status-signature"></a>

###### Signature

```typescript
status: number;
```

**Type**: number

<a id="supportcommand-interface"></a>

### SupportCommand

Source: [src/lib/regza-client.ts:319](../../src/lib/regza-client.ts#L319)

REGZA がサポートするリモートコマンド。

<a id="supportcommand-signature"></a>

#### Signature

```typescript
export interface SupportCommand
```

#### Properties

| Property | Description |
| - | - |
| [http_method](../rz-remocon/index.md#supportcommand-http_method-propertysignature) | |
| [params](../rz-remocon/index.md#supportcommand-params-propertysignature) | |
| [resource](../rz-remocon/index.md#supportcommand-resource-propertysignature) | |

#### Property Details

<a id="supportcommand-http_method-propertysignature"></a>

##### http_method

<a id="http_method-signature"></a>

###### Signature

```typescript
http_method: string;
```

**Type**: string

<a id="supportcommand-params-propertysignature"></a>

##### params

<a id="params-signature"></a>

###### Signature

```typescript
params: string[];
```

**Type**: string\[]

<a id="supportcommand-resource-propertysignature"></a>

##### resource

<a id="resource-signature"></a>

###### Signature

```typescript
resource: string;
```

**Type**: string

<a id="supportresponse-interface"></a>

### SupportResponse

Source: [src/lib/regza-client.ts:328](../../src/lib/regza-client.ts#L328)

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
| [command](../rz-remocon/index.md#supportresponse-command-propertysignature) | |

#### Property Details

<a id="supportresponse-command-propertysignature"></a>

##### command

<a id="command-signature"></a>

###### Signature

```typescript
command: SupportCommand[];
```

**Type**: [SupportCommand](../rz-remocon/index.md#supportcommand-interface)\[]

## Function Details

<a id="confirmconnection-function"></a>

### confirmConnection

Source: [src/lib/regza-client.ts:291](../../src/lib/regza-client.ts#L291)

PIN を使用して接続を確定する。

`requestConnection` で取得した認証情報を復号し、 REGZA への Digest 認証による接続を確認する。

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

<a id="createfileconfigstore-function"></a>

### createFileConfigStore

Source: [src/lib/config-store.ts:43](../../src/lib/config-store.ts#L43)

ファイルに設定を保存する設定ストアを生成する。

設定は JSON 形式で保存し、ファイルのパーミッションは `0600` に設定する。

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

Source: [src/lib/config-store.ts:80](../../src/lib/config-store.ts#L80)

読み取り専用の設定ストアを生成する。

読み込みは可能だが、保存しようとするとエラーを投げる。

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

Source: [src/lib/regza-client.ts:189](../../src/lib/regza-client.ts#L189)

指定した資格情報で、Digest 認証付きのリクエストを送信する。

<a id="digestrequest-signature"></a>

#### Signature

```typescript
export declare function digestRequest<T>(host: string, input: DigestCredentials, path: string, options?: RequestInit): Promise<T>;
```

##### Type Parameters

| Parameter | Description |
| - | - |
| T | |

<a id="digestrequest-remarks"></a>

#### Remarks

低レイヤーのリクエスト関数。 通常は API レイヤーの関数を使用する。

<a id="digestrequest-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| host | REGZA のホスト名または IP アドレス |
| { userId, password } | |
| input | |
| path | API のパス |
| options | Fetch のリクエストオプション |

<a id="digestrequest-returns"></a>

#### Returns

API のレスポンス。

**Return type**: Promise\<T>

<a id="getpublicfeature-function"></a>

### getPublicFeature

Source: [src/lib/regza-client.ts:366](../../src/lib/regza-client.ts#L366)

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

<a id="getpublicsupport-function"></a>

### getPublicSupport

Source: [src/lib/regza-client.ts:386](../../src/lib/regza-client.ts#L386)

REGZA の公開サポート API を呼び出し、レスポンスを取得する。 接続の確認（ヘルスチェック）にも使用する。

<a id="getpublicsupport-signature"></a>

#### Signature

```typescript
export declare function getPublicSupport(): Promise<RegzaResponse>;
```

<a id="getpublicsupport-returns"></a>

#### Returns

公開サポート API のレスポンス。

**Return type**: Promise<[RegzaResponse](../rz-remocon/index.md#regzaresponse-interface)>

<a id="getsupport-function"></a>

### getSupport

Source: [src/lib/regza-client.ts:337](../../src/lib/regza-client.ts#L337)

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

<a id="gettoken-function"></a>

### getToken

Source: [src/lib/regza-client.ts:375](../../src/lib/regza-client.ts#L375)

REGZA のトークンを取得する。

<a id="gettoken-signature"></a>

#### Signature

```typescript
export declare function getToken(): Promise<string>;
```

<a id="gettoken-returns"></a>

#### Returns

REGZA のトークン。

**Return type**: Promise\<string>

<a id="publicpostform-function"></a>

### publicPostForm

Source: [src/lib/regza-client.ts:150](../../src/lib/regza-client.ts#L150)

認証なしで、フォームを POST する。

<a id="publicpostform-signature"></a>

#### Signature

```typescript
export declare function publicPostForm<T>(host: string, path: string, form: Record<string, string>): Promise<T>;
```

##### Type Parameters

| Parameter | Description |
| - | - |
| T | |

<a id="publicpostform-remarks"></a>

#### Remarks

低レイヤーのリクエスト関数。 通常は API レイヤーの関数を使用する。

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

Source: [src/lib/regza-client.ts:230](../../src/lib/regza-client.ts#L230)

保存済みの設定を使用して、Digest 認証付きのリクエストを送信する。

<a id="regzaauthrequest-signature"></a>

#### Signature

```typescript
export declare function regzaAuthRequest<T>(path: string, options?: RequestInit): Promise<T>;
```

##### Type Parameters

| Parameter | Description |
| - | - |
| T | |

<a id="regzaauthrequest-remarks"></a>

#### Remarks

低レイヤーのリクエスト関数。 通常は API レイヤーの関数を使用する。

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

<a id="regzapublicrequest-function"></a>

### regzaPublicRequest

Source: [src/lib/regza-client.ts:211](../../src/lib/regza-client.ts#L211)

保存済みの設定のホストに、認証なしで GET リクエストを送信する。

<a id="regzapublicrequest-signature"></a>

#### Signature

```typescript
export declare function regzaPublicRequest<T>(path: string): Promise<T>;
```

##### Type Parameters

| Parameter | Description |
| - | - |
| T | |

<a id="regzapublicrequest-remarks"></a>

#### Remarks

低レイヤーのリクエスト関数。 通常は API レイヤーの関数を使用する。

<a id="regzapublicrequest-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| path | API のパス |

<a id="regzapublicrequest-returns"></a>

#### Returns

API のレスポンス。

**Return type**: Promise\<T>

<a id="requestconnection-function"></a>

### requestConnection

Source: [src/lib/regza-client.ts:265](../../src/lib/regza-client.ts#L265)

REGZA に接続要求を送信し、取得した認証情報を設定ストアに保存する。

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

<a id="sendkeycode-function"></a>

### sendKeyCode

Source: [src/lib/regza-client.ts:397](../../src/lib/regza-client.ts#L397)

REGZA にリモコンキーを送信する。

<a id="sendkeycode-signature"></a>

#### Signature

```typescript
export declare function sendKeyCode(code: string, token?: string): Promise<number>;
```

<a id="sendkeycode-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| code | 送信するリモコンキーのコード |
| token | 指定する場合のトークン |

<a id="sendkeycode-returns"></a>

#### Returns

REGZA API のステータスコード。

**Return type**: Promise\<number>

<a id="setregzaconfigstore-function"></a>

### setRegzaConfigStore

Source: [src/lib/regza-client.ts:69](../../src/lib/regza-client.ts#L69)

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
