[README](../../README.md) / rz-remocon/gen

# rz-remocon/gen

静的リモコンの生成と、その見た目（アイコン・色・キーの装飾）をカスタマイズする部品を提供する。

## Interfaces

| Interface | Description |
| - | - |
| [DefaultDecoratorOpts](../rz-remocon-gen/index.md#defaultdecoratoropts-interface) | 標準の `decorator`（[defaultDecorator(key, opts)](../rz-remocon-gen/index.md#defaultdecorator-function)）のオプション。 |
| [GenerateOpts](../rz-remocon-gen/index.md#generateopts-interface) | `generate()` のオプション。 |
| [GenerateTools](../rz-remocon-gen/index.md#generatetools-interface) | 生成時に使うアイコン・色・装飾のユーティリティ一式 |

## Types

| TypeAlias | Description |
| - | - |
| [IconComponent](../rz-remocon-gen/index.md#iconcomponent-typealias) | `style` を受け取る、素のアイコンコンポーネント。サイズは指定されていない。 |
| [IconSet](../rz-remocon-gen/index.md#iconset-typealias) | アイコンセット |
| [RemoteKeyIconRender](../rz-remocon-gen/index.md#remotekeyiconrender-typealias) | キーのアイコンを、必要に応じて描画する関数の型 |

## Functions

| Function | Description |
| - | - |
| [createGenerateTools(sets, colorResolver)](../rz-remocon-gen/index.md#creategeneratetools-function) | アイコンセットを結合し、[GenerateTools](../rz-remocon-gen/index.md#generatetools-interface) を生成する |
| [createGenerateToolsWithUrls(urls, colorResolver)](../rz-remocon-gen/index.md#creategeneratetoolswithurls-function) | アイコン URL 対応表を加えた [GenerateTools](../rz-remocon-gen/index.md#generatetools-interface) を生成する |
| [defaultDecorator(key, opts)](../rz-remocon-gen/index.md#defaultdecorator-function) | キーの既定値を決める、標準の <code>decorator</code> |
| [fromComponents(icons, size)](../rz-remocon-gen/index.md#fromcomponents-function) | コンポーネントの対応表から、アイコンセットを生成する |
| [fromUrls(urls)](../rz-remocon-gen/index.md#fromurls-function) | アイコン URL 対応表から、アイコンセットを生成する |
| [generate(opts)](../rz-remocon-gen/index.md#generate-function) | リモコン設定から、静的リモコン用 HTML を生成する |
| [loadColorMapFile(file, required)](../rz-remocon-gen/index.md#loadcolormapfile-function) | <code>color-map.json</code> を読み込み、色マップを返す |
| [loadIconUrlsFile(file, required)](../rz-remocon-gen/index.md#loadiconurlsfile-function) | ファイルを読み込み、アイコン URL 対応表を返す |

## Variables

| Variable | Description |
| - | - |
| [builtinIcons](../rz-remocon-gen/index.md#builtinicons-variable) | 標準のアイコン（`REMOTE_ICONS`）から生成したアイコンセット。 |
| [defaultIconRender](../rz-remocon-gen/index.md#defaulticonrender-variable) | アイコンを描画する標準の関数 |

## Interface Details

<a id="defaultdecoratoropts-interface"></a>

### DefaultDecoratorOpts

Source: [src/web/remoteKeys/types.ts:26](../../src/web/remoteKeys/types.ts#L26)

標準の `decorator`（[defaultDecorator(key, opts)](../rz-remocon-gen/index.md#defaultdecorator-function)）のオプション。

<a id="defaultdecoratoropts-signature"></a>

#### Signature

```typescript
export interface DefaultDecoratorOpts
```

#### Properties

| Property | Description |
| - | - |
| [keepLabel](../rz-remocon-gen/index.md#defaultdecoratoropts-keeplabel-propertysignature) | `true` の場合は、アイコンがあるキーでも、ラベルを隠さない。 |

#### Property Details

<a id="defaultdecoratoropts-keeplabel-propertysignature"></a>

##### keepLabel

`true` の場合は、アイコンがあるキーでも、ラベルを隠さない。

<a id="keeplabel-signature"></a>

###### Signature

```typescript
keepLabel?: boolean;
```

**Type**: boolean

<a id="generateopts-interface"></a>

### GenerateOpts

Source: [src/gen/generate.ts:21](../../src/gen/generate.ts#L21)

`generate()` のオプション。

<a id="generateopts-signature"></a>

#### Signature

```typescript
export interface GenerateOpts
```

#### Properties

| Property | Description |
| - | - |
| [iconRender](../rz-remocon-gen/index.md#generateopts-iconrender-propertysignature) | アイコンを描画する関数 |
| [outputDir](../rz-remocon-gen/index.md#generateopts-outputdir-propertysignature) | 生成した静的リモコンの出力先ディレクトリ |
| [remocon](../rz-remocon-gen/index.md#generateopts-remocon-propertysignature) | リモコン設定 |

#### Property Details

<a id="generateopts-iconrender-propertysignature"></a>

##### iconRender

アイコンを描画する関数。標準の描画関数として、[defaultIconRender](../rz-remocon-gen/index.md#defaulticonrender-variable) を使用可能。

<a id="iconrender-signature"></a>

###### Signature

```typescript
iconRender: RemoteKeyIconRender;
```

**Type**: [RemoteKeyIconRender](../rz-remocon-gen/index.md#remotekeyiconrender-typealias)

<a id="generateopts-outputdir-propertysignature"></a>

##### outputDir

生成した静的リモコンの出力先ディレクトリ。

<a id="outputdir-signature"></a>

###### Signature

```typescript
outputDir: string;
```

**Type**: string

<a id="generateopts-remocon-propertysignature"></a>

##### remocon

リモコン設定。

<a id="remocon-signature"></a>

###### Signature

```typescript
remocon: RemoconConfig;
```

**Type**: [RemoconConfig](../rz-remocon-api/index.md#remoconconfig-typealias)

<a id="generatetools-interface"></a>

### GenerateTools

Source: [src/web/remoteKeys/utils.ts:56](../../src/web/remoteKeys/utils.ts#L56)

生成時に使うアイコン・色・装飾のユーティリティ一式。

<a id="generatetools-signature"></a>

#### Signature

```typescript
export interface GenerateTools
```

#### Properties

| Property | Description |
| - | - |
| [colorResolver](../rz-remocon-gen/index.md#generatetools-colorresolver-propertysignature) | キー名から色を解決する関数 |
| [decorator](../rz-remocon-gen/index.md#generatetools-decorator-propertysignature) | `hasIcon` が `true` になるキー名を、`icon` に設定するなど、キーの既定値を決める関数。 |
| [hasIcon](../rz-remocon-gen/index.md#generatetools-hasicon-propertysignature) | 指定した名前のアイコンが存在するかを返す |
| [iconRender](../rz-remocon-gen/index.md#generatetools-iconrender-propertysignature) | アイコンを描画する関数 |

#### Property Details

<a id="generatetools-colorresolver-propertysignature"></a>

##### colorResolver

キー名から色を解決する関数。

<a id="colorresolver-signature"></a>

###### Signature

```typescript
colorResolver: ColorResolver;
```

**Type**: [ColorResolver](../rz-remocon-api/index.md#colorresolver-typealias)

<a id="generatetools-decorator-propertysignature"></a>

##### decorator

`hasIcon` が `true` になるキー名を、`icon` に設定するなど、キーの既定値を決める関数。

<a id="decorator-signature"></a>

###### Signature

```typescript
decorator: (key: RemoteKeyDraft, opts?: DefaultDecoratorOpts) => RemoteKeyDraft;
```

**Type**: (key: [RemoteKeyDraft](../rz-remocon-api/index.md#remotekeydraft-typealias), opts?: [DefaultDecoratorOpts](../rz-remocon-gen/index.md#defaultdecoratoropts-interface)) => [RemoteKeyDraft](../rz-remocon-api/index.md#remotekeydraft-typealias)

<a id="generatetools-hasicon-propertysignature"></a>

##### hasIcon

指定した名前のアイコンが存在するかを返す。

<a id="hasicon-signature"></a>

###### Signature

```typescript
hasIcon: (name: string) => boolean;
```

**Type**: (name: string) => boolean

<a id="generatetools-iconrender-propertysignature"></a>

##### iconRender

アイコンを描画する関数。アイコンセットにない文字列は、画像 URL として描画する。

<a id="iconrender-signature"></a>

###### Signature

```typescript
iconRender: RemoteKeyIconRender;
```

**Type**: [RemoteKeyIconRender](../rz-remocon-gen/index.md#remotekeyiconrender-typealias)

## Type Details

<a id="iconcomponent-typealias"></a>

### IconComponent

Source: [src/web/remoteKeys/types.ts:16](../../src/web/remoteKeys/types.ts#L16)

`style` を受け取る、素のアイコンコンポーネント。サイズは指定されていない。

<a id="iconcomponent-signature"></a>

#### Signature

```typescript
export type IconComponent = ComponentType<{
    style?: CSSProperties;
}>;
```

<a id="iconset-typealias"></a>

### IconSet

Source: [src/web/remoteKeys/types.ts:23](../../src/web/remoteKeys/types.ts#L23)

アイコンセット。アイコン名ごとの描画関数をまとめたもの。

アイコンのライブラリが異なる場合も、[fromComponents(icons, size)](../rz-remocon-gen/index.md#fromcomponents-function) などで、この形式に統一する。

<a id="iconset-signature"></a>

#### Signature

```typescript
export type IconSet = Record<string, RemoteKeyIconRender>;
```

<a id="remotekeyiconrender-typealias"></a>

### RemoteKeyIconRender

Source: [src/web/remoteKeys/types.ts:13](../../src/web/remoteKeys/types.ts#L13)

キーのアイコンを、必要に応じて描画する関数の型。

- `key.icon` は、アイコン名または画像 URL（省略可能）。

<a id="remotekeyiconrender-signature"></a>

#### Signature

```typescript
export type RemoteKeyIconRender = (key: RemoteKeyConfig) => ReactNode;
```

## Function Details

<a id="creategeneratetools-function"></a>

### createGenerateTools

Source: [src/web/remoteKeys/utils.ts:78](../../src/web/remoteKeys/utils.ts#L78)

アイコンセットを結合し、[GenerateTools](../rz-remocon-gen/index.md#generatetools-interface) を生成する。

- 同じ名前がある場合は、`sets` の後ろにあるものを優先する（上書きする）。

<a id="creategeneratetools-signature"></a>

#### Signature

```typescript
export declare function createGenerateTools(sets: IconSet[], colorResolver?: ColorResolver | undefined): GenerateTools;
```

<a id="creategeneratetools-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| sets | 結合するアイコンセット |
| colorResolver | キー名から色を解決する関数 |

<a id="creategeneratetools-returns"></a>

#### Returns

**Return type**: [GenerateTools](../rz-remocon-gen/index.md#generatetools-interface)

<a id="creategeneratetoolswithurls-function"></a>

### createGenerateToolsWithUrls

Source: [src/web/remoteKeys/utils.ts:102](../../src/web/remoteKeys/utils.ts#L102)

アイコン URL 対応表を加えた [GenerateTools](../rz-remocon-gen/index.md#generatetools-interface) を生成する。

- 標準のアイコン（[builtinIcons](../rz-remocon-gen/index.md#builtinicons-variable)）に、アイコン URL 対応表（`icon-urls.json`）を加える。
- 同じ名前はアイコン URL 対応表を優先するので、標準のアイコンを差し替えられる。
- `createGenerateTools([builtinIcons, fromUrls(urls)], colorResolver)` と同じ。

<a id="creategeneratetoolswithurls-signature"></a>

#### Signature

```typescript
export declare function createGenerateToolsWithUrls(urls: Record<string, string>, colorResolver?: ColorResolver): GenerateTools;
```

<a id="creategeneratetoolswithurls-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| urls | アイコン URL 対応表 |
| colorResolver | キー名から色を解決する関数 |

<a id="creategeneratetoolswithurls-returns"></a>

#### Returns

**Return type**: [GenerateTools](../rz-remocon-gen/index.md#generatetools-interface)

<a id="defaultdecorator-function"></a>

### defaultDecorator

Source: [src/web/remoteKeys/utils.ts:131](../../src/web/remoteKeys/utils.ts#L131)

キーの既定値を決める、標準の `decorator`。

- `icon`: 未指定の場合は、アイコンがあるキーに限り、キー名をそのまま設定する。
- `showLabel`: アイコンがあるキーは `false` にして、アイコンだけで表示する（`keepLabel` が指定された場合は変更しない）。
- `color`: 未指定の場合は、キーの種類ごとの色を設定する。

<a id="defaultdecorator-signature"></a>

#### Signature

```typescript
defaultDecorator: (key: RemoteKeyDraft, opts?: DefaultDecoratorOpts) => RemoteKeyDraft
```

<a id="defaultdecorator-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| key | 既定値を適用するリモコンキー |
| opts | 既定の適用方法を調整するオプション |

<a id="defaultdecorator-returns"></a>

#### Returns

**Return type**: [RemoteKeyDraft](../rz-remocon-api/index.md#remotekeydraft-typealias)

<a id="fromcomponents-function"></a>

### fromComponents

Source: [src/web/remoteKeys/utils.ts:25](../../src/web/remoteKeys/utils.ts#L25)

コンポーネントの対応表から、アイコンセットを生成する。

- 対象は、`style` を受け取るコンポーネント（Remixicon など）。
- 値が `undefined` の項目は除外する。

<a id="fromcomponents-signature"></a>

#### Signature

```typescript
export declare function fromComponents(icons: Partial<Record<string, IconComponent>>, size?: string): IconSet;
```

<a id="fromcomponents-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| icons | アイコン名からコンポーネントへの対応表 |
| size | アイコンの幅と高さ |

<a id="fromcomponents-returns"></a>

#### Returns

**Return type**: [IconSet](../rz-remocon-gen/index.md#iconset-typealias)

<a id="fromurls-function"></a>

### fromUrls

Source: [src/web/remoteKeys/utils.ts:44](../../src/web/remoteKeys/utils.ts#L44)

アイコン URL 対応表から、アイコンセットを生成する。画像に名前を付けて登録する場合に使用する。

<a id="fromurls-signature"></a>

#### Signature

```typescript
export declare function fromUrls(urls: Record<string, string>): IconSet;
```

<a id="fromurls-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| urls | アイコン URL 対応表 |

<a id="fromurls-returns"></a>

#### Returns

**Return type**: [IconSet](../rz-remocon-gen/index.md#iconset-typealias)

<a id="generate-function"></a>

### generate

Source: [src/gen/generate.ts:41](../../src/gen/generate.ts#L41)

リモコン設定から、静的リモコン用 HTML を生成する。

- [remoconBuilder(options)](../rz-remocon-api/index.md#remoconbuilder-function) で作成したリモコン設定を利用可能。

<a id="generate-signature"></a>

#### Signature

```typescript
export declare function generate(opts: GenerateOpts): Promise<void>;
```

<a id="generate-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| opts | 生成オプション |

<a id="generate-returns"></a>

#### Returns

**Return type**: Promise\<void>

<a id="loadcolormapfile-function"></a>

### loadColorMapFile

Source: [src/gen/load.ts:101](../../src/gen/load.ts#L101)

`color-map.json` を読み込み、色マップを返す。

- 既定の色に上書きする分だけを書く。
- [mergeColorMap(overrides)](../rz-remocon-api/index.md#mergecolormap-function) に渡すと、既定の色に重ねられる。
- `required` が `false` の場合、ファイルが存在しなければ空の色マップを返す。
- `required` が `true` の場合、ファイルが存在しなければエラーを投げる。
- `required` の値にかかわらず、ファイルの読み込みまたは JSON の解析に失敗した場合はエラーを投げる。
- 不正な項目がある場合は、警告を出して不正な項目だけを除外し、正常な項目を返す。

<a id="loadcolormapfile-signature"></a>

#### Signature

```typescript
export declare function loadColorMapFile(file: string, required: boolean): Record<string, string>;
```

<a id="loadcolormapfile-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| file | `color-map.json` のパス。 |
| required | ファイルの存在を必須とするか |

<a id="loadcolormapfile-returns"></a>

#### Returns

**Return type**: Record\<string, string>

<a id="loadiconurlsfile-function"></a>

### loadIconUrlsFile

Source: [src/gen/load.ts:75](../../src/gen/load.ts#L75)

ファイルを読み込み、アイコン URL 対応表を返す。

- `required` が `false` の場合、ファイルが存在しなければ空のアイコン URL 対応表を返す。
- `required` が `true` の場合、ファイルが存在しなければエラーを投げる。
- `required` の値にかかわらず、ファイルの読み込みまたは JSON の解析に失敗した場合はエラーを投げる。
- 不正な項目がある場合は、警告を出して不正な項目だけを除外し、正常な項目を返す。

<a id="loadiconurlsfile-signature"></a>

#### Signature

```typescript
export declare function loadIconUrlsFile(file: string, required: boolean): IconUrls;
```

<a id="loadiconurlsfile-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| file | `icon-urls.json` のパス。 |
| required | ファイルの存在を必須とするか |

<a id="loadiconurlsfile-returns"></a>

#### Returns

**Return type**: [IconUrls](../rz-remocon-api/index.md#iconurls-typealias)

## Variable Details

<a id="builtinicons-variable"></a>

### builtinIcons

Source: [src/web/remoteKeys/utils.ts:51](../../src/web/remoteKeys/utils.ts#L51)

標準のアイコン（`REMOTE_ICONS`）から生成したアイコンセット。

<a id="builtinicons-signature"></a>

#### Signature

```typescript
builtinIcons: IconSet
```

**Type**: [IconSet](../rz-remocon-gen/index.md#iconset-typealias)

<a id="defaulticonrender-variable"></a>

### defaultIconRender

Source: [src/web/remoteKeys/utils.ts:118](../../src/web/remoteKeys/utils.ts#L118)

アイコンを描画する標準の関数。

- `icon` がない場合: 何も描画しない（`icon` の省略は「アイコンなし」を意味する。エディタも同じ）。
- 標準のアイコンセット（[builtinIcons](../rz-remocon-gen/index.md#builtinicons-variable)）にある名前の場合: 標準のアイコンを描画する。
- アイコンセットにない文字列の場合: 画像 URL として `<img>` で描画する。

<a id="defaulticonrender-signature"></a>

#### Signature

```typescript
defaultIconRender: RemoteKeyIconRender
```

**Type**: [RemoteKeyIconRender](../rz-remocon-gen/index.md#remotekeyiconrender-typealias)
