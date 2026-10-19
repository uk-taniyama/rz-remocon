[README](../../README.md) / rz-remocon/gen

# rz-remocon/gen

## Interfaces

| Interface | Description |
| - | - |
| [DefaultDecoratorOpts](../rz-remocon-gen/index.md#defaultdecoratoropts-interface) | 標準の decorator のオプション |
| [GenerateFromFileOpts](../rz-remocon-gen/index.md#generatefromfileopts-interface) | generateFromFile() のオプション |
| [GenerateOpts](../rz-remocon-gen/index.md#generateopts-interface) | generate() のオプション |
| [GenerateTools](../rz-remocon-gen/index.md#generatetools-interface) | |

## Types

| TypeAlias | Description |
| - | - |
| [IconComponent](../rz-remocon-gen/index.md#iconcomponent-typealias) | style を受け取る、素のアイコンコンポーネント |
| [IconSet](../rz-remocon-gen/index.md#iconset-typealias) | アイコンセット |
| [OnChangeCode](../rz-remocon-gen/index.md#onchangecode-typealias) | キーコードが指定されたときに呼び出されるコールバック |
| [RemoteKeyIconRender](../rz-remocon-gen/index.md#remotekeyiconrender-typealias) | キーのアイコンを描画する関数 |

## Functions

| Function | Description |
| - | - |
| [createGenerateTools(sets, colorResolver)](../rz-remocon-gen/index.md#creategeneratetools-function) | アイコンセットを結合し、hasIcon、decorator、iconRender を生成する |
| [createGenerateToolsWithUrls(urls, colorResolver)](../rz-remocon-gen/index.md#creategeneratetoolswithurls-function) | アイコン対応表を加えた GenerateTools を作成する |
| [defaultDecorator(key, opts)](../rz-remocon-gen/index.md#defaultdecorator-function) | キーの既定値を決める、標準の decorator |
| [fromComponents(icons, size)](../rz-remocon-gen/index.md#fromcomponents-function) | コンポーネントの対応表から、アイコンセットを生成する |
| [fromUrls(urls)](../rz-remocon-gen/index.md#fromurls-function) | 画像 URL の対応表から、アイコンセットを生成する |
| [generate(input)](../rz-remocon-gen/index.md#generate-function) | Builder の build() が返したリモコン設定から、静的リモコンを生成する |
| [loadColorMapFile(file, required)](../rz-remocon-gen/index.md#loadcolormapfile-function) | <code>color-map.json</code> を読み込み、キー名・kind から色への対応表を返す |
| [loadIconUrlsFile(file, required)](../rz-remocon-gen/index.md#loadiconurlsfile-function) | <code>icon-urls.json</code> を読み込み、アイコン名と画像 URL の対応表を返す |

## Variables

| Variable | Description |
| - | - |
| [builtinIcons](../rz-remocon-gen/index.md#builtinicons-variable) | 標準のアイコン（REMOTE_ICONS）から生成した、アイコンセット |
| [defaultIconRender](../rz-remocon-gen/index.md#defaulticonrender-variable) | アイコンを描画する標準の関数 |

## Interface Details

<a id="defaultdecoratoropts-interface"></a>

### DefaultDecoratorOpts

Source: [src/web/remoteKeys/types.ts:27](../../src/web/remoteKeys/types.ts#L27)

標準の decorator のオプション。

<a id="defaultdecoratoropts-signature"></a>

#### Signature

```typescript
export interface DefaultDecoratorOpts
```

#### Properties

| Property | Description |
| - | - |
| [keepLabel](../rz-remocon-gen/index.md#defaultdecoratoropts-keeplabel-propertysignature) | true の場合は、アイコンがあるキーでも、ラベルを隠さない |

#### Property Details

<a id="defaultdecoratoropts-keeplabel-propertysignature"></a>

##### keepLabel

true の場合は、アイコンがあるキーでも、ラベルを隠さない。

<a id="keeplabel-signature"></a>

###### Signature

```typescript
keepLabel?: boolean;
```

**Type**: boolean

<a id="generatefromfileopts-interface"></a>

### GenerateFromFileOpts

Source: [src/gen/types.ts:4](../../src/gen/types.ts#L4)

generateFromFile() のオプション。

<a id="generatefromfileopts-signature"></a>

#### Signature

```typescript
export interface GenerateFromFileOpts
```

#### Properties

| Property | Description |
| - | - |
| [iconUrls](../rz-remocon-gen/index.md#generatefromfileopts-iconurls-propertysignature) | アイコン名と画像 URL の対応表（icon-urls.json）のパス |
| [inputJson](../rz-remocon-gen/index.md#generatefromfileopts-inputjson-propertysignature) | 入力する remocon.json のパス |
| [outputDir](../rz-remocon-gen/index.md#generatefromfileopts-outputdir-propertysignature) | 出力先のディレクトリ |

#### Property Details

<a id="generatefromfileopts-iconurls-propertysignature"></a>

##### iconUrls

アイコン名と画像 URL の対応表（icon-urls.json）のパス。 省略した場合は、入力の remocon.json と同じディレクトリの icon-urls.json を使用する（存在しなければ空の対応表）。 指定したファイルが見つからない場合は、エラーにする。

<a id="iconurls-signature"></a>

###### Signature

```typescript
iconUrls?: string;
```

**Type**: string

<a id="generatefromfileopts-inputjson-propertysignature"></a>

##### inputJson

入力する remocon.json のパス。

<a id="inputjson-signature"></a>

###### Signature

```typescript
inputJson: string;
```

**Type**: string

<a id="generatefromfileopts-outputdir-propertysignature"></a>

##### outputDir

出力先のディレクトリ。index.html と assets/ を出力する。

<a id="outputdir-signature"></a>

###### Signature

```typescript
outputDir: string;
```

**Type**: string

<a id="generateopts-interface"></a>

### GenerateOpts

Source: [src/gen/generate.ts:21](../../src/gen/generate.ts#L21)

generate() のオプション。

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
| [remocon](../rz-remocon-gen/index.md#generateopts-remocon-propertysignature) | Builder の build() が返したリモコン設定 |

#### Property Details

<a id="generateopts-iconrender-propertysignature"></a>

##### iconRender

アイコンを描画する関数。 key.icon には、アイコン名または画像 URL が渡される。 標準の描画関数として、defaultIconRender を使用できる。

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

Builder の build() が返したリモコン設定。

<a id="remocon-signature"></a>

###### Signature

```typescript
remocon: RemoconConfig;
```

**Type**: [RemoconConfig](../rz-remocon-api/index.md#remoconconfig-typealias)

<a id="generatetools-interface"></a>

### GenerateTools

Source: [src/web/remoteKeys/utils.ts:51](../../src/web/remoteKeys/utils.ts#L51)

<a id="generatetools-signature"></a>

#### Signature

```typescript
export interface GenerateTools
```

#### Properties

| Property | Description |
| - | - |
| [colorResolver](../rz-remocon-gen/index.md#generatetools-colorresolver-propertysignature) | |
| [decorator](../rz-remocon-gen/index.md#generatetools-decorator-propertysignature) | |
| [hasIcon](../rz-remocon-gen/index.md#generatetools-hasicon-propertysignature) | |
| [iconRender](../rz-remocon-gen/index.md#generatetools-iconrender-propertysignature) | |

#### Property Details

<a id="generatetools-colorresolver-propertysignature"></a>

##### colorResolver

<a id="colorresolver-signature"></a>

###### Signature

```typescript
colorResolver: ColorResolver;
```

**Type**: [ColorResolver](../rz-remocon-api/index.md#colorresolver-typealias)

<a id="generatetools-decorator-propertysignature"></a>

##### decorator

<a id="decorator-signature"></a>

###### Signature

```typescript
decorator: (key: RemoteKeyDraft, opts?: DefaultDecoratorOpts) => RemoteKeyDraft;
```

**Type**: (key: [RemoteKeyDraft](../rz-remocon-api/index.md#remotekeydraft-typealias), opts?: [DefaultDecoratorOpts](../rz-remocon-gen/index.md#defaultdecoratoropts-interface)) => [RemoteKeyDraft](../rz-remocon-api/index.md#remotekeydraft-typealias)

<a id="generatetools-hasicon-propertysignature"></a>

##### hasIcon

<a id="hasicon-signature"></a>

###### Signature

```typescript
hasIcon: (name: string) => boolean;
```

**Type**: (name: string) => boolean

<a id="generatetools-iconrender-propertysignature"></a>

##### iconRender

<a id="iconrender-signature"></a>

###### Signature

```typescript
iconRender: RemoteKeyIconRender;
```

**Type**: [RemoteKeyIconRender](../rz-remocon-gen/index.md#remotekeyiconrender-typealias)

## Type Details

<a id="iconcomponent-typealias"></a>

### IconComponent

Source: [src/web/remoteKeys/types.ts:18](../../src/web/remoteKeys/types.ts#L18)

style を受け取る、素のアイコンコンポーネント。サイズは指定されていない。

<a id="iconcomponent-signature"></a>

#### Signature

```typescript
export type IconComponent = ComponentType<{
    style?: CSSProperties;
}>;
```

<a id="iconset-typealias"></a>

### IconSet

Source: [src/web/remoteKeys/types.ts:24](../../src/web/remoteKeys/types.ts#L24)

アイコンセット。アイコン名から描画関数を引く対応表。 アイコンのライブラリが異なる場合も、fromComponents などで、この形式に統一する。

<a id="iconset-signature"></a>

#### Signature

```typescript
export type IconSet = Record<string, RemoteKeyIconRender>;
```

<a id="onchangecode-typealias"></a>

### OnChangeCode

Source: [src/web/remoteKeys/types.ts:9](../../src/web/remoteKeys/types.ts#L9)

キーコードが指定されたときに呼び出されるコールバック。

<a id="onchangecode-signature"></a>

#### Signature

```typescript
export type OnChangeCode = (value: string) => void;
```

<a id="remotekeyiconrender-typealias"></a>

### RemoteKeyIconRender

Source: [src/web/remoteKeys/types.ts:15](../../src/web/remoteKeys/types.ts#L15)

キーのアイコンを描画する関数。key.icon には、アイコン名または画像 URL の文字列が入る。 要素を返した場合はそれを表示し、null または undefined を返した場合は何も描画しない。

<a id="remotekeyiconrender-signature"></a>

#### Signature

```typescript
export type RemoteKeyIconRender = (key: RemoteKeyConfig) => ReactNode;
```

## Function Details

<a id="creategeneratetools-function"></a>

### createGenerateTools

Source: [src/web/remoteKeys/utils.ts:70](../../src/web/remoteKeys/utils.ts#L70)

アイコンセットを結合し、hasIcon、decorator、iconRender を生成する。 同じ名前がある場合は、sets の後ろにあるものを優先する（上書きする）。

- hasIcon: 結合した対応表に、指定した名前が存在するかを返す。
- decorator: hasIcon が true になるキー名を、icon に設定する。
- iconRender: 対応表にある名前は、その描画関数で描画する。対応表にない文字列は、画像 URL として描画する。

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
| colorResolver | |

<a id="creategeneratetools-returns"></a>

#### Returns

**Return type**: [GenerateTools](../rz-remocon-gen/index.md#generatetools-interface)

<a id="creategeneratetoolswithurls-function"></a>

### createGenerateToolsWithUrls

Source: [src/web/remoteKeys/utils.ts:93](../../src/web/remoteKeys/utils.ts#L93)

アイコン対応表を加えた GenerateTools を作成する。

- 標準のアイコン（builtinIcons）に、icon-urls.json の対応表を加える。
- 同じ名前は対応表を優先するので、標準のアイコンを差し替えられる。
- createGenerateTools(builtinIcons, fromUrls(urls)) と同じ。

<a id="creategeneratetoolswithurls-signature"></a>

#### Signature

```typescript
export declare function createGenerateToolsWithUrls(urls: Record<string, string>, colorResolver?: ColorResolver): GenerateTools;
```

<a id="creategeneratetoolswithurls-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| urls | アイコン名から画像 URL への対応表 |
| colorResolver | |

<a id="creategeneratetoolswithurls-returns"></a>

#### Returns

**Return type**: [GenerateTools](../rz-remocon-gen/index.md#generatetools-interface)

<a id="defaultdecorator-function"></a>

### defaultDecorator

Source: [src/web/remoteKeys/utils.ts:120](../../src/web/remoteKeys/utils.ts#L120)

キーの既定値を決める、標準の decorator。

- icon: 未指定の場合は、アイコンがあるキーに限り、キー名をそのまま設定する。
- showLabel: アイコンがあるキーは false にして、アイコンだけで表示する（keepLabel が指定された場合は変更しない）。
- color: 未指定の場合は、キーの種類ごとの色を設定する。

<a id="defaultdecorator-signature"></a>

#### Signature

```typescript
defaultDecorator: (key: RemoteKeyDraft, opts?: DefaultDecoratorOpts) => RemoteKeyDraft
```

<a id="defaultdecorator-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| key | |
| opts | |

<a id="defaultdecorator-returns"></a>

#### Returns

**Return type**: [RemoteKeyDraft](../rz-remocon-api/index.md#remotekeydraft-typealias)

<a id="fromcomponents-function"></a>

### fromComponents

Source: [src/web/remoteKeys/utils.ts:23](../../src/web/remoteKeys/utils.ts#L23)

コンポーネントの対応表から、アイコンセットを生成する。 対象は、style を受け取るコンポーネント（Remixicon など）。値が undefined の項目は除外する。

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

Source: [src/web/remoteKeys/utils.ts:42](../../src/web/remoteKeys/utils.ts#L42)

画像 URL の対応表から、アイコンセットを生成する。画像に名前を付けて登録する場合に使用する。

<a id="fromurls-signature"></a>

#### Signature

```typescript
export declare function fromUrls(urls: Record<string, string>): IconSet;
```

<a id="fromurls-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| urls | アイコン名から画像 URL への対応表 |

<a id="fromurls-returns"></a>

#### Returns

**Return type**: [IconSet](../rz-remocon-gen/index.md#iconset-typealias)

<a id="generate-function"></a>

### generate

Source: [src/gen/generate.ts:40](../../src/gen/generate.ts#L40)

Builder の build() が返したリモコン設定から、静的リモコンを生成する。 出力先に、index.html、CSS、remote.js、favicon.svg を出力する。

<a id="generate-signature"></a>

#### Signature

```typescript
export declare function generate(input: GenerateOpts): Promise<void>;
```

<a id="generate-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| input | |

<a id="generate-returns"></a>

#### Returns

**Return type**: Promise\<void>

<a id="loadcolormapfile-function"></a>

### loadColorMapFile

Source: [src/gen/load.ts:100](../../src/gen/load.ts#L100)

`color-map.json` を読み込み、キー名・kind から色への対応表を返す。 標準の色に上書きする分だけを書く。mergeColorMap() に渡すと、標準の色に重ねられる。

- required が false の場合、ファイルが存在しなければ空の対応表を返す。
- required が true の場合、ファイルが存在しなければ例外を投げる。
- required の値にかかわらず、ファイルの読み込みまたは JSON の解析に失敗した場合は例外を投げる。
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
| file | color-map.json のパス |
| required | ファイルの存在を必須とするか |

<a id="loadcolormapfile-returns"></a>

#### Returns

**Return type**: Record\<string, string>

<a id="loadiconurlsfile-function"></a>

### loadIconUrlsFile

Source: [src/gen/load.ts:75](../../src/gen/load.ts#L75)

`icon-urls.json` を読み込み、アイコン名と画像 URL の対応表を返す。

- required が false の場合、ファイルが存在しなければ空の対応表を返す。
- required が true の場合、ファイルが存在しなければ例外を投げる。
- required の値にかかわらず、ファイルの読み込みまたは JSON の解析に失敗した場合は例外を投げる。
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
| file | icon-urls.json のパス |
| required | ファイルの存在を必須とするか |

<a id="loadiconurlsfile-returns"></a>

#### Returns

**Return type**: [IconUrls](../rz-remocon-api/index.md#iconurls-typealias)

## Variable Details

<a id="builtinicons-variable"></a>

### builtinIcons

Source: [src/web/remoteKeys/utils.ts:49](../../src/web/remoteKeys/utils.ts#L49)

標準のアイコン（REMOTE_ICONS）から生成した、アイコンセット。

<a id="builtinicons-signature"></a>

#### Signature

```typescript
builtinIcons: IconSet
```

**Type**: [IconSet](../rz-remocon-gen/index.md#iconset-typealias)

<a id="defaulticonrender-variable"></a>

### defaultIconRender

Source: [src/web/remoteKeys/utils.ts:110](../../src/web/remoteKeys/utils.ts#L110)

アイコンを描画する標準の関数。

- key.icon には、アイコン名または画像 URL の文字列が入る。
- icon がない場合: 何も描画しない（icon の省略は「アイコンなし」を意味する。エディタも同じ）。
- 標準の対応表にある名前の場合: 標準のアイコンを描画する。
- 対応表にない文字列の場合: 画像 URL として `<img>` で描画する。

<a id="defaulticonrender-signature"></a>

#### Signature

```typescript
defaultIconRender: RemoteKeyIconRender
```

**Type**: [RemoteKeyIconRender](../rz-remocon-gen/index.md#remotekeyiconrender-typealias)
