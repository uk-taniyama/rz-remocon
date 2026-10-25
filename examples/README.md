# Examples

## 生成した静的リモコンを配信する

リポジトリで生成した静的リモコンが正しく動作することを確認する手順です。
`examples/` からCLIを使い、REGZAとの接続設定、リモコン定義の編集、静的ファイルの生成・配信を行います。

```bash
# 1. リポジトリルートでビルド
npm run build
```

```bash
# 2. examples/ に移動して依存関係をインストール
cd examples
npm install
```

接続設定の `examples/regza.json` は、既存の設定をコピーするか、以下の手順で作成してください。
このファイルには認証情報が含まれるため、ファイル自体は共有・コミットしないでください。

```bash
# 3. REGZAとの接続を設定
npx rz-remocon setup <REGZAのIPアドレス>
npx rz-remocon confirm <REGZAに表示された4桁のPIN>

# 4. 編集用サーバーを起動
npx rz-remocon server -p 8485
```

`-d` を省略すると、ビルドで作られた `dist/public`（標準のリモコン画面とエディタ）を配信します。

ブラウザで <http://localhost:8485/editor.html> を開き、リモコンを編集して保存します。
保存すると `examples/data/remocon.json` が作成されます。
編集が終わったら、サーバーを停止してください。

```bash
# 5. examples/ で静的ファイルを生成
npx rz-remocon generate -i data/remocon.json -o output

# 6. 生成した静的リモコンを配信
npx rz-remocon server -p 8485 -d output
```

<http://localhost:8485/> を開くと、生成した静的リモコンを操作できます。静的ファイルとAPIは同じサーバーから配信されるため、別途プロキシ設定は不要です。

`npm run server` は、手順6と同じです（`-p 8485 -d output`）。

## Builder でリモコンを作って静的ファイルを生成する

エディタを使わず、コード（`builder.ts`）でリモコンを定義して、静的ファイルを生成します。
手順1と2（ビルドと `npm install`）は、上と同じです。

```bash
# examples/ で実行（output/ に生成される）
npm run builder

# 生成した静的リモコンを配信
npx rz-remocon server -p 8485 -d output
```

`builder.ts` は、次の流れです。

1. `remoconBuilder` でキーを並べる（座標と寸法はセル。1キー = 4セル）。
2. `build()` の結果に `version` を付けて、`output/remocon.json` に書き出す。
3. `generate()`（`rz-remocon/gen`）で `index.html` と `assets/` を作る。

標準にないアイコンは、画像のURLを `icon` に指定します。名前で登録したいときや、別のアイコンセットを使うときは、`createGenerateTools([builtinIcons, fromUrls({...}), fromComponents({...})])` で `decorator` と `iconRender` を組で作り、`remoconBuilder` と `generate()` に渡します（アイコンセットは配列で渡します）。

## タブで切り替えるリモコン

`tab()` と `label()` を使うと、タブで切り替えるリモコンを組み立てられます（`builder-tabs.ts`）。
最初のタブは、キーを置く前に置きます。次のタブまでが、そのタブのキーです。

```bash
# examples/ で実行（output/tabs/ に生成される）
npm run builder:tabs

# 生成した静的リモコンを配信
npx rz-remocon server -p 8485 -d output/tabs
```

## アイコンを足す

`builder-icons.ts` は、自作の React アイコン（`fromComponents`）と、画像 URL のアイコン（`fromUrls`）を、標準のアイコンに足します。
React が要るので、`examples/` で `npm install` を済ませてください。

```bash
# examples/ で実行（output/icons/ に生成される）
npm run builder:icons

npx rz-remocon server -p 8485 -d output/icons
```

## Builder で作ったリモコンを、エディタで編集する

`builder-editor.ts` は、Builder の結果を、エディタで編集できる形で `data/` に保存します。

- `build()`: 表示用の設定。`version` を付けて `data/remocon.json` に保存する。
- `buildEditor()`: 編集用の設定。`data/remocon.editor.json` に保存する。
- アイコンを付けたキーは、`build()` ではラベルが省かれ、`buildEditor()` ではラベルの文字列が残る。`label` を指定すると、その文字列を表示する。

```bash
# examples/ で実行（data/ に生成される）
npm run builder:editor

# 編集用サーバーを起動して、http://localhost:8485/editor.html を開く
npx rz-remocon server -p 8485
```

## アイコン名と画像 URL の表を使う

`builder-icon-urls.ts` は、`icon-urls.json`（アイコン名と画像URLの表）を `loadIconUrlsFile()` で読み、標準のアイコンに足します。
`createGenerateToolsWithUrls(urls)` は、`createGenerateTools([builtinIcons, fromUrls(urls)])` と同じ組を返します。同じ名前は、表を優先します。

```bash
# examples/ で実行（output/icon-urls/ に生成される）
npm run builder:icon-urls

npx rz-remocon server -p 8485 -d output/icon-urls
```

## 独自のリモコン画面を配信する

`custom-ui/index.html` は、ボタンから `/api/sendCode` を直接呼ぶ、最小の画面です。
`-d` で配信すると、APIは同じサーバーなので、相対パスで送れます。

```bash
npm run custom-ui
```

## ライブラリから直接使う

以下は、REGZAへの接続設定（`regza.json`）が `examples/` にある前提で実行します。

| ファイル | 内容 | 実行 |
|---|---|---|
| `direct.ts` | REGZAに直接接続して、キーを送る | `npm run direct` |
| `api-client.ts` | 組み込みサーバー（`server`）のAPIを、クライアントから呼ぶ。事前に `server` を起動する（既定は `http://localhost:8484`） | `npm run api-client` |
