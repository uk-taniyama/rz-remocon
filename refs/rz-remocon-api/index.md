[README](../../README.md) / rz-remocon/api

# rz-remocon/api

キー定義・色・スキーマ・API 契約を提供する。

- キーの定義（[RemoteKeyDef](../rz-remocon-api/index.md#remotekeydef-interface)）、色マップ、アイコン URL 対応表の解析を提供する。
- 設定の zod スキーマと、編集用 API の契約（[contract](../rz-remocon-api/index.md#contract-variable)）を提供する。
- [remoconBuilder(options)](../rz-remocon-api/index.md#remoconbuilder-function) で、リモコン設定（[RemoconConfig](../rz-remocon-api/index.md#remoconconfig-typealias)）を組み立てる。

## Interfaces

| Interface | Description |
| - | - |
| [RemoconBuilderOptions](../rz-remocon-api/index.md#remoconbuilderoptions-interface) | [RemoconBuilder](../rz-remocon-api/remoconbuilder-class.md) の生成オプション。 |
| [RemoteKey](../rz-remocon-api/index.md#remotekey-interface) | キー名とキー定義を組み合わせた操作キー |
| [RemoteKeyDef](../rz-remocon-api/index.md#remotekeydef-interface) | キーの定義 |
| [RemoteKeyKindDef](../rz-remocon-api/index.md#remotekeykinddef-interface) | キーの種類（カテゴリ）の定義 |
| [SpecialKeyDef](../rz-remocon-api/index.md#specialkeydef-interface) | 特殊キーの定義 |

## Classes

| Class | Description |
| - | - |
| [RemoconBuilder](../rz-remocon-api/remoconbuilder-class.md) | リモコン設定を組み立てる Builder |

## Types

| TypeAlias | Description |
| - | - |
| [ApiFailure](../rz-remocon-api/index.md#apifailure-typealias) | API 呼び出しの失敗結果 |
| [ApiResult](../rz-remocon-api/index.md#apiresult-typealias) | API 呼び出しの結果 |
| [ApiSuccess](../rz-remocon-api/index.md#apisuccess-typealias) | API 呼び出しの成功結果 |
| [Client](../rz-remocon-api/index.md#client-typealias) | API クライアントの型 |
| [ColorMap](../rz-remocon-api/index.md#colormap-typealias) | 既定色 `DEFAULT` を含む色マップ。 |
| [ColorMapInput](../rz-remocon-api/index.md#colormapinput-typealias) | キー名または種類名に色を割り当てるためのマップ |
| [ColorMapResult](../rz-remocon-api/index.md#colormapresult-typealias) | 色マップの解析結果 |
| [ColorResolver](../rz-remocon-api/index.md#colorresolver-typealias) | キー名から色を解決する関数の型 |
| [Contract](../rz-remocon-api/index.md#contract-typealias) | API の契約 [contract](../rz-remocon-api/index.md#contract-variable) の型。 |
| [EditorRemoconConfig](../rz-remocon-api/index.md#editorremoconconfig-typealias) | 編集用リモコン設定の型 |
| [EditorRemoteKeyConfig](../rz-remocon-api/index.md#editorremotekeyconfig-typealias) | 編集用リモコン設定のキー型 |
| [IconUrls](../rz-remocon-api/index.md#iconurls-typealias) | アイコン URL 対応表 |
| [IconUrlsResult](../rz-remocon-api/index.md#iconurlsresult-typealias) | アイコン URL 対応表の解析結果 |
| [RemoconConfig](../rz-remocon-api/index.md#remoconconfig-typealias) | 表示用リモコン設定の型 |
| [RemoteKeyConfig](../rz-remocon-api/index.md#remotekeyconfig-typealias) | 表示用リモコン設定のキー型 |
| [RemoteKeyDecorator](../rz-remocon-api/index.md#remotekeydecorator-typealias) | 操作キーの設定を更新する関数の型 |
| [RemoteKeyDraft](../rz-remocon-api/index.md#remotekeydraft-typealias) | 操作キーの設定を組み立てる際に使用する中間データ |
| [RemoteKeyKind](../rz-remocon-api/index.md#remotekeykind-typealias) | キーの種類名 |
| [RemoteKeyName](../rz-remocon-api/index.md#remotekeyname-typealias) | 標準リモコンのキー定義に登録されているキー名 |
| [RemoteKeyOverrides](../rz-remocon-api/index.md#remotekeyoverrides-typealias) | 操作キーの設定に適用する上書き指定 |

## Functions

| Function | Description |
| - | - |
| [createColorResolver(colors)](../rz-remocon-api/index.md#createcolorresolver-function) | 色マップから、[ColorResolver](../rz-remocon-api/index.md#colorresolver-typealias) を生成する |
| [createDefaultColorMap()](../rz-remocon-api/index.md#createdefaultcolormap-function) | 標準リモコンのキー定義から既定の色マップを生成する |
| [getClient(baseUrl)](../rz-remocon-api/index.md#getclient-function) | 指定したベース URL に接続する、型付きの API クライアントを生成する |
| [isSpecialKey(name)](../rz-remocon-api/index.md#isspecialkey-function) | 指定された名前が特殊キーかを判定する |
| [mergeColorMap(overrides)](../rz-remocon-api/index.md#mergecolormap-function) | 既定の色マップに、指定された色マップを上書きして返す |
| [parseColorMap(value)](../rz-remocon-api/index.md#parsecolormap-function) | JSON として読み込んだ値を検証し、色マップに変換する |
| [parseIconUrls(value)](../rz-remocon-api/index.md#parseiconurls-function) | JSON として読み込んだ値を検証し、アイコン URL 対応表に変換する |
| [remoconBuilder(options)](../rz-remocon-api/index.md#remoconbuilder-function) | [RemoconBuilder](../rz-remocon-api/remoconbuilder-class.md) を生成する。 |
| [resolveRemoteKeyKindDef(name)](../rz-remocon-api/index.md#resolveremotekeykinddef-function) | キー名に対応する種類の定義を取得する |
| [safeApiCall(apiResult)](../rz-remocon-api/index.md#safeapicall-function) | API 呼び出しを安全に実行する |
| [toRemoconConfig(editor)](../rz-remocon-api/index.md#toremoconconfig-function) | 編集用リモコン設定から表示用リモコン設定を生成する |

## Variables

| Variable | Description |
| - | - |
| [apiPrefix](../rz-remocon-api/index.md#apiprefix-variable) | API のパスプレフィックス |
| [contract](../rz-remocon-api/index.md#contract-variable) | API の契約 |
| [DEFAULT_BACKGROUND](../rz-remocon-api/index.md#default_background-variable) | リモコン全体の既定の背景色 |
| [defaultColorMap](../rz-remocon-api/index.md#defaultcolormap-variable) | 標準リモコンのキー定義から生成した既定の色マップ |
| [defaultColorResolver](../rz-remocon-api/index.md#defaultcolorresolver-variable) | 既定の色マップを使って色を解決する関数 |
| [editorRemoconConfigSchema](../rz-remocon-api/index.md#editorremoconconfigschema-variable) | 編集用リモコン設定のスキーマ |
| [editorRemoteKeyConfigSchema](../rz-remocon-api/index.md#editorremotekeyconfigschema-variable) | 編集用リモコン設定に含まれるキーのスキーマ |
| [FALLBACK_KIND](../rz-remocon-api/index.md#fallback_kind-variable) | キー名から種類を特定できない場合に使用する既定の種類 |
| [hexColorSchema](../rz-remocon-api/index.md#hexcolorschema-variable) | #RRGGBB 形式の色のスキーマ |
| [keyCodeSchema](../rz-remocon-api/index.md#keycodeschema-variable) | キーコードのスキーマ |
| [LABEL_KEY_NAME](../rz-remocon-api/index.md#label_key_name-variable) | ラベルを表す特殊キー名 |
| [remoconConfigSchema](../rz-remocon-api/index.md#remoconconfigschema-variable) | 表示用リモコン設定のスキーマ |
| [REMOTE_KEY_DEFS](../rz-remocon-api/index.md#remote_key_defs-variable) | REGZA の標準リモコンのキー定義 |
| [REMOTE_KEY_KIND_DEFS](../rz-remocon-api/index.md#remote_key_kind_defs-variable) | キーの種類ごとの接頭辞、表示名、既定色の定義 |
| [remoteKeyConfigSchema](../rz-remocon-api/index.md#remotekeyconfigschema-variable) | 表示用リモコン設定に含まれるキーのスキーマ |
| [RemoteKeys](../rz-remocon-api/index.md#remotekeys-variable) | キー名と操作キー定義の対応表 |
| [SPECIAL_KEY_DEFS](../rz-remocon-api/index.md#special_key_defs-variable) | 特殊キー名と定義の対応表 |
| [TAB_KEY_NAME](../rz-remocon-api/index.md#tab_key_name-variable) | タブを表す特殊キー名 |

## Interface Details

<a id="remoconbuilderoptions-interface"></a>

### RemoconBuilderOptions

Source: [src/api/builder.ts:120](../../src/api/builder.ts#L120)

[RemoconBuilder](../rz-remocon-api/remoconbuilder-class.md) の生成オプション。

<a id="remoconbuilderoptions-signature"></a>

#### Signature

```typescript
export interface RemoconBuilderOptions
```

#### Properties

| Property | Description |
| - | - |
| [background](../rz-remocon-api/index.md#remoconbuilderoptions-background-propertysignature) | リモコン全体の背景色 |
| [columns](../rz-remocon-api/index.md#remoconbuilderoptions-columns-propertysignature) | グリッドの幅（セル数） |
| [decorator](../rz-remocon-api/index.md#remoconbuilderoptions-decorator-propertysignature) | 各キーの設定を更新する関数 |
| [unit](../rz-remocon-api/index.md#remoconbuilderoptions-unit-propertysignature) | 1 キー分のセル数 |

#### Property Details

<a id="remoconbuilderoptions-background-propertysignature"></a>

##### background

リモコン全体の背景色。省略時は [DEFAULT_BACKGROUND](../rz-remocon-api/index.md#default_background-variable) を使用する。

<a id="background-signature"></a>

###### Signature

```typescript
background?: string;
```

**Type**: string

<a id="remoconbuilderoptions-columns-propertysignature"></a>

##### columns

グリッドの幅（セル数）。

<a id="columns-signature"></a>

###### Signature

```typescript
columns: number;
```

**Type**: number

<a id="remoconbuilderoptions-decorator-propertysignature"></a>

##### decorator

各キーの設定を更新する関数。

<a id="decorator-signature"></a>

###### Signature

```typescript
decorator?: RemoteKeyDecorator;
```

**Type**: [RemoteKeyDecorator](../rz-remocon-api/index.md#remotekeydecorator-typealias)

<a id="remoconbuilderoptions-unit-propertysignature"></a>

##### unit

1 キー分のセル数。省略時は 4。

<a id="unit-signature"></a>

###### Signature

```typescript
unit?: number;
```

**Type**: number

<a id="remotekey-interface"></a>

### RemoteKey

Source: [src/api/remote-keys.ts:81](../../src/api/remote-keys.ts#L81)

キー名とキー定義を組み合わせた操作キー。

<a id="remotekey-signature"></a>

#### Signature

```typescript
export interface RemoteKey extends RemoteKeyDef
```

**Extends**: [RemoteKeyDef](../rz-remocon-api/index.md#remotekeydef-interface)

#### Properties

| Property | Description |
| - | - |
| [name](../rz-remocon-api/index.md#remotekey-name-propertysignature) | キー名 |

#### Property Details

<a id="remotekey-name-propertysignature"></a>

##### name

キー名。

<a id="name-signature"></a>

###### Signature

```typescript
name: string;
```

**Type**: string

<a id="remotekeydef-interface"></a>

### RemoteKeyDef

Source: [src/api/key-types.ts:7](../../src/api/key-types.ts#L7)

キーの定義。`REMOTE_KEY_DEFS` の値の型。

<a id="remotekeydef-signature"></a>

#### Signature

```typescript
export interface RemoteKeyDef
```

#### Properties

| Property | Description |
| - | - |
| [code](../rz-remocon-api/index.md#remotekeydef-code-propertysignature) | REGZA に送信するキーコード |
| [color](../rz-remocon-api/index.md#remotekeydef-color-propertysignature) | キーの色 |
| [label](../rz-remocon-api/index.md#remotekeydef-label-propertysignature) | キーに表示するラベル |
| [showLabel](../rz-remocon-api/index.md#remotekeydef-showlabel-propertysignature) | ラベルを表示するかどうか |

#### Property Details

<a id="remotekeydef-code-propertysignature"></a>

##### code

REGZA に送信するキーコード。

<a id="code-signature"></a>

###### Signature

```typescript
code: string;
```

**Type**: string

<a id="remotekeydef-color-propertysignature"></a>

##### color

キーの色。

<a id="color-signature"></a>

###### Signature

```typescript
color?: string;
```

**Type**: string

<a id="remotekeydef-label-propertysignature"></a>

##### label

キーに表示するラベル。

<a id="label-signature"></a>

###### Signature

```typescript
label: string;
```

**Type**: string

<a id="remotekeydef-showlabel-propertysignature"></a>

##### showLabel

ラベルを表示するかどうか。

<a id="showlabel-signature"></a>

###### Signature

```typescript
showLabel?: boolean;
```

**Type**: boolean

<a id="remotekeykinddef-interface"></a>

### RemoteKeyKindDef

Source: [src/api/key-types.ts:19](../../src/api/key-types.ts#L19)

キーの種類（カテゴリ）の定義。`REMOTE_KEY_KIND_DEFS` の要素の型。

<a id="remotekeykinddef-signature"></a>

#### Signature

```typescript
export interface RemoteKeyKindDef
```

#### Properties

| Property | Description |
| - | - |
| [color](../rz-remocon-api/index.md#remotekeykinddef-color-propertysignature) | 種類の既定色 |
| [kind](../rz-remocon-api/index.md#remotekeykinddef-kind-propertysignature) | 種類を識別する名前 |
| [label](../rz-remocon-api/index.md#remotekeykinddef-label-propertysignature) | 種類の表示名 |
| [prefix](../rz-remocon-api/index.md#remotekeykinddef-prefix-propertysignature) | キー名から種類を判定するための接頭辞 |

#### Property Details

<a id="remotekeykinddef-color-propertysignature"></a>

##### color

種類の既定色。

<a id="color-signature"></a>

###### Signature

```typescript
color: string;
```

**Type**: string

<a id="remotekeykinddef-kind-propertysignature"></a>

##### kind

種類を識別する名前。

<a id="kind-signature"></a>

###### Signature

```typescript
kind: string;
```

**Type**: string

<a id="remotekeykinddef-label-propertysignature"></a>

##### label

種類の表示名。

<a id="label-signature"></a>

###### Signature

```typescript
label: string;
```

**Type**: string

<a id="remotekeykinddef-prefix-propertysignature"></a>

##### prefix

キー名から種類を判定するための接頭辞。

<a id="prefix-signature"></a>

###### Signature

```typescript
prefix: string;
```

**Type**: string

<a id="specialkeydef-interface"></a>

### SpecialKeyDef

Source: [src/api/remote-keys.ts:31](../../src/api/remote-keys.ts#L31)

特殊キーの定義。

<a id="specialkeydef-signature"></a>

#### Signature

```typescript
export interface SpecialKeyDef
```

#### Properties

| Property | Description |
| - | - |
| [fullWidth](../rz-remocon-api/index.md#specialkeydef-fullwidth-propertysignature) | グリッドの行全体を使用するかどうか |
| [label](../rz-remocon-api/index.md#specialkeydef-label-propertysignature) | 表示名 |

#### Property Details

<a id="specialkeydef-fullwidth-propertysignature"></a>

##### fullWidth

グリッドの行全体を使用するかどうか。

<a id="fullwidth-signature"></a>

###### Signature

```typescript
fullWidth: boolean;
```

**Type**: boolean

<a id="specialkeydef-label-propertysignature"></a>

##### label

表示名。

<a id="label-signature"></a>

###### Signature

```typescript
label: string;
```

**Type**: string

## Type Details

<a id="apifailure-typealias"></a>

### ApiFailure

Source: [src/api/client.ts:33](../../src/api/client.ts#L33)

API 呼び出しの失敗結果。

<a id="apifailure-signature"></a>

#### Signature

```typescript
export type ApiFailure = {
    ok: false;
    reason: "server_error";
    code: string;
    data: unknown;
} | {
    ok: false;
    reason: "unexpected_status";
    status: number;
    body: unknown;
} | {
    ok: false;
    reason: "bad_request";
    detail: unknown;
} | {
    ok: false;
    reason: "network_error";
    detail: string;
};
```

<a id="apiresult-typealias"></a>

### ApiResult

Source: [src/api/client.ts:48](../../src/api/client.ts#L48)

API 呼び出しの結果。

- `ok` プロパティで成否を判定する。
- `true` の場合は [ApiSuccess](../rz-remocon-api/index.md#apisuccess-typealias)
- `false` の場合は [ApiFailure](../rz-remocon-api/index.md#apifailure-typealias)

<a id="apiresult-signature"></a>

#### Signature

```typescript
export type ApiResult<T> = ApiSuccess<T> | ApiFailure;
```

##### Type Parameters

| Parameter | Description |
| - | - |
| T | 成功時に返される値の型 |

<a id="apisuccess-typealias"></a>

### ApiSuccess

Source: [src/api/client.ts:30](../../src/api/client.ts#L30)

API 呼び出しの成功結果。

<a id="apisuccess-signature"></a>

#### Signature

```typescript
export type ApiSuccess<T> = {
    ok: true;
    value: T;
};
```

##### Type Parameters

| Parameter | Description |
| - | - |
| T | 成功時に返される値の型 |

<a id="client-typealias"></a>

### Client

Source: [src/api/client.ts:23](../../src/api/client.ts#L23)

API クライアントの型。

<a id="client-signature"></a>

#### Signature

```typescript
export type Client = ContractRouterClient<Contract>;
```

<a id="colormap-typealias"></a>

### ColorMap

Source: [src/api/colors.ts:21](../../src/api/colors.ts#L21)

既定色 `DEFAULT` を含む色マップ。

<a id="colormap-signature"></a>

#### Signature

```typescript
export type ColorMap = ColorMapInput & Record<"DEFAULT", string>;
```

<a id="colormapinput-typealias"></a>

### ColorMapInput

Source: [src/api/colors.ts:16](../../src/api/colors.ts#L16)

キー名または種類名に色を割り当てるためのマップ。

- `DEFAULT` は必須としない。

<a id="colormapinput-signature"></a>

#### Signature

```typescript
export type ColorMapInput = Record<string, string>;
```

<a id="colormapresult-typealias"></a>

### ColorMapResult

Source: [src/api/colors.ts:77](../../src/api/colors.ts#L77)

色マップの解析結果。

<a id="colormapresult-signature"></a>

#### Signature

```typescript
export type ColorMapResult = {
    colors: ColorMapInput;
    errors: string[];
};
```

<a id="colorresolver-typealias"></a>

### ColorResolver

Source: [src/api/colors.ts:26](../../src/api/colors.ts#L26)

キー名から色を解決する関数の型。

<a id="colorresolver-signature"></a>

#### Signature

```typescript
export type ColorResolver = (name: string) => string;
```

<a id="contract-typealias"></a>

### Contract

Source: [src/api/contract.ts:118](../../src/api/contract.ts#L118)

API の契約 [contract](../rz-remocon-api/index.md#contract-variable) の型。

<a id="contract-signature"></a>

#### Signature

```typescript
export type Contract = typeof contract;
```

<a id="editorremoconconfig-typealias"></a>

### EditorRemoconConfig

Source: [src/api/schema.ts:142](../../src/api/schema.ts#L142)

編集用リモコン設定の型。

<a id="editorremoconconfig-signature"></a>

#### Signature

```typescript
export type EditorRemoconConfig = z.infer<typeof editorRemoconConfigSchema>;
```

<a id="editorremotekeyconfig-typealias"></a>

### EditorRemoteKeyConfig

Source: [src/api/schema.ts:140](../../src/api/schema.ts#L140)

編集用リモコン設定のキー型。

<a id="editorremotekeyconfig-signature"></a>

#### Signature

```typescript
export type EditorRemoteKeyConfig = z.infer<typeof editorRemoteKeyConfigSchema>;
```

<a id="iconurls-typealias"></a>

### IconUrls

Source: [src/api/icon-urls.ts:13](../../src/api/icon-urls.ts#L13)

アイコン URL 対応表。

- アイコン名から画像 URL を引く。

<a id="iconurls-signature"></a>

#### Signature

```typescript
export type IconUrls = Record<string, string>;
```

<a id="iconurlsresult-typealias"></a>

### IconUrlsResult

Source: [src/api/icon-urls.ts:45](../../src/api/icon-urls.ts#L45)

アイコン URL 対応表の解析結果。

<a id="iconurlsresult-signature"></a>

#### Signature

```typescript
export type IconUrlsResult = {
    urls: IconUrls;
    errors: string[];
};
```

<a id="remoconconfig-typealias"></a>

### RemoconConfig

Source: [src/api/schema.ts:74](../../src/api/schema.ts#L74)

表示用リモコン設定の型。

<a id="remoconconfig-signature"></a>

#### Signature

```typescript
export type RemoconConfig = z.infer<typeof remoconConfigSchema>;
```

<a id="remotekeyconfig-typealias"></a>

### RemoteKeyConfig

Source: [src/api/schema.ts:72](../../src/api/schema.ts#L72)

表示用リモコン設定のキー型。

<a id="remotekeyconfig-signature"></a>

#### Signature

```typescript
export type RemoteKeyConfig = z.infer<typeof remoteKeyConfigSchema>;
```

<a id="remotekeydecorator-typealias"></a>

### RemoteKeyDecorator

Source: [src/api/builder.ts:69](../../src/api/builder.ts#L69)

操作キーの設定を更新する関数の型。

- キーの色などを共通のルールで変更する。

<a id="remotekeydecorator-signature"></a>

#### Signature

```typescript
export type RemoteKeyDecorator = (key: RemoteKeyDraft) => RemoteKeyDraft;
```

<a id="remotekeydraft-typealias"></a>

### RemoteKeyDraft

Source: [src/api/builder.ts:23](../../src/api/builder.ts#L23)

操作キーの設定を組み立てる際に使用する中間データ。

- [RemoconBuilder](../rz-remocon-api/remoconbuilder-class.md) 内で [RemoteKey](../rz-remocon-api/index.md#remotekey-interface) を編集可能な形式に変換する。
- `color` は `decorator` や `overrides` で後から決定できるよう、未設定を許容する。
- `showLabel` は `label` の文字列を保持したまま、表示するかどうかを管理する。最終的な出力形式への変換時に解決する。
- `x` / `y` は配置時に決まるため、`draft` の生成時点では仮の値を使用する。

<a id="remotekeydraft-signature"></a>

#### Signature

```typescript
export type RemoteKeyDraft = Omit<RemoteKeyConfig, "color"> & {
    color?: string;
    showLabel?: boolean;
};
```

<a id="remotekeykind-typealias"></a>

### RemoteKeyKind

Source: [src/api/key-defs.ts:158](../../src/api/key-defs.ts#L158)

キーの種類名。

<a id="remotekeykind-signature"></a>

#### Signature

```typescript
export type RemoteKeyKind = (typeof REMOTE_KEY_KIND_DEFS)[number]["kind"];
```

<a id="remotekeyname-typealias"></a>

### RemoteKeyName

Source: [src/api/key-defs.ts:139](../../src/api/key-defs.ts#L139)

標準リモコンのキー定義に登録されているキー名。

<a id="remotekeyname-signature"></a>

#### Signature

```typescript
export type RemoteKeyName = keyof typeof REMOTE_KEY_DEFS;
```

<a id="remotekeyoverrides-typealias"></a>

### RemoteKeyOverrides

Source: [src/api/builder.ts:33](../../src/api/builder.ts#L33)

操作キーの設定に適用する上書き指定。

- 座標 `x` / `y` は自動配置専用のため変更できない。

<a id="remotekeyoverrides-signature"></a>

#### Signature

```typescript
export type RemoteKeyOverrides = Partial<Omit<RemoteKeyDraft, "x" | "y">>;
```

## Function Details

<a id="createcolorresolver-function"></a>

### createColorResolver

Source: [src/api/colors.ts:55](../../src/api/colors.ts#L55)

色マップから、[ColorResolver](../rz-remocon-api/index.md#colorresolver-typealias) を生成する。

- キー個別の色、種類の色、`DEFAULT` の順に検索する。

<a id="createcolorresolver-signature"></a>

#### Signature

```typescript
export declare function createColorResolver(colors: ColorMap): ColorResolver;
```

<a id="createcolorresolver-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| colors | キー名または種類名に対応する色のマップ |

<a id="createcolorresolver-returns"></a>

#### Returns

キー名から色を解決する関数。

**Return type**: [ColorResolver](../rz-remocon-api/index.md#colorresolver-typealias)

<a id="createdefaultcolormap-function"></a>

### createDefaultColorMap

Source: [src/api/colors.ts:33](../../src/api/colors.ts#L33)

標準リモコンのキー定義から既定の色マップを生成する。

<a id="createdefaultcolormap-signature"></a>

#### Signature

```typescript
export declare function createDefaultColorMap(): ColorMap;
```

<a id="createdefaultcolormap-returns"></a>

#### Returns

色マップ。

**Return type**: [ColorMap](../rz-remocon-api/index.md#colormap-typealias)

<a id="getclient-function"></a>

### getClient

Source: [src/api/client.ts:16](../../src/api/client.ts#L16)

指定したベース URL に接続する、型付きの API クライアントを生成する。

<a id="getclient-signature"></a>

#### Signature

```typescript
export declare function getClient(baseUrl: string): ContractRouterClient<Contract>;
```

<a id="getclient-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| baseUrl | API サーバーのベース URL（`apiPrefix` は含めない）。 |

<a id="getclient-returns"></a>

#### Returns

API クライアント。

**Return type**: ContractRouterClient<[Contract](../rz-remocon-api/index.md#contract-typealias)>

<a id="isspecialkey-function"></a>

### isSpecialKey

Source: [src/api/remote-keys.ts:18](../../src/api/remote-keys.ts#L18)

指定された名前が特殊キーかを判定する。

- 特殊キーはレイアウトや表示のために使用する。

<a id="isspecialkey-signature"></a>

#### Signature

```typescript
export declare function isSpecialKey(name: string): boolean;
```

<a id="isspecialkey-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| name | 判定するキー名 |

<a id="isspecialkey-returns"></a>

#### Returns

特殊キーの場合は `true`。

**Return type**: boolean

<a id="mergecolormap-function"></a>

### mergeColorMap

Source: [src/api/colors.ts:116](../../src/api/colors.ts#L116)

既定の色マップに、指定された色マップを上書きして返す。

- 同じ名前が存在する場合は、`overrides` の色を優先する。

<a id="mergecolormap-signature"></a>

#### Signature

```typescript
export declare function mergeColorMap(overrides: ColorMapInput): ColorMap;
```

<a id="mergecolormap-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| overrides | 上書きする色マップ |

<a id="mergecolormap-returns"></a>

#### Returns

既定の色と上書きした色を含む色マップ。

**Return type**: [ColorMap](../rz-remocon-api/index.md#colormap-typealias)

<a id="parsecolormap-function"></a>

### parseColorMap

Source: [src/api/colors.ts:94](../../src/api/colors.ts#L94)

JSON として読み込んだ値を検証し、色マップに変換する。

- 色は `#RRGGBB` 形式のみ受け付ける。
- 不正な項目は `errors` に記録し、`colors` には正常な項目のみを残す。
- キー名や種類名の妥当性は検証しない。

<a id="parsecolormap-signature"></a>

#### Signature

```typescript
export declare function parseColorMap(value: unknown): ColorMapResult;
```

<a id="parsecolormap-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| value | JSON として読み込んだ値 |

<a id="parsecolormap-returns"></a>

#### Returns

検証に成功した色マップとエラー一覧。

**Return type**: [ColorMapResult](../rz-remocon-api/index.md#colormapresult-typealias)

<a id="parseiconurls-function"></a>

### parseIconUrls

Source: [src/api/icon-urls.ts:62](../../src/api/icon-urls.ts#L62)

JSON として読み込んだ値を検証し、アイコン URL 対応表に変換する。

- 入力全体が JSON オブジェクトでない場合は、空のアイコン URL 対応表とエラーを返す。
- 不正な項目は `errors` に記録し、`urls` には正常な項目のみを残す。
- アイコン名の妥当性は検証しない。

<a id="parseiconurls-signature"></a>

#### Signature

```typescript
export declare function parseIconUrls(value: unknown): IconUrlsResult;
```

<a id="parseiconurls-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| value | JSON として読み込んだ値 |

<a id="parseiconurls-returns"></a>

#### Returns

検証に成功したアイコン URL 対応表とエラー一覧。

**Return type**: [IconUrlsResult](../rz-remocon-api/index.md#iconurlsresult-typealias)

<a id="remoconbuilder-function"></a>

### remoconBuilder

Source: [src/api/builder.ts:352](../../src/api/builder.ts#L352)

[RemoconBuilder](../rz-remocon-api/remoconbuilder-class.md) を生成する。

<a id="remoconbuilder-signature"></a>

#### Signature

```typescript
export declare function remoconBuilder(options: RemoconBuilderOptions): RemoconBuilder;
```

<a id="remoconbuilder-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| options | オプション |

<a id="remoconbuilder-returns"></a>

#### Returns

リモコン設定を組み立てる Builder。

**Return type**: [RemoconBuilder](../rz-remocon-api/remoconbuilder-class.md)

<a id="resolveremotekeykinddef-function"></a>

### resolveRemoteKeyKindDef

Source: [src/api/remote-keys.ts:73](../../src/api/remote-keys.ts#L73)

キー名に対応する種類の定義を取得する。

- 複数の接頭辞が一致する場合は、`REMOTE_KEY_KIND_DEFS` で先に定義されたものを採用する。
- 一致する接頭辞がない場合は、`FALLBACK_KIND` に対応する定義を返す。

<a id="resolveremotekeykinddef-signature"></a>

#### Signature

```typescript
export declare function resolveRemoteKeyKindDef(name: string): RemoteKeyKindDef;
```

<a id="resolveremotekeykinddef-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| name | 種類を判定するキー名 |

<a id="resolveremotekeykinddef-returns"></a>

#### Returns

一致した種類の定義、またはフォールバックの種類の定義。

**Return type**: [RemoteKeyKindDef](../rz-remocon-api/index.md#remotekeykinddef-interface)

<a id="safeapicall-function"></a>

### safeApiCall

Source: [src/api/client.ts:60](../../src/api/client.ts#L60)

API 呼び出しを安全に実行する。

- 結果を [ApiSuccess](../rz-remocon-api/index.md#apisuccess-typealias) に、例外を [ApiFailure](../rz-remocon-api/index.md#apifailure-typealias) に変換して返す。

<a id="safeapicall-signature"></a>

#### Signature

```typescript
export declare function safeApiCall<T, TError extends Error>(apiResult: ClientPromiseResult<T, TError>): Promise<ApiResult<T>>;
```

##### Type Parameters

| Parameter | Description |
| - | - |
| T | API の成功時に返される値の型 |
| TError | API クライアントが返すエラーの型 |

<a id="safeapicall-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| apiResult | API 呼び出しの Promise |

<a id="safeapicall-returns"></a>

#### Returns

API 呼び出しの結果。

**Return type**: Promise<[ApiResult](../rz-remocon-api/index.md#apiresult-typealias)\<T>>

<a id="toremoconconfig-function"></a>

### toRemoconConfig

Source: [src/api/utils.ts:10](../../src/api/utils.ts#L10)

編集用リモコン設定から表示用リモコン設定を生成する。

<a id="toremoconconfig-signature"></a>

#### Signature

```typescript
export declare function toRemoconConfig(editor: EditorRemoconConfig): RemoconConfig;
```

<a id="toremoconconfig-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| editor | 編集用リモコン設定 |

<a id="toremoconconfig-returns"></a>

#### Returns

表示用リモコン設定。

**Return type**: [RemoconConfig](../rz-remocon-api/index.md#remoconconfig-typealias)

## Variable Details

<a id="apiprefix-variable"></a>

### apiPrefix

Source: [src/api/contract.ts:101](../../src/api/contract.ts#L101)

API のパスプレフィックス。

<a id="apiprefix-signature"></a>

#### Signature

```typescript
apiPrefix = "/api"
```

<a id="contract-variable"></a>

### contract

Source: [src/api/contract.ts:106](../../src/api/contract.ts#L106)

API の契約。

<a id="contract-signature"></a>

#### Signature

```typescript
contract: {
    sendCode: import("@orpc/contract").ContractProcedureBuilderWithInputOutput<z.ZodObject<{
        code: z.ZodString;
    }, z.core.$strip>, z.ZodNumber, import("@orpc/contract").MergedErrorMap<Record<never, never>, {
        INTERNAL_SERVER_ERROR: {
            status: number;
            message: string;
            data: z.ZodString;
        };
    }>, Record<never, never>>;
    status: import("@orpc/contract").ContractProcedureBuilderWithOutput<import("@orpc/contract").Schema<unknown, unknown>, z.ZodNumber, import("@orpc/contract").MergedErrorMap<Record<never, never>, {
        INTERNAL_SERVER_ERROR: {
            status: number;
            message: string;
            data: z.ZodString;
        };
    }>, Record<never, never>>;
    editor: {
        get: import("@orpc/contract").ContractProcedureBuilderWithOutput<import("@orpc/contract").Schema<unknown, unknown>, z.ZodObject<{
            revision: z.ZodString;
            config: z.ZodNullable<z.ZodObject<{
                version: z.ZodLiteral<1>;
                grid: z.ZodObject<{
                    columns: z.ZodNumber;
                    unit: z.ZodNumber;
                }, z.core.$strip>;
                background: z.ZodString;
                keys: z.ZodArray<z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                    w: z.ZodNumber;
                    h: z.ZodNumber;
                    id: z.ZodString;
                    name: z.ZodString;
                    code: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"">, z.ZodString]>>;
                    label: z.ZodOptional<z.ZodString>;
                    showLabel: z.ZodBoolean;
                    icon: z.ZodOptional<z.ZodString>;
                    color: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
            invalid: z.ZodBoolean;
        }, z.core.$strip>, import("@orpc/contract").MergedErrorMap<import("@orpc/contract").MergedErrorMap<Record<never, never>, {
            INTERNAL_SERVER_ERROR: {
                status: number;
                message: string;
                data: z.ZodString;
            };
        }>, {
            STORAGE_ERROR: {
                status: number;
                message: string;
                data: z.ZodString;
            };
            REVISION_CONFLICT: {
                status: number;
                message: string;
                data: z.ZodObject<{
                    revision: z.ZodString;
                }, z.core.$strip>;
            };
        }>, Record<never, never>>;
        save: import("@orpc/contract").ContractProcedureBuilderWithInputOutput<z.ZodObject<{
            revision: z.ZodNullable<z.ZodString>;
            config: z.ZodObject<{
                version: z.ZodLiteral<1>;
                grid: z.ZodObject<{
                    columns: z.ZodNumber;
                    unit: z.ZodNumber;
                }, z.core.$strip>;
                background: z.ZodString;
                keys: z.ZodArray<z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                    w: z.ZodNumber;
                    h: z.ZodNumber;
                    id: z.ZodString;
                    name: z.ZodString;
                    code: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"">, z.ZodString]>>;
                    label: z.ZodOptional<z.ZodString>;
                    showLabel: z.ZodBoolean;
                    icon: z.ZodOptional<z.ZodString>;
                    color: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strip>;
        }, z.core.$strip>, z.ZodObject<{
            revision: z.ZodString;
        }, z.core.$strip>, import("@orpc/contract").MergedErrorMap<import("@orpc/contract").MergedErrorMap<Record<never, never>, {
            INTERNAL_SERVER_ERROR: {
                status: number;
                message: string;
                data: z.ZodString;
            };
        }>, {
            STORAGE_ERROR: {
                status: number;
                message: string;
                data: z.ZodString;
            };
            REVISION_CONFLICT: {
                status: number;
                message: string;
                data: z.ZodObject<{
                    revision: z.ZodString;
                }, z.core.$strip>;
            };
        }>, Record<never, never>>;
    };
}
```

<a id="default_background-variable"></a>

### DEFAULT_BACKGROUND

Source: [src/api/schema.ts:17](../../src/api/schema.ts#L17)

リモコン全体の既定の背景色。

<a id="default_background-signature"></a>

#### Signature

```typescript
DEFAULT_BACKGROUND = "#ffffff"
```

<a id="defaultcolormap-variable"></a>

### defaultColorMap

Source: [src/api/colors.ts:67](../../src/api/colors.ts#L67)

標準リモコンのキー定義から生成した既定の色マップ。

<a id="defaultcolormap-signature"></a>

#### Signature

```typescript
defaultColorMap: ColorMap
```

**Type**: [ColorMap](../rz-remocon-api/index.md#colormap-typealias)

<a id="defaultcolorresolver-variable"></a>

### defaultColorResolver

Source: [src/api/colors.ts:72](../../src/api/colors.ts#L72)

既定の色マップを使って色を解決する関数。

<a id="defaultcolorresolver-signature"></a>

#### Signature

```typescript
defaultColorResolver: ColorResolver
```

**Type**: [ColorResolver](../rz-remocon-api/index.md#colorresolver-typealias)

<a id="editorremoconconfigschema-variable"></a>

### editorRemoconConfigSchema

Source: [src/api/schema.ts:106](../../src/api/schema.ts#L106)

編集用リモコン設定のスキーマ。

- 編集内容を保持し、非表示のラベルも保存する。
- 表示用設定は [toRemoconConfig(editor)](../rz-remocon-api/index.md#toremoconconfig-function) で導出する。
- キー ID の重複と、グリッド幅からのはみ出しを検証する。
- キーの縦方向の範囲と、キー同士の重なりは検証しない。

<a id="editorremoconconfigschema-signature"></a>

#### Signature

```typescript
editorRemoconConfigSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    grid: z.ZodObject<{
        columns: z.ZodNumber;
        unit: z.ZodNumber;
    }, z.core.$strip>;
    background: z.ZodString;
    keys: z.ZodArray<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        w: z.ZodNumber;
        h: z.ZodNumber;
        id: z.ZodString;
        name: z.ZodString;
        code: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"">, z.ZodString]>>;
        label: z.ZodOptional<z.ZodString>;
        showLabel: z.ZodBoolean;
        icon: z.ZodOptional<z.ZodString>;
        color: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>
```

<a id="editorremotekeyconfigschema-variable"></a>

### editorRemoteKeyConfigSchema

Source: [src/api/schema.ts:79](../../src/api/schema.ts#L79)

編集用リモコン設定に含まれるキーのスキーマ。

<a id="editorremotekeyconfigschema-signature"></a>

#### Signature

```typescript
editorRemoteKeyConfigSchema: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
    w: z.ZodNumber;
    h: z.ZodNumber;
    id: z.ZodString;
    name: z.ZodString;
    code: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"">, z.ZodString]>>;
    label: z.ZodOptional<z.ZodString>;
    showLabel: z.ZodBoolean;
    icon: z.ZodOptional<z.ZodString>;
    color: z.ZodString;
}, z.core.$strip>
```

<a id="fallback_kind-variable"></a>

### FALLBACK_KIND

Source: [src/api/key-defs.ts:161](../../src/api/key-defs.ts#L161)

キー名から種類を特定できない場合に使用する既定の種類。

<a id="fallback_kind-signature"></a>

#### Signature

```typescript
FALLBACK_KIND: RemoteKeyKind
```

**Type**: [RemoteKeyKind](../rz-remocon-api/index.md#remotekeykind-typealias)

<a id="hexcolorschema-variable"></a>

### hexColorSchema

Source: [src/api/schema.ts:11](../../src/api/schema.ts#L11)

\#RRGGBB 形式の色のスキーマ。

<a id="hexcolorschema-signature"></a>

#### Signature

```typescript
hexColorSchema: z.ZodString
```

<a id="keycodeschema-variable"></a>

### keyCodeSchema

Source: [src/api/schema.ts:23](../../src/api/schema.ts#L23)

キーコードのスキーマ。

<a id="keycodeschema-signature"></a>

#### Signature

```typescript
keyCodeSchema: z.ZodString
```

<a id="label_key_name-variable"></a>

### LABEL_KEY_NAME

Source: [src/api/remote-keys.ts:26](../../src/api/remote-keys.ts#L26)

ラベルを表す特殊キー名。表示要素として扱う。

<a id="label_key_name-signature"></a>

#### Signature

```typescript
LABEL_KEY_NAME = "$_LABEL$"
```

<a id="remoconconfigschema-variable"></a>

### remoconConfigSchema

Source: [src/api/schema.ts:64](../../src/api/schema.ts#L64)

表示用リモコン設定のスキーマ。

<a id="remoconconfigschema-signature"></a>

#### Signature

```typescript
remoconConfigSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    grid: z.ZodObject<{
        columns: z.ZodNumber;
        unit: z.ZodNumber;
    }, z.core.$strip>;
    background: z.ZodString;
    keys: z.ZodArray<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        w: z.ZodNumber;
        h: z.ZodNumber;
        name: z.ZodString;
        code: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"">, z.ZodString]>>;
        label: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        color: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>
```

<a id="remote_key_defs-variable"></a>

### REMOTE_KEY_DEFS

Source: [src/api/key-defs.ts:16](../../src/api/key-defs.ts#L16)

REGZA の標準リモコンのキー定義。

- キー名から、送信するキーコード（`code`）と表示用の `label` を引く対応表。
- 異なるキーが同じキーコード（`code`）を持つことが可能。

<a id="remote_key_defs-signature"></a>

#### Signature

```typescript
REMOTE_KEY_DEFS: {
    readonly powerOn: {
        readonly code: "40BF7E";
        readonly label: "電源ON";
    };
    readonly powerOff: {
        readonly code: "40BF7F";
        readonly label: "電源OFF";
    };
    readonly powerToggle: {
        readonly code: "40BF12";
        readonly label: "電源";
    };
    readonly powerSleep: {
        readonly code: "40BF17";
        readonly label: "オフタイマー";
    };
    readonly volMute: {
        readonly code: "40BF10";
        readonly label: "消音";
    };
    readonly volUp: {
        readonly code: "40BF1A";
        readonly label: "音量＋";
    };
    readonly volDown: {
        readonly code: "40BF1E";
        readonly label: "音量ー";
    };
    readonly chUp: {
        readonly code: "40BF1B";
        readonly label: "チャンネル上";
    };
    readonly chDown: {
        readonly code: "40BF1F";
        readonly label: "チャンネル下";
    };
    readonly chDTT: {
        readonly code: "40BF7A";
        readonly label: "地デジ";
    };
    readonly chBS: {
        readonly code: "40BF7C";
        readonly label: "BS";
    };
    readonly chCS: {
        readonly code: "40BF7D";
        readonly label: "CS";
    };
    readonly ch4K: {
        readonly code: "40BE7C";
        readonly label: "4K";
    };
    readonly chToggle: {
        readonly code: "40BF79";
        readonly label: "放送切換";
    };
    readonly chNumber: {
        readonly code: "40BF60";
        readonly label: "Ch番号入力";
    };
    readonly pgDesc: {
        readonly code: "40BF71";
        readonly label: "番組説明";
    };
    readonly pgGGuide: {
        readonly code: "40BF6D";
        readonly label: "Gガイド";
    };
    readonly pgInfo: {
        readonly code: "40BF33";
        readonly label: "チャンネル情報";
    };
    readonly pgAudio: {
        readonly code: "40BF13";
        readonly label: "音声切換";
    };
    readonly pgDisplay: {
        readonly code: "40BF1C";
        readonly label: "画面表示";
    };
    readonly pgGuide: {
        readonly code: "40BE64";
        readonly label: "番組ガイド";
    };
    readonly pgTable: {
        readonly code: "40BF6E";
        readonly label: "番組表";
    };
    readonly pgPastTable: {
        readonly code: "40BE35";
        readonly label: "過去番組表";
    };
    readonly num0: {
        readonly code: "40BF00";
        readonly label: "0";
    };
    readonly num1: {
        readonly code: "40BF01";
        readonly label: "1";
    };
    readonly num2: {
        readonly code: "40BF02";
        readonly label: "2";
    };
    readonly num3: {
        readonly code: "40BF03";
        readonly label: "3";
    };
    readonly num4: {
        readonly code: "40BF04";
        readonly label: "4";
    };
    readonly num5: {
        readonly code: "40BF05";
        readonly label: "5";
    };
    readonly num6: {
        readonly code: "40BF06";
        readonly label: "6";
    };
    readonly num7: {
        readonly code: "40BF07";
        readonly label: "7";
    };
    readonly num8: {
        readonly code: "40BF08";
        readonly label: "8";
    };
    readonly num9: {
        readonly code: "40BF09";
        readonly label: "9";
    };
    readonly num10: {
        readonly code: "40BF0A";
        readonly label: "10";
    };
    readonly num11: {
        readonly code: "40BF0B";
        readonly label: "11";
    };
    readonly num12: {
        readonly code: "40BF0C";
        readonly label: "12";
    };
    readonly inputToggle: {
        readonly code: "40BF0F";
        readonly label: "入力切換";
    };
    readonly inputHdmi1: {
        readonly code: "40BE37";
        readonly label: "HDMI1";
    };
    readonly inputHdmi2: {
        readonly code: "40BE38";
        readonly label: "HDMI2";
    };
    readonly inputHdmi3: {
        readonly code: "40BE39";
        readonly label: "HDMI3";
    };
    readonly inputHdmi4: {
        readonly code: "40BE3A";
        readonly label: "HDMI4";
    };
    readonly mediaJumpStart: {
        readonly code: "40BE47";
        readonly label: "始めにジャンプ";
    };
    readonly mediaSceneList: {
        readonly code: "40BE4D";
        readonly label: "シーンリスト";
    };
    readonly mediaSubTitle: {
        readonly code: "43BC52";
        readonly label: "字幕";
    };
    readonly mediaRewind: {
        readonly code: "40BE2C";
        readonly label: "早戻し";
    };
    readonly mediaPlay: {
        readonly code: "40BE2D";
        readonly label: "再生";
    };
    readonly mediaFastForward: {
        readonly code: "40BE2E";
        readonly label: "早送り";
    };
    readonly mediaPrev: {
        readonly code: "40BE27";
        readonly label: "前チャプター";
    };
    readonly mediaStop: {
        readonly code: "40BE2B";
        readonly label: "停止";
    };
    readonly mediaPause: {
        readonly code: "40BF50";
        readonly label: "一時停止";
    };
    readonly mediaNext: {
        readonly code: "40BE26";
        readonly label: "次チャプター";
    };
    readonly mediaBack10s: {
        readonly code: "40BE22";
        readonly label: "10秒戻し";
    };
    readonly mediaSkip30s: {
        readonly code: "40BE23";
        readonly label: "30秒送り";
    };
    readonly mediaRecord: {
        readonly code: "40BF86";
        readonly label: "録画";
    };
    readonly btnBlue: {
        readonly code: "40BF73";
        readonly label: "青";
        readonly color: "#2563eb";
        readonly showLabel: false;
    };
    readonly btnRed: {
        readonly code: "40BF74";
        readonly label: "赤";
        readonly color: "#dc2626";
        readonly showLabel: false;
    };
    readonly btnGreen: {
        readonly code: "40BF75";
        readonly label: "緑";
        readonly color: "#16a34a";
        readonly showLabel: false;
    };
    readonly btnYellow: {
        readonly code: "40BF76";
        readonly label: "黄";
        readonly color: "#facc15";
        readonly showLabel: false;
    };
    readonly appYoutube: {
        readonly code: "40BF2F";
        readonly label: "Youtube";
    };
    readonly appAmazonPrime: {
        readonly code: "40BFDE";
        readonly label: "Amazon Prime";
    };
    readonly appWowow: {
        readonly code: "40BF93";
        readonly label: "Wowow";
    };
    readonly appNhkOne: {
        readonly code: "40BF94";
        readonly label: "NHK+";
    };
    readonly appTver: {
        readonly code: "40BF95";
        readonly label: "TVer";
    };
    readonly appDisneyPlus: {
        readonly code: "40BF96";
        readonly label: "Disney+";
    };
    readonly appNetVision: {
        readonly code: "40BF97";
        readonly label: "Net Vision";
    };
    readonly appHulu: {
        readonly code: "40BF98";
        readonly label: "Hulu";
    };
    readonly appAbema: {
        readonly code: "40BF99";
        readonly label: "Abema";
    };
    readonly appDazn: {
        readonly code: "40BF9A";
        readonly label: "DAZN";
    };
    readonly appLemino: {
        readonly code: "40BF9C";
        readonly label: "Lemino";
    };
    readonly appNetflix: {
        readonly code: "40BF9D";
        readonly label: "NETFLIX";
    };
    readonly appFod: {
        readonly code: "40BF9E";
        readonly label: "FOD";
    };
    readonly keyUp: {
        readonly code: "40BF3E";
        readonly label: "上";
    };
    readonly keyDown: {
        readonly code: "40BF3F";
        readonly label: "下";
    };
    readonly keyLeft: {
        readonly code: "40BF5F";
        readonly label: "左";
    };
    readonly keyRight: {
        readonly code: "40BF5B";
        readonly label: "右";
    };
    readonly keyEnter: {
        readonly code: "40BF3D";
        readonly label: "決定";
    };
    readonly keyBack: {
        readonly code: "40BF3B";
        readonly label: "戻る";
    };
    readonly keyExit: {
        readonly code: "40BF3C";
        readonly label: "終了";
    };
    readonly keyUp2: {
        readonly code: "40BE20";
        readonly label: "PgUp";
    };
    readonly keyDown2: {
        readonly code: "40BE21";
        readonly label: "PgDown";
    };
    readonly keyLeft2: {
        readonly code: "40BE22";
        readonly label: "PgLeft";
    };
    readonly keyRight2: {
        readonly code: "40BE23";
        readonly label: "PgRight";
    };
    readonly keyHome: {
        readonly code: "40BFC4";
        readonly label: "ホーム";
    };
    readonly etcRegzaNavi: {
        readonly code: "40BE34";
        readonly label: "レグザナビ";
    };
    readonly etcSmartAccess: {
        readonly code: "40BE4C";
        readonly label: "ざんまい";
    };
    readonly etcRecList: {
        readonly code: "40BE28";
        readonly label: "録画リスト";
    };
    readonly etcNews: {
        readonly code: "40BE29";
        readonly label: "今すぐニュース";
    };
    readonly etcDdata: {
        readonly code: "43BC14";
        readonly label: "dデータ";
    };
    readonly etcAllCh: {
        readonly code: "40BF26";
        readonly label: "丸ごとチャンネル";
    };
    readonly etcSetting: {
        readonly code: "40BFD0";
        readonly label: "設定";
    };
    readonly etcSubMenu: {
        readonly code: "40BF27";
        readonly label: "サブメニュー";
    };
    readonly etcDualScreen: {
        readonly code: "40BF29";
        readonly label: "二画面";
    };
}
```

<a id="remote_key_kind_defs-variable"></a>

### REMOTE_KEY_KIND_DEFS

Source: [src/api/key-defs.ts:142](../../src/api/key-defs.ts#L142)

キーの種類ごとの接頭辞、表示名、既定色の定義。

<a id="remote_key_kind_defs-signature"></a>

#### Signature

```typescript
REMOTE_KEY_KIND_DEFS: readonly [{
    readonly kind: "power";
    readonly prefix: "power";
    readonly label: "電源";
    readonly color: "#ef4444";
}, {
    readonly kind: "volume";
    readonly prefix: "vol";
    readonly label: "音量";
    readonly color: "#f59e0b";
}, {
    readonly kind: "channel";
    readonly prefix: "ch";
    readonly label: "チャンネル";
    readonly color: "#10b981";
}, {
    readonly kind: "program";
    readonly prefix: "pg";
    readonly label: "番組";
    readonly color: "#6366f1";
}, {
    readonly kind: "number";
    readonly prefix: "num";
    readonly label: "数字";
    readonly color: "#0ea5e9";
}, {
    readonly kind: "input";
    readonly prefix: "input";
    readonly label: "入力切換";
    readonly color: "#8b5cf6";
}, {
    readonly kind: "media";
    readonly prefix: "media";
    readonly label: "メディア";
    readonly color: "#ec4899";
}, {
    readonly kind: "button";
    readonly prefix: "btn";
    readonly label: "ボタン";
    readonly color: "#0094ff";
}, {
    readonly kind: "app";
    readonly prefix: "app";
    readonly label: "アプリ";
    readonly color: "#000000";
}, {
    readonly kind: "key";
    readonly prefix: "key";
    readonly label: "キー";
    readonly color: "#64748b";
}, {
    readonly kind: "etc";
    readonly prefix: "etc";
    readonly label: "その他";
    readonly color: "#94a3b8";
}, {
    readonly kind: "layout";
    readonly prefix: "$";
    readonly label: "レイアウト";
    readonly color: "#475569";
}]
```

<a id="remotekeyconfigschema-variable"></a>

### remoteKeyConfigSchema

Source: [src/api/schema.ts:43](../../src/api/schema.ts#L43)

表示用リモコン設定に含まれるキーのスキーマ。

<a id="remotekeyconfigschema-signature"></a>

#### Signature

```typescript
remoteKeyConfigSchema: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
    w: z.ZodNumber;
    h: z.ZodNumber;
    name: z.ZodString;
    code: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"">, z.ZodString]>>;
    label: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    color: z.ZodString;
}, z.core.$strip>
```

<a id="remotekeys-variable"></a>

### RemoteKeys

Source: [src/api/remote-keys.ts:91](../../src/api/remote-keys.ts#L91)

キー名と操作キー定義の対応表。

[RemoconBuilder](../rz-remocon-api/remoconbuilder-class.md) の引数に使用できる。

<a id="remotekeys-signature"></a>

#### Signature

```typescript
RemoteKeys: Record<RemoteKeyName, RemoteKey>
```

**Type**: Record<[RemoteKeyName](../rz-remocon-api/index.md#remotekeyname-typealias), [RemoteKey](../rz-remocon-api/index.md#remotekey-interface)>

<a id="special_key_defs-variable"></a>

### SPECIAL_KEY_DEFS

Source: [src/api/remote-keys.ts:41](../../src/api/remote-keys.ts#L41)

特殊キー名と定義の対応表。

<a id="special_key_defs-signature"></a>

#### Signature

```typescript
SPECIAL_KEY_DEFS: {
    readonly $TAB$: {
        readonly label: "タブ";
        readonly fullWidth: true;
    };
    readonly $_LABEL$: {
        readonly label: "ラベル";
        readonly fullWidth: false;
    };
}
```

<a id="tab_key_name-variable"></a>

### TAB_KEY_NAME

Source: [src/api/remote-keys.ts:23](../../src/api/remote-keys.ts#L23)

タブを表す特殊キー名。

<a id="tab_key_name-signature"></a>

#### Signature

```typescript
TAB_KEY_NAME = "$TAB$"
```
