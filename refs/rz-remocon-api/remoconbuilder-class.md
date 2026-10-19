[README](../../README.md) / [rz-remocon/api](../../rz-remocon-api/index.md) / RemoconBuilder

# RemoconBuilder

Source: [src/api/builder.ts:123](../../src/api/builder.ts#L123)

リモコン設定を組み立てる Builder。

キーを順番に追加し、グリッドへの自動配置や値の補完を行う。 build() は表示用、buildEditor() は編集用の設定を生成する。

<a id="remoconbuilder-signature"></a>

## Signature

```typescript
export declare class RemoconBuilder
```

## Constructors

| Constructor | Description |
| - | - |
| [(constructor)(options)](../rz-remocon-api/remoconbuilder-class.md#_constructor_-constructor) | Constructs a new instance of the `RemoconBuilder` class |

## Methods

| Method | Description |
| - | - |
| [add(remoteKey, overrides)](../rz-remocon-api/remoconbuilder-class.md#add-method) | 操作キーを追加する |
| [addCustom(name, code, overrides)](../rz-remocon-api/remoconbuilder-class.md#addcustom-method) | カタログにないキーを追加する |
| [build()](../rz-remocon-api/remoconbuilder-class.md#build-method) | 表示用の設定を生成する |
| [buildEditor()](../rz-remocon-api/remoconbuilder-class.md#buildeditor-method) | 編集用の設定を生成する |
| [label(text, overrides)](../rz-remocon-api/remoconbuilder-class.md#label-method) | 表示用ラベルを追加する |
| [newline(h)](../rz-remocon-api/remoconbuilder-class.md#newline-method) | 次の行の先頭へ移動する |
| [spacer(w)](../rz-remocon-api/remoconbuilder-class.md#spacer-method) | キーを配置せず、カーソルを右へ移動する |
| [tab(label, color)](../rz-remocon-api/remoconbuilder-class.md#tab-method) | タブを追加する |

## Constructor Details

<a id="_constructor_-constructor"></a>

### (constructor)

Constructs a new instance of the `RemoconBuilder` class

<a id="_constructor_-signature"></a>

#### Signature

```typescript
constructor(options: RemoconBuilderOptions);
```

<a id="_constructor_-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| options | |

## Method Details

<a id="add-method"></a>

### add

操作キーを追加する。

\= decorator 適用後に overrides を適用する。

- 未設定の color は背景色で補完する。
- x / y は自動配置するため、overrides では指定できない。
- 特殊キーは追加できない。

<a id="add-signature"></a>

#### Signature

```typescript
add(remoteKey: RemoteKey, ...overrides: RemoteKeyOverrides[]): this;
```

<a id="add-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| remoteKey | 追加する操作キー |
| overrides | キーの上書き指定 |

<a id="add-returns"></a>

#### Returns

**Return type**: this

<a id="addcustom-method"></a>

### addCustom

カタログにないキーを追加する。

- 既定では name をラベルに設定するが、ラベルは表示しない。
- 特殊キー名（`$` で始まる名前）は指定できない。

<a id="addcustom-signature"></a>

#### Signature

```typescript
addCustom(name: string, code: string, ...overrides: RemoteKeyOverrides[]): this;
```

<a id="addcustom-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| name | キー名 |
| code | キーコード |
| overrides | キーの上書き指定 |

<a id="addcustom-returns"></a>

#### Returns

**Return type**: this

<a id="build-method"></a>

### build

表示用の設定を生成する。

- showLabel が false のキーは label を undefined にする。

<a id="build-signature"></a>

#### Signature

```typescript
build(): RemoconConfig;
```

<a id="build-returns"></a>

#### Returns

**Return type**: [RemoconConfig](../rz-remocon-api/index.md#remoconconfig-typealias)

<a id="buildeditor-method"></a>

### buildEditor

編集用の設定を生成する。

- ラベル文字列を保持し、追加順に id を割り当てる。
- 特殊キーの code は undefined にする。

<a id="buildeditor-signature"></a>

#### Signature

```typescript
buildEditor(): EditorRemoconConfig;
```

<a id="buildeditor-returns"></a>

#### Returns

**Return type**: [EditorRemoconConfig](../rz-remocon-api/index.md#editorremoconconfig-typealias)

<a id="label-method"></a>

### label

表示用ラベルを追加する。

<a id="label-signature"></a>

#### Signature

```typescript
label(text: string, ...overrides: RemoteKeyOverrides[]): this;
```

<a id="label-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| text | 表示する文字列 |
| overrides | 幅・高さ・色などの上書き指定 |

<a id="label-returns"></a>

#### Returns

**Return type**: this

<a id="newline-method"></a>

### newline

次の行の先頭へ移動する。

- 移動量は h、現在の行の最大高さ、unit の順に決定する。

<a id="newline-signature"></a>

#### Signature

```typescript
newline(h?: number): this;
```

<a id="newline-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| h | Y 方向の移動量 |

<a id="newline-returns"></a>

#### Returns

**Return type**: this

<a id="spacer-method"></a>

### spacer

キーを配置せず、カーソルを右へ移動する。

<a id="spacer-signature"></a>

#### Signature

```typescript
spacer(w?: number): this;
```

<a id="spacer-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| w | 空ける幅（セル単位） |

<a id="spacer-returns"></a>

#### Returns

**Return type**: this

<a id="tab-method"></a>

### tab

タブを追加する。

- 最初のタブはキーを追加する前に呼び出す必要がある。
- 配置後は改行する。

<a id="tab-signature"></a>

#### Signature

```typescript
tab(label: string, color?: string): this;
```

<a id="tab-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| label | タブに表示する文字列 |
| color | 背景色 |

<a id="tab-returns"></a>

#### Returns

**Return type**: this
