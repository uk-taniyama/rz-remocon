[README](../../README.md) / rz-remocon/api

# rz-remocon/api

## Interfaces

| Interface | Description |
| - | - |
| [RemoconBuilderOptions](../rz-remocon-api/index.md#remoconbuilderoptions-interface) | Builder の生成オプション |
| [RemoteKey](../rz-remocon-api/index.md#remotekey-interface) | 定義済みの操作キー |
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
| [ApiFailure](../rz-remocon-api/index.md#apifailure-typealias) | |
| [ApiResult](../rz-remocon-api/index.md#apiresult-typealias) | API 呼び出しの結果 |
| [ApiSuccess](../rz-remocon-api/index.md#apisuccess-typealias) | |
| [Client](../rz-remocon-api/index.md#client-typealias) | |
| [ColorMap](../rz-remocon-api/index.md#colormap-typealias) | |
| [ColorMapResult](../rz-remocon-api/index.md#colormapresult-typealias) | |
| [ColorResolver](../rz-remocon-api/index.md#colorresolver-typealias) | |
| [Contract](../rz-remocon-api/index.md#contract-typealias) | API の契約の型 |
| [EditorRemoconConfig](../rz-remocon-api/index.md#editorremoconconfig-typealias) | |
| [EditorRemoteKeyConfig](../rz-remocon-api/index.md#editorremotekeyconfig-typealias) | |
| [IconUrls](../rz-remocon-api/index.md#iconurls-typealias) | アイコン名から画像 URL への対応表 |
| [IconUrlsResult](../rz-remocon-api/index.md#iconurlsresult-typealias) | |
| [RemoconConfig](../rz-remocon-api/index.md#remoconconfig-typealias) | |
| [RemoteKeyConfig](../rz-remocon-api/index.md#remotekeyconfig-typealias) | |
| [RemoteKeyDecorator](../rz-remocon-api/index.md#remotekeydecorator-typealias) | キーを更新する関数 |
| [RemoteKeyDraft](../rz-remocon-api/index.md#remotekeydraft-typealias) | Builder 内部でキーを組み立てるための中間データ |
| [RemoteKeyKind](../rz-remocon-api/index.md#remotekeykind-typealias) | |
| [RemoteKeyName](../rz-remocon-api/index.md#remotekeyname-typealias) | |
| [RemoteKeyOverrides](../rz-remocon-api/index.md#remotekeyoverrides-typealias) | キーに適用する上書き指定 |

## Functions

| Function | Description |
| - | - |
| [createColorResolver(colors)](../rz-remocon-api/index.md#createcolorresolver-function) | 色マップから、キー名に対応する色を解決する関数を生成する |
| [createDefaultColorMap()](../rz-remocon-api/index.md#createdefaultcolormap-function) | |
| [createRemoteKeyDraft(key, unit)](../rz-remocon-api/index.md#createremotekeydraft-function) | 操作キーの定義から、Builder 用の draft を生成する |
| [getClient(baseUrl)](../rz-remocon-api/index.md#getclient-function) | 指定したベース URL に接続する、型付きの API クライアントを生成する |
| [isSpecialKey(name)](../rz-remocon-api/index.md#isspecialkey-function) | 名前が特殊キーかを判定する |
| [mergeColorMap(overrides)](../rz-remocon-api/index.md#mergecolormap-function) | 標準の色（defaultColorMap）に、color-map.json の内容を重ねた色の対応表を返す |
| [parseColorMap(value)](../rz-remocon-api/index.md#parsecolormap-function) | JSON として読み込んだ値を、色の対応表に変換する |
| [parseIconUrls(value)](../rz-remocon-api/index.md#parseiconurls-function) | JSON として読み込んだ値を、アイコン名と画像 URL の対応表に変換する |
| [remoteKeysBuilder(options)](../rz-remocon-api/index.md#remotekeysbuilder-function) | リモコン設定を組み立てる Builder を生成する |
| [resolveRemoteKeyKindDef(name)](../rz-remocon-api/index.md#resolveremotekeykinddef-function) | キー名からキーの種類の定義を取得する |
| [safeApiCall(apiResult)](../rz-remocon-api/index.md#safeapicall-function) | API 呼び出しを実行し、例外を <code>ApiResult</code> に変換して返す |
| [toRemoconConfig(editor)](../rz-remocon-api/index.md#toremoconconfig-function) | 編集用データから、表示用データを導出する |

## Variables

| Variable | Description |
| - | - |
| [apiPrefix](../rz-remocon-api/index.md#apiprefix-variable) | API のパスプレフィックス |
| [contract](../rz-remocon-api/index.md#contract-variable) | API の契約（エンドポイント定義の集合） |
| [DEFAULT_BACKGROUND](../rz-remocon-api/index.md#default_background-variable) | リモコン全体の背景色の既定値（白） |
| [defaultColorMap](../rz-remocon-api/index.md#defaultcolormap-variable) | |
| [defaultColorResolver](../rz-remocon-api/index.md#defaultcolorresolver-variable) | |
| [editorRemoconConfigSchema](../rz-remocon-api/index.md#editorremoconconfigschema-variable) | 編集用のリモコン設定（remocon.editor.json）のスキーマ |
| [editorRemoteKeyConfigSchema](../rz-remocon-api/index.md#editorremotekeyconfigschema-variable) | 編集用のキー1個分（remocon.editor.json）のスキーマ |
| [FALLBACK_KIND](../rz-remocon-api/index.md#fallback_kind-variable) | どの接頭辞にも一致しないキー名に使う種類 |
| [hexColorSchema](../rz-remocon-api/index.md#hexcolorschema-variable) | |
| [keyCodeSchema](../rz-remocon-api/index.md#keycodeschema-variable) | キーコードのスキーマ |
| [LABEL_KEY_NAME](../rz-remocon-api/index.md#label_key_name-variable) | ラベル |
| [remoconConfigSchema](../rz-remocon-api/index.md#remoconconfigschema-variable) | 表示用のリモコン設定（remocon.json）のスキーマ |
| [REMOTE_KEY_DEFS](../rz-remocon-api/index.md#remote_key_defs-variable) | REGZA のリモコンキーの定義（キー名から code とラベルへの対応表） |
| [REMOTE_KEY_KIND_DEFS](../rz-remocon-api/index.md#remote_key_kind_defs-variable) | |
| [remoteKeyConfigSchema](../rz-remocon-api/index.md#remotekeyconfigschema-variable) | 表示用のキー1個分（remocon.json）のスキーマ |
| [RemoteKeys](../rz-remocon-api/index.md#remotekeys-variable) | 操作キーの定義表を、name を含むキーオブジェクトの辞書に変換したもの |
| [SPECIAL_KEY_DEFS](../rz-remocon-api/index.md#special_key_defs-variable) | 特殊キー名の定義 |
| [TAB_KEY_NAME](../rz-remocon-api/index.md#tab_key_name-variable) | タブ |

## Interface Details

<a id="remoconbuilderoptions-interface"></a>

### RemoconBuilderOptions

Source: [src/api/builder.ts:104](../../src/api/builder.ts#L104)

Builder の生成オプション。

<a id="remoconbuilderoptions-signature"></a>

#### Signature

```typescript
export interface RemoconBuilderOptions
```

#### Properties

| Property | Description |
| - | - |
| [background](../rz-remocon-api/index.md#remoconbuilderoptions-background-propertysignature) | リモコン全体の背景色 |
| [columns](../rz-remocon-api/index.md#remoconbuilderoptions-columns-propertysignature) | グリッドの列数 |
| [decorator](../rz-remocon-api/index.md#remoconbuilderoptions-decorator-propertysignature) | キーを更新する関数 |
| [unit](../rz-remocon-api/index.md#remoconbuilderoptions-unit-propertysignature) | 1 キー分のセル数 |

#### Property Details

<a id="remoconbuilderoptions-background-propertysignature"></a>

##### background

リモコン全体の背景色。省略時は DEFAULT_BACKGROUND を使用する。

<a id="background-signature"></a>

###### Signature

```typescript
background?: string;
```

**Type**: string

<a id="remoconbuilderoptions-columns-propertysignature"></a>

##### columns

グリッドの列数。出力の grid.columns に反映する。

<a id="columns-signature"></a>

###### Signature

```typescript
columns: number;
```

**Type**: number

<a id="remoconbuilderoptions-decorator-propertysignature"></a>

##### decorator

キーを更新する関数。省略時は何もしない。

<a id="decorator-signature"></a>

###### Signature

```typescript
decorator?: RemoteKeyDecorator;
```

**Type**: [RemoteKeyDecorator](../rz-remocon-api/index.md#remotekeydecorator-typealias)

<a id="remoconbuilderoptions-unit-propertysignature"></a>

##### unit

1 キー分のセル数。出力の grid.unit に反映する。省略時は 4。

<a id="unit-signature"></a>

###### Signature

```typescript
unit?: number;
```

**Type**: number

<a id="remotekey-interface"></a>

### RemoteKey

Source: [src/api/remote-keys.ts:79](../../src/api/remote-keys.ts#L79)

定義済みの操作キー。

- 定義名をキー自身の name プロパティにも持つ。

<a id="remotekey-signature"></a>

#### Signature

```typescript
export interface RemoteKey extends RemoteKeyDef
```

**Extends**: [RemoteKeyDef](../rz-remocon-api/index.md#remotekeydef-interface)

#### Properties

| Property | Description |
| - | - |
| [name](../rz-remocon-api/index.md#remotekey-name-propertysignature) | |

#### Property Details

<a id="remotekey-name-propertysignature"></a>

##### name

<a id="name-signature"></a>

###### Signature

```typescript
name: string;
```

**Type**: string

<a id="remotekeydef-interface"></a>

### RemoteKeyDef

Source: [src/api/key-types.ts:7](../../src/api/key-types.ts#L7)

キーの定義。REMOTE_KEY_DEFS の値の型。

<a id="remotekeydef-signature"></a>

#### Signature

```typescript
export interface RemoteKeyDef
```

#### Properties

| Property | Description |
| - | - |
| [code](../rz-remocon-api/index.md#remotekeydef-code-propertysignature) | |
| [color](../rz-remocon-api/index.md#remotekeydef-color-propertysignature) | |
| [label](../rz-remocon-api/index.md#remotekeydef-label-propertysignature) | |
| [showLabel](../rz-remocon-api/index.md#remotekeydef-showlabel-propertysignature) | |

#### Property Details

<a id="remotekeydef-code-propertysignature"></a>

##### code

<a id="code-signature"></a>

###### Signature

```typescript
code: string;
```

**Type**: string

<a id="remotekeydef-color-propertysignature"></a>

##### color

<a id="color-signature"></a>

###### Signature

```typescript
color?: string;
```

**Type**: string

<a id="remotekeydef-label-propertysignature"></a>

##### label

<a id="label-signature"></a>

###### Signature

```typescript
label: string;
```

**Type**: string

<a id="remotekeydef-showlabel-propertysignature"></a>

##### showLabel

<a id="showlabel-signature"></a>

###### Signature

```typescript
showLabel?: boolean;
```

**Type**: boolean

<a id="remotekeykinddef-interface"></a>

### RemoteKeyKindDef

Source: [src/api/key-types.ts:15](../../src/api/key-types.ts#L15)

キーの種類（カテゴリ）の定義。REMOTE_KEY_KIND_DEFS の要素の型。

<a id="remotekeykinddef-signature"></a>

#### Signature

```typescript
export interface RemoteKeyKindDef
```

#### Properties

| Property | Description |
| - | - |
| [color](../rz-remocon-api/index.md#remotekeykinddef-color-propertysignature) | |
| [kind](../rz-remocon-api/index.md#remotekeykinddef-kind-propertysignature) | |
| [label](../rz-remocon-api/index.md#remotekeykinddef-label-propertysignature) | |
| [prefix](../rz-remocon-api/index.md#remotekeykinddef-prefix-propertysignature) | |

#### Property Details

<a id="remotekeykinddef-color-propertysignature"></a>

##### color

<a id="color-signature"></a>

###### Signature

```typescript
color: string;
```

**Type**: string

<a id="remotekeykinddef-kind-propertysignature"></a>

##### kind

<a id="kind-signature"></a>

###### Signature

```typescript
kind: string;
```

**Type**: string

<a id="remotekeykinddef-label-propertysignature"></a>

##### label

<a id="label-signature"></a>

###### Signature

```typescript
label: string;
```

**Type**: string

<a id="remotekeykinddef-prefix-propertysignature"></a>

##### prefix

<a id="prefix-signature"></a>

###### Signature

```typescript
prefix: string;
```

**Type**: string

<a id="specialkeydef-interface"></a>

### SpecialKeyDef

Source: [src/api/remote-keys.ts:30](../../src/api/remote-keys.ts#L30)

特殊キーの定義。

- REGZA の操作キーとは分けて管理する。

<a id="specialkeydef-signature"></a>

#### Signature

```typescript
export interface SpecialKeyDef
```

#### Properties

| Property | Description |
| - | - |
| [fullWidth](../rz-remocon-api/index.md#specialkeydef-fullwidth-propertysignature) | グリッドの行全体を使用するか |
| [label](../rz-remocon-api/index.md#specialkeydef-label-propertysignature) | 表示名 |

#### Property Details

<a id="specialkeydef-fullwidth-propertysignature"></a>

##### fullWidth

グリッドの行全体を使用するか。

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

Source: [src/api/client.ts:27](../../src/api/client.ts#L27)

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

Source: [src/api/client.ts:39](../../src/api/client.ts#L39)

API 呼び出しの結果。 成功時は ApiSuccess、失敗時は ApiFailure になる。

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

Source: [src/api/client.ts:25](../../src/api/client.ts#L25)

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
| T | |

<a id="client-typealias"></a>

### Client

Source: [src/api/client.ts:23](../../src/api/client.ts#L23)

<a id="client-signature"></a>

#### Signature

```typescript
export type Client = ReturnType<typeof getClient>;
```

<a id="colormap-typealias"></a>

### ColorMap

Source: [src/api/colors.ts:11](../../src/api/colors.ts#L11)

<a id="colormap-signature"></a>

#### Signature

```typescript
export type ColorMap = Record<string, string> & Record<"DEFAULT", string>;
```

<a id="colormapresult-typealias"></a>

### ColorMapResult

Source: [src/api/colors.ts:46](../../src/api/colors.ts#L46)

<a id="colormapresult-signature"></a>

#### Signature

```typescript
export type ColorMapResult = {
    colors: Record<string, string>;
    errors: string[];
};
```

<a id="colorresolver-typealias"></a>

### ColorResolver

Source: [src/api/colors.ts:13](../../src/api/colors.ts#L13)

<a id="colorresolver-signature"></a>

#### Signature

```typescript
export type ColorResolver = (name: string) => string;
```

<a id="contract-typealias"></a>

### Contract

Source: [src/api/contract.ts:117](../../src/api/contract.ts#L117)

API の契約の型。

<a id="contract-signature"></a>

#### Signature

```typescript
export type Contract = typeof contract;
```

<a id="editorremoconconfig-typealias"></a>

### EditorRemoconConfig

Source: [src/api/schema.ts:161](../../src/api/schema.ts#L161)

<a id="editorremoconconfig-signature"></a>

#### Signature

```typescript
export type EditorRemoconConfig = z.infer<typeof editorRemoconConfigSchema>;
```

<a id="editorremotekeyconfig-typealias"></a>

### EditorRemoteKeyConfig

Source: [src/api/schema.ts:160](../../src/api/schema.ts#L160)

<a id="editorremotekeyconfig-signature"></a>

#### Signature

```typescript
export type EditorRemoteKeyConfig = z.infer<typeof editorRemoteKeyConfigSchema>;
```

<a id="iconurls-typealias"></a>

### IconUrls

Source: [src/api/icon-urls.ts:9](../../src/api/icon-urls.ts#L9)

アイコン名から画像 URL への対応表。

<a id="iconurls-signature"></a>

#### Signature

```typescript
export type IconUrls = Record<string, string>;
```

<a id="iconurlsresult-typealias"></a>

### IconUrlsResult

Source: [src/api/icon-urls.ts:38](../../src/api/icon-urls.ts#L38)

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

Source: [src/api/schema.ts:89](../../src/api/schema.ts#L89)

<a id="remoconconfig-signature"></a>

#### Signature

```typescript
export type RemoconConfig = z.infer<typeof remoconConfigSchema>;
```

<a id="remotekeyconfig-typealias"></a>

### RemoteKeyConfig

Source: [src/api/schema.ts:88](../../src/api/schema.ts#L88)

<a id="remotekeyconfig-signature"></a>

#### Signature

```typescript
export type RemoteKeyConfig = z.infer<typeof remoteKeyConfigSchema>;
```

<a id="remotekeydecorator-typealias"></a>

### RemoteKeyDecorator

Source: [src/api/builder.ts:57](../../src/api/builder.ts#L57)

キーを更新する関数。

<a id="remotekeydecorator-signature"></a>

#### Signature

```typescript
export type RemoteKeyDecorator = (key: RemoteKeyDraft) => RemoteKeyDraft;
```

<a id="remotekeydraft-typealias"></a>

### RemoteKeyDraft

Source: [src/api/builder.ts:23](../../src/api/builder.ts#L23)

Builder 内部でキーを組み立てるための中間データ。

- color は decorator や overrides で決定できるよう、未設定を許容する。
- showLabel は label の文字列を保持したまま、表示するかどうかを管理する。
- x / y は配置時に決まるため、draft の生成時点では仮の値を使用する。
- 最終的な出力形式への変換時に showLabel を解決する。

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

Source: [src/api/key-defs.ts:155](../../src/api/key-defs.ts#L155)

<a id="remotekeykind-signature"></a>

#### Signature

```typescript
export type RemoteKeyKind = (typeof REMOTE_KEY_KIND_DEFS)[number]["kind"];
```

<a id="remotekeyname-typealias"></a>

### RemoteKeyName

Source: [src/api/key-defs.ts:138](../../src/api/key-defs.ts#L138)

<a id="remotekeyname-signature"></a>

#### Signature

```typescript
export type RemoteKeyName = keyof typeof REMOTE_KEY_DEFS;
```

<a id="remotekeyoverrides-typealias"></a>

### RemoteKeyOverrides

Source: [src/api/builder.ts:29](../../src/api/builder.ts#L29)

キーに適用する上書き指定。座標 x / y は自動配置専用のため変更できない。

<a id="remotekeyoverrides-signature"></a>

#### Signature

```typescript
export type RemoteKeyOverrides = Partial<Omit<RemoteKeyDraft, "x" | "y">>;
```

## Function Details

<a id="createcolorresolver-function"></a>

### createColorResolver

Source: [src/api/colors.ts:35](../../src/api/colors.ts#L35)

色マップから、キー名に対応する色を解決する関数を生成する。

- キー個別、kind、DEFAULT の順に検索する。
- DEFAULTは生成時に存在を保証すること！

<a id="createcolorresolver-signature"></a>

#### Signature

```typescript
export declare function createColorResolver(colors: ColorMap): ColorResolver;
```

<a id="createcolorresolver-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| colors | |

<a id="createcolorresolver-returns"></a>

#### Returns

**Return type**: [ColorResolver](../rz-remocon-api/index.md#colorresolver-typealias)

<a id="createdefaultcolormap-function"></a>

### createDefaultColorMap

Source: [src/api/colors.ts:15](../../src/api/colors.ts#L15)

<a id="createdefaultcolormap-signature"></a>

#### Signature

```typescript
export declare function createDefaultColorMap(): ColorMap;
```

<a id="createdefaultcolormap-returns"></a>

#### Returns

**Return type**: [ColorMap](../rz-remocon-api/index.md#colormap-typealias)

<a id="createremotekeydraft-function"></a>

### createRemoteKeyDraft

Source: [src/api/builder.ts:39](../../src/api/builder.ts#L39)

操作キーの定義から、Builder 用の draft を生成する。

- 幅と高さは 1 キー分の unit、座標は配置前の仮の値とする。

<a id="createremotekeydraft-signature"></a>

#### Signature

```typescript
export declare function createRemoteKeyDraft(key: RemoteKey, unit: number): RemoteKeyDraft;
```

<a id="createremotekeydraft-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| key | 操作キーの定義 |
| unit | 1 キー分のセル数 |

<a id="createremotekeydraft-returns"></a>

#### Returns

**Return type**: [RemoteKeyDraft](../rz-remocon-api/index.md#remotekeydraft-typealias)

<a id="getclient-function"></a>

### getClient

Source: [src/api/client.ts:16](../../src/api/client.ts#L16)

指定したベース URL に接続する、型付きの API クライアントを生成する。

<a id="getclient-signature"></a>

#### Signature

```typescript
export declare function getClient(baseUrl: string): {
    sendCode: import("@orpc/contract").ContractProcedureClient<Record<never, never>, import("zod").ZodObject<{
        code: import("zod").ZodString;
    }, import("zod/v4/core").$strip>, import("zod").ZodNumber, import("@orpc/contract").MergedErrorMap<Record<never, never>, {
        INTERNAL_SERVER_ERROR: {
            status: number;
            message: string;
            data: import("zod").ZodString;
        };
    }>>;
    status: import("@orpc/contract").ContractProcedureClient<Record<never, never>, import("@orpc/contract").Schema<unknown, unknown>, import("zod").ZodNumber, import("@orpc/contract").MergedErrorMap<Record<never, never>, {
        INTERNAL_SERVER_ERROR: {
            status: number;
            message: string;
            data: import("zod").ZodString;
        };
    }>>;
    editor: {
        get: import("@orpc/contract").ContractProcedureClient<Record<never, never>, import("@orpc/contract").Schema<unknown, unknown>, import("zod").ZodObject<{
            revision: import("zod").ZodString;
            config: import("zod").ZodNullable<import("zod").ZodObject<{
                version: import("zod").ZodLiteral<1>;
                grid: import("zod").ZodObject<{
                    columns: import("zod").ZodNumber;
                    unit: import("zod").ZodNumber;
                }, import("zod/v4/core").$strip>;
                background: import("zod").ZodString;
                keys: import("zod").ZodArray<import("zod").ZodObject<{
                    x: import("zod").ZodNumber;
                    y: import("zod").ZodNumber;
                    w: import("zod").ZodNumber;
                    h: import("zod").ZodNumber;
                    id: import("zod").ZodString;
                    name: import("zod").ZodString;
                    code: import("zod").ZodOptional<import("zod").ZodUnion<readonly [import("zod").ZodLiteral<"">, import("zod").ZodString]>>;
                    label: import("zod").ZodOptional<import("zod").ZodString>;
                    showLabel: import("zod").ZodBoolean;
                    icon: import("zod").ZodOptional<import("zod").ZodString>;
                    color: import("zod").ZodString;
                }, import("zod/v4/core").$strip>>;
            }, import("zod/v4/core").$strip>>;
            invalid: import("zod").ZodBoolean;
        }, import("zod/v4/core").$strip>, import("@orpc/contract").MergedErrorMap<import("@orpc/contract").MergedErrorMap<Record<never, never>, {
            INTERNAL_SERVER_ERROR: {
                status: number;
                message: string;
                data: import("zod").ZodString;
            };
        }>, {
            STORAGE_ERROR: {
                status: number;
                message: string;
                data: import("zod").ZodString;
            };
            REVISION_CONFLICT: {
                status: number;
                message: string;
                data: import("zod").ZodObject<{
                    revision: import("zod").ZodString;
                }, import("zod/v4/core").$strip>;
            };
        }>>;
        save: import("@orpc/contract").ContractProcedureClient<Record<never, never>, import("zod").ZodObject<{
            revision: import("zod").ZodNullable<import("zod").ZodString>;
            config: import("zod").ZodObject<{
                version: import("zod").ZodLiteral<1>;
                grid: import("zod").ZodObject<{
                    columns: import("zod").ZodNumber;
                    unit: import("zod").ZodNumber;
                }, import("zod/v4/core").$strip>;
                background: import("zod").ZodString;
                keys: import("zod").ZodArray<import("zod").ZodObject<{
                    x: import("zod").ZodNumber;
                    y: import("zod").ZodNumber;
                    w: import("zod").ZodNumber;
                    h: import("zod").ZodNumber;
                    id: import("zod").ZodString;
                    name: import("zod").ZodString;
                    code: import("zod").ZodOptional<import("zod").ZodUnion<readonly [import("zod").ZodLiteral<"">, import("zod").ZodString]>>;
                    label: import("zod").ZodOptional<import("zod").ZodString>;
                    showLabel: import("zod").ZodBoolean;
                    icon: import("zod").ZodOptional<import("zod").ZodString>;
                    color: import("zod").ZodString;
                }, import("zod/v4/core").$strip>>;
            }, import("zod/v4/core").$strip>;
        }, import("zod/v4/core").$strip>, import("zod").ZodObject<{
            revision: import("zod").ZodString;
        }, import("zod/v4/core").$strip>, import("@orpc/contract").MergedErrorMap<import("@orpc/contract").MergedErrorMap<Record<never, never>, {
            INTERNAL_SERVER_ERROR: {
                status: number;
                message: string;
                data: import("zod").ZodString;
            };
        }>, {
            STORAGE_ERROR: {
                status: number;
                message: string;
                data: import("zod").ZodString;
            };
            REVISION_CONFLICT: {
                status: number;
                message: string;
                data: import("zod").ZodObject<{
                    revision: import("zod").ZodString;
                }, import("zod/v4/core").$strip>;
            };
        }>>;
    };
};
```

<a id="getclient-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| baseUrl | API サーバーのベース URL（apiPrefix は含めない） |

<a id="getclient-returns"></a>

#### Returns

API クライアント。

<a id="isspecialkey-function"></a>

### isSpecialKey

Source: [src/api/remote-keys.ts:15](../../src/api/remote-keys.ts#L15)

名前が特殊キーかを判定する。

- 特殊キーはリモコン操作用のキーではなく、レイアウトや表示に使用する。

<a id="isspecialkey-signature"></a>

#### Signature

```typescript
export declare function isSpecialKey(name: string): boolean;
```

<a id="isspecialkey-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| name | |

<a id="isspecialkey-returns"></a>

#### Returns

**Return type**: boolean

<a id="mergecolormap-function"></a>

### mergeColorMap

Source: [src/api/colors.ts:81](../../src/api/colors.ts#L81)

標準の色（defaultColorMap）に、color-map.json の内容を重ねた色の対応表を返す。同じ名前は後者を優先する。

<a id="mergecolormap-signature"></a>

#### Signature

```typescript
export declare function mergeColorMap(overrides: Record<string, string>): ColorMap;
```

<a id="mergecolormap-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| overrides | parseColorMap() が返した対応表 |

<a id="mergecolormap-returns"></a>

#### Returns

**Return type**: [ColorMap](../rz-remocon-api/index.md#colormap-typealias)

<a id="parsecolormap-function"></a>

### parseColorMap

Source: [src/api/colors.ts:62](../../src/api/colors.ts#L62)

JSON として読み込んだ値を、色の対応表に変換する。

- 入力全体が JSON オブジェクトでない場合は、空の対応表とエラーを返す。
- 項目が不正な場合は、その項目を除外してエラーに記録する。色は #RRGGBB 形式のみ使える。
- 不正な項目があっても、正常な項目は返す。
- 名前は、キー名か kind として使われる（どの接頭辞にも当たらないキーは kind が etc になるため、その色は etc で変える）。
- 標準にない名前も検証せずに受け入れる（icon-urls.json と同じ）。

<a id="parsecolormap-signature"></a>

#### Signature

```typescript
export declare function parseColorMap(value: unknown): ColorMapResult;
```

<a id="parsecolormap-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| value | |

<a id="parsecolormap-returns"></a>

#### Returns

**Return type**: [ColorMapResult](../rz-remocon-api/index.md#colormapresult-typealias)

<a id="parseiconurls-function"></a>

### parseIconUrls

Source: [src/api/icon-urls.ts:51](../../src/api/icon-urls.ts#L51)

JSON として読み込んだ値を、アイコン名と画像 URL の対応表に変換する。

- 入力全体が JSON オブジェクトでない場合は、空の対応表とエラーを返す。
- 項目が不正な場合は、その項目を除外してエラーに記録する。
- 不正な項目があっても、正常な項目は返す。

<a id="parseiconurls-signature"></a>

#### Signature

```typescript
export declare function parseIconUrls(value: unknown): IconUrlsResult;
```

<a id="parseiconurls-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| value | |

<a id="parseiconurls-returns"></a>

#### Returns

**Return type**: [IconUrlsResult](../rz-remocon-api/index.md#iconurlsresult-typealias)

<a id="remotekeysbuilder-function"></a>

### remoteKeysBuilder

Source: [src/api/builder.ts:325](../../src/api/builder.ts#L325)

リモコン設定を組み立てる Builder を生成する。

<a id="remotekeysbuilder-signature"></a>

#### Signature

```typescript
export declare function remoteKeysBuilder(options: RemoconBuilderOptions): RemoconBuilder;
```

<a id="remotekeysbuilder-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| options | グリッド幅や背景色、キーの既定値などの設定 |

<a id="remotekeysbuilder-returns"></a>

#### Returns

**Return type**: [RemoconBuilder](../rz-remocon-api/remoconbuilder-class.md)

<a id="resolveremotekeykinddef-function"></a>

### resolveRemoteKeyKindDef

Source: [src/api/remote-keys.ts:67](../../src/api/remote-keys.ts#L67)

キー名からキーの種類の定義を取得する。

- 複数の接頭辞が一致する場合は、REMOTE_KEY_KIND_DEFS で先に定義されたものを採用する。 = 一致するものがなければ FALLBACK_KIND の定義を返す。

<a id="resolveremotekeykinddef-signature"></a>

#### Signature

```typescript
export declare function resolveRemoteKeyKindDef(name: string): {
    readonly kind: "power";
    readonly prefix: "power";
    readonly label: "電源";
    readonly color: "#ef4444";
} | {
    readonly kind: "volume";
    readonly prefix: "vol";
    readonly label: "音量";
    readonly color: "#f59e0b";
} | {
    readonly kind: "channel";
    readonly prefix: "ch";
    readonly label: "チャンネル";
    readonly color: "#10b981";
} | {
    readonly kind: "program";
    readonly prefix: "pg";
    readonly label: "番組";
    readonly color: "#6366f1";
} | {
    readonly kind: "number";
    readonly prefix: "num";
    readonly label: "数字";
    readonly color: "#0ea5e9";
} | {
    readonly kind: "input";
    readonly prefix: "input";
    readonly label: "入力切替";
    readonly color: "#8b5cf6";
} | {
    readonly kind: "media";
    readonly prefix: "media";
    readonly label: "メディア";
    readonly color: "#ec4899";
} | {
    readonly kind: "button";
    readonly prefix: "btn";
    readonly label: "ボタン";
    readonly color: "#0094ff";
} | {
    readonly kind: "app";
    readonly prefix: "app";
    readonly label: "アプリ";
    readonly color: "#000000";
} | {
    readonly kind: "key";
    readonly prefix: "key";
    readonly label: "キー";
    readonly color: "#64748b";
} | {
    readonly kind: "etc";
    readonly prefix: "etc";
    readonly label: "その他";
    readonly color: "#94a3b8";
} | {
    readonly kind: "layout";
    readonly prefix: "$";
    readonly label: "レイアウト";
    readonly color: "#475569";
};
```

<a id="resolveremotekeykinddef-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| name | |

<a id="resolveremotekeykinddef-returns"></a>

#### Returns

<a id="safeapicall-function"></a>

### safeApiCall

Source: [src/api/client.ts:52](../../src/api/client.ts#L52)

API 呼び出しを実行し、例外を `ApiResult` に変換して返す。

失敗した場合は、API で定義されたエラー、リクエストエラー、 予期しないステータス、ネットワークエラーのいずれかに分類する。

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

Source: [src/api/utils.ts:5](../../src/api/utils.ts#L5)

編集用データから、表示用データを導出する。

<a id="toremoconconfig-signature"></a>

#### Signature

```typescript
export declare function toRemoconConfig(editor: EditorRemoconConfig): RemoconConfig;
```

<a id="toremoconconfig-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| editor | |

<a id="toremoconconfig-returns"></a>

#### Returns

**Return type**: [RemoconConfig](../rz-remocon-api/index.md#remoconconfig-typealias)

## Variable Details

<a id="apiprefix-variable"></a>

### apiPrefix

Source: [src/api/contract.ts:100](../../src/api/contract.ts#L100)

API のパスプレフィックス。

<a id="apiprefix-signature"></a>

#### Signature

```typescript
apiPrefix = "/api"
```

<a id="contract-variable"></a>

### contract

Source: [src/api/contract.ts:105](../../src/api/contract.ts#L105)

API の契約（エンドポイント定義の集合）。

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

Source: [src/api/schema.ts:28](../../src/api/schema.ts#L28)

リモコン全体の背景色の既定値（白）。 Builder で背景色を省略した場合、エディタでの新規作成時、読み込み中の表示に使用する。 保存済みファイルでは背景色が必須のため、読み込んだデータには適用しない。

<a id="default_background-signature"></a>

#### Signature

```typescript
DEFAULT_BACKGROUND = "#ffffff"
```

<a id="defaultcolormap-variable"></a>

### defaultColorMap

Source: [src/api/colors.ts:42](../../src/api/colors.ts#L42)

<a id="defaultcolormap-signature"></a>

#### Signature

```typescript
defaultColorMap: ColorMap
```

**Type**: [ColorMap](../rz-remocon-api/index.md#colormap-typealias)

<a id="defaultcolorresolver-variable"></a>

### defaultColorResolver

Source: [src/api/colors.ts:44](../../src/api/colors.ts#L44)

<a id="defaultcolorresolver-signature"></a>

#### Signature

```typescript
defaultColorResolver: ColorResolver
```

**Type**: [ColorResolver](../rz-remocon-api/index.md#colorresolver-typealias)

<a id="editorremoconconfigschema-variable"></a>

### editorRemoconConfigSchema

Source: [src/api/schema.ts:127](../../src/api/schema.ts#L127)

編集用のリモコン設定（remocon.editor.json）のスキーマ。正本として扱う。

編集内容をそのまま保存する（例: ラベルを隠していても、文字列は残す）。 表示用の remocon.json は、toRemoconConfig()（api/utils.ts）で導出する。

保存時の検証（check）は次の2つのみ。

- キー ID が重複していない。
- x + w が grid.columns を超えない（幅がはみ出さない）。

y / h の範囲と、キー同士の重なりは検証しない。

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

Source: [src/api/schema.ts:94](../../src/api/schema.ts#L94)

編集用のキー1個分（remocon.editor.json）のスキーマ。

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

Source: [src/api/key-defs.ts:158](../../src/api/key-defs.ts#L158)

どの接頭辞にも一致しないキー名に使う種類。

<a id="fallback_kind-signature"></a>

#### Signature

```typescript
FALLBACK_KIND: RemoteKeyKind
```

**Type**: [RemoteKeyKind](../rz-remocon-api/index.md#remotekeykind-typealias)

<a id="hexcolorschema-variable"></a>

### hexColorSchema

Source: [src/api/schema.ts:18](../../src/api/schema.ts#L18)

<a id="hexcolorschema-signature"></a>

#### Signature

```typescript
hexColorSchema: z.ZodString
```

<a id="keycodeschema-variable"></a>

### keyCodeSchema

Source: [src/api/schema.ts:34](../../src/api/schema.ts#L34)

キーコードのスキーマ

<a id="keycodeschema-signature"></a>

#### Signature

```typescript
keyCodeSchema: z.ZodString
```

<a id="label_key_name-variable"></a>

### LABEL_KEY_NAME

Source: [src/api/remote-keys.ts:23](../../src/api/remote-keys.ts#L23)

ラベル。描画側では、操作できない表示要素として扱う。

<a id="label_key_name-signature"></a>

#### Signature

```typescript
LABEL_KEY_NAME = "$_LABEL$"
```

<a id="remoconconfigschema-variable"></a>

### remoconConfigSchema

Source: [src/api/schema.ts:81](../../src/api/schema.ts#L81)

表示用のリモコン設定（remocon.json）のスキーマ。リモコン画面（/）が読み込んで描画する。

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

REGZA のリモコンキーの定義（キー名から code とラベルへの対応表）。

- 異なるキーが同じ code を持つ場合があるが、これは意図的な定義である。  例: keyLeft2 と mediaBack10s、keyRight2 と mediaSkip30s は code を共有する。
- code の重複は不具合ではないため、重複の検出や統合は行わない。

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
        readonly label: "放送切替";
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
        readonly label: "30sec送り";
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

Source: [src/api/key-defs.ts:140](../../src/api/key-defs.ts#L140)

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
    readonly label: "入力切替";
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

Source: [src/api/schema.ts:58](../../src/api/schema.ts#L58)

表示用のキー1個分（remocon.json）のスキーマ。 editorRemoteKeyConfigSchema から導出する（api/utils.ts の toRemoconConfig）。 編集用の id と showLabel は持たない。

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

Source: [src/api/remote-keys.ts:88](../../src/api/remote-keys.ts#L88)

操作キーの定義表を、name を含むキーオブジェクトの辞書に変換したもの。

- キー名から定義を参照しつつ、Builder にはキーオブジェクトを渡せるようにする。

<a id="remotekeys-signature"></a>

#### Signature

```typescript
RemoteKeys: Record<RemoteKeyName, RemoteKey>
```

**Type**: Record<[RemoteKeyName](../rz-remocon-api/index.md#remotekeyname-typealias), [RemoteKey](../rz-remocon-api/index.md#remotekey-interface)>

<a id="special_key_defs-variable"></a>

### SPECIAL_KEY_DEFS

Source: [src/api/remote-keys.ts:40](../../src/api/remote-keys.ts#L40)

特殊キー名の定義。

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

Source: [src/api/remote-keys.ts:20](../../src/api/remote-keys.ts#L20)

タブ。描画側では、この名前を全幅の見出しとして扱う。

<a id="tab_key_name-signature"></a>

#### Signature

```typescript
TAB_KEY_NAME = "$TAB$"
```
