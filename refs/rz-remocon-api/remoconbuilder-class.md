[README](../../README.md) / [rz-remocon/api](../rz-remocon-api/index.md) / RemoconBuilder

# RemoconBuilder

Source: [src/api/builder.ts:150](../../src/api/builder.ts#L150)

リモコン設定を組み立てる Builder。

- キーを順番に追加し、グリッドへの自動配置や値の補完を行う。
- 座標とサイズは、すべてセル単位で指定する。
- 1 セルは、文字 1 つ分の大きさを想定する。
- `unit` は 1 キー分のセル数で、既定値は 4。
- 1 キーに 4 文字ほど書ける大きさになる。
- キーの半分（2 セル）や 1/4（1 セル）の単位で指定可能となり、柔軟にレイアウトできる。
- 1 キーの標準サイズは `unit` × `unit` セル。
- `columns` はグリッドの幅（セル数）。`unit` の倍数にすると、キーが隙間なく並ぶ。
- `build()` は表示用、`buildEditor()` は編集用の設定を生成する。

<a id="remoconbuilder-signature"></a>

## Signature

```typescript
export declare class RemoconBuilder
```

<a id="remoconbuilder-remarks"></a>

## Remarks

[remoconBuilder(options)](../rz-remocon-api/index.md#remoconbuilder-function) で生成すること。

## Methods

| Method | Description |
| - | - |
| [add(remoteKey, overrides)](../rz-remocon-api/remoconbuilder-class.md#add-method) | 操作キーを追加する |
| [addCustom(name, code, overrides)](../rz-remocon-api/remoconbuilder-class.md#addcustom-method) | カスタム操作キーを追加する |
| [build()](../rz-remocon-api/remoconbuilder-class.md#build-method) | 表示用の設定を生成する |
| [buildEditor()](../rz-remocon-api/remoconbuilder-class.md#buildeditor-method) | 編集用の設定を生成する |
| [label(text, overrides)](../rz-remocon-api/remoconbuilder-class.md#label-method) | 表示用ラベルを追加する |
| [newline(h)](../rz-remocon-api/remoconbuilder-class.md#newline-method) | 次の行の先頭へ移動する |
| [spacer(w)](../rz-remocon-api/remoconbuilder-class.md#spacer-method) | カーソルを右へ移動する |
| [tab(label, color)](../rz-remocon-api/remoconbuilder-class.md#tab-method) | タブを追加する |

## Method Details

<a id="add-method"></a>

### add

操作キーを追加する。

- `remoteKey` は [RemoteKeys](../rz-remocon-api/index.md#remotekeys-variable) の値（例：`RemoteKeys.powerOn`）を指定可能。
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

カスタム操作キーを追加する。

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

<a id="newline-signature"></a>

#### Signature

```typescript
newline(h?: number): this;
```

<a id="newline-parameters"></a>

#### Parameters

| Parameter | Description |
| - | - |
| h | Y 方向の移動量（セル単位） |

<a id="newline-returns"></a>

#### Returns

**Return type**: this

<a id="spacer-method"></a>

### spacer

カーソルを右へ移動する。

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

- 他のキーを追加する前（最初）に呼び出す必要がある。
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
