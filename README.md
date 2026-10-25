# rz-remocon

REGZA TV を CLI / Web UI から操作するためのプロジェクトです。

REGZA の接続登録・認証からリモコン操作までを行え、ライブラリとしてアプリケーションに組み込むこともできます。

## 特徴

- CLI / Web UI から REGZA TV を操作
- REGZA の接続登録・Digest 認証に対応
- リモコン画面をエディタで編集・保存（キーの配置、色、背景色、アイコン）
- 編集したリモコンを、認証なしで動く静的な HTML として生成（`generate`）
- ライブラリとして利用可能（`rz-remocon/api`、`rz-remocon/gen`。[ライブラリとして使う](#ライブラリとして使う)）

## 必要な環境

- Node.js
- npm
- REGZA TV
- REGZA TV と PC が同じ LAN に接続されていること

## インストール

```bash
npm install
```

## ライブラリとして使う

ライブラリとしての入口は 3 つです。リファレンス（`refs/`）は `npm run build` で生成します（[ビルドの流れ](docs/build.md)）。

| import | 内容 |
|---|---|
| [`rz-remocon`](refs/rz-remocon/index.md) | REGZA への接続・認証・キー送信 |
| [`rz-remocon/api`](refs/rz-remocon-api/index.md) | Web API のクライアント、キー定義（`RemoteKeys`）、Builder、設定のスキーマ |
| [`rz-remocon/gen`](refs/rz-remocon-gen/index.md) | 静的リモコンの生成（`generate`）、アイコンセット |

使い方は、次の例を参照してください。実行手順は [examples/README.md](examples/README.md) にまとめています。

- [REGZA に直接接続する](examples/direct.ts)
- [組み込みサーバー経由で接続する](examples/api-client.ts)
- [Builder でリモコンを作って静的ファイルを生成する](examples/builder.ts)
- [タブで切り替えるリモコンを作る](examples/builder-tabs.ts)
- [アイコンを足す](examples/builder-icons.ts)
- [アイコン名と画像 URL の表を使う](examples/builder-icon-urls.ts)
- [Builder で作ったリモコンを、エディタで編集する](examples/builder-editor.ts)
- [独自のリモコン画面を配信する](examples/custom-ui/index.html)

## CLI

### 接続を登録する

REGZA TV の IP アドレスを指定して接続登録を開始します。

```bash
npx rz-remocon setup 192.168.0.10
```

REGZA TV の画面に PIN が表示されます。

### PIN を入力して接続を確定する

REGZA TV に表示された PIN を指定します。

```bash
npx rz-remocon confirm 1234
```

接続に成功すると、認証情報が設定ファイルに保存されます。

### 対応 API を確認する（デバッグ用）

REGZA が対応している API を取得します。

```bash
npx rz-remocon support
```

結果は `support.jsonl` に JSON Lines 形式で保存されます。

### リモコンキーを送信する

キーコードを指定してリモコン操作を送信できます。

```bash
npx rz-remocon key 40BF10
```

`40BF10` は消音です。電源OFFなど、別のキーコードは `RemoteKeys`（`rz-remocon/api`）で確認できます。

### 接続状態を確認する

REGZA の接続状態（公開 API の応答）を表示します。

```bash
npx rz-remocon status
```

## Web サーバー

Web サーバーはデフォルトで `8484` 番ポートで起動します。

```bash
npx rz-remocon server
```

ブラウザで以下を開きます。

```text
http://localhost:8484/
```

Web UI から REGZA TV を操作できます。

リモコン画面は `/data/remocon.json` を読んで表示します。エディタで保存するまでは、ビルドで作られる標準のリモコン（`dist/public/data/remocon.json`）が表示されます。

> **注意**
>
> Web サーバーは認証機能を持ちません。
>
> ネットワーク上からアクセスできる環境で起動する場合は、信頼できるネットワークで使用してください。

### ポートを変更する

`-p` オプションでポートを変更できます。

```bash
npx rz-remocon server -p 3000
```

### 静的ファイルを配信する

`-d` オプションで静的ファイルのディレクトリを指定できます。

```bash
npx rz-remocon server -d ./public
```

例えば `public` に HTML / CSS / JavaScript を配置して、独自の Web UI を利用できます。

既定は、ビルドで作られる `dist/public`（標準のリモコン画面とエディタ）です。

### 設定データの場所を指定する

`-D` オプションで、リモコンの設定データ（`data/`）のディレクトリを指定できます（既定は `./data`）。

```bash
npx rz-remocon server -D ./my-data
```

このディレクトリは、エディタの保存先であり、`/data/` として配信もされます。`icon-urls.json` と `color-map.json` も、ここ（既定は `./data`）から読まれます（[設定ファイル](#設定ファイル)）。

### CORS を設定する

`-c` オプションで Web API に許可する Origin を指定できます。

```bash
npx rz-remocon server -c http://localhost:5173
```

- 別のサーバーから Web API に接続する場合に使用します。
- `"*"` を指定すると、すべての Origin からのアクセスを許可します。
- 生成した静的リモコン（下記）を別のサーバーで配信し、API だけをこのサーバーに向けるときも使います。その場合は、`index.html` の `<div id="remote">` に `data-api-base="http://192.168.0.2:8484"` を指定し、`-c` に、静的リモコンを配信する Origin を指定します。

### 接続元を制限する

`-a` オプションで、書き込みの API（キーの送信、エディタの保存）を受け付ける Origin を 1 つに絞れます。それ以外の Origin からの書き込みは、403 で拒否されます。

```bash
npx rz-remocon server -a http://localhost:5173
```

- 対象は、`/api` の `GET` と `HEAD` 以外のリクエストです。キーの送信（`POST`）と、エディタの保存（`PUT`）が含まれます。
- 画面（静的ファイル）、`/data/`、`GET` の API は対象外です。`-a` を付けても、誰でも読めます。
- `-c`（CORS）とは別の機能です。`-c` は別の Origin からの API 呼び出しを許可し、`-a` は許可した Origin 以外からの書き込みを拒否します。

### API ドキュメント

サーバーを起動すると、Web API の仕様が次の URL で見られます。

| URL | 内容 |
|---|---|
| `/openapi.json` | OpenAPI の仕様 |
| `/docs` | API リファレンス（表示に CDN から Scalar を読み込みます） |

## リモコンを編集する

### リモコンエディタ

開発用の画面として、リモコンを編集できます。

```text
http://localhost:8484/editor.html
```

- キーを一覧から追加し、キャンバス上で配置・大きさを調整します。
- 保存すると、標準のリモコンが編集したリモコンのキー配列に入れ替わります。

### アイコンを追加する

`data/icon-urls.json` に、名前と画像 URL の表を置くと、キーの `icon` にその名前を使えます。
ビューア（`/`）とエディタ（プレビューを含む）が、`/data/icon-urls.json` を読んで、名前の画像を描きます。

```json
{
  "logo": "/logo.svg",
  "nhk": "https://example.com/nhk.svg"
}
```

- 画像は、`https://...` の URL、`data:image/...`、パス（`logo.svg`、`icons/a.svg`、`/logo.svg` など）で指定できます。
- 標準のアイコンと同じ名前（`powerOn` など）を書くと、こちらが優先されます。
- `/logo.svg` のような絶対パスの画像は、`-d` の静的ディレクトリに置いて配信します。

#### `sample-icon-urls-from-google-favicons` コマンド（個人用のサンプル）

アプリのドメインの表（既定は `data/app-domains.json`）から、Google の favicon の URL を並べた `data/icon-urls.json` と、確認用の `icon-urls.html` を作る、個人用のサンプルです。

```bash
npx rz-remocon sample-icon-urls-from-google-favicons [-o data] [-d <domains.json>] [-s 128]
```

### キーの色を変える

`data/color-map.json` に、名前と色（`#RRGGBB`）の表を置くと、エディタで新しく追加するキーの色を変えられます。エディタは `/data/color-map.json` を読みます。

```json
{
  "media": "#0f766e",
  "powerOn": "#dc2626"
}
```

標準の色は、次のコマンドで `data/color-map.json` に書き出せます。書き出したファイルの色を書き換えてください。変えない行は消しても、そのまま残しても動きます（書かなかった名前は標準の色になります）。

```bash
npx rz-remocon default-color-map [-o data] [-f]
```

すでに `color-map.json` があるときは、編集した内容を失わないよう、エラーになります。上書きする場合は `-f`（`--force`）を付けます。

- 名前は、キー名（`powerOn` など）か、キーの種類（`power`、`volume`、`media`、`etc` など）です。キー名の指定が、種類の指定より優先されます。どの接頭辞にも当たらないキーは `etc` の色になります。
- 色は `#RRGGBB` の形式だけ使えます。
- ファイルがなくても動きます（標準の色で決めます）。不正な項目があっても、その項目だけを飛ばして、使える項目は使います。飛ばした項目は、ブラウザのコンソールに出ます。
- すでに保存したキーの色（`remocon.json` の `color`）は変わりません。新しく追加するキーに効きます。
- `generate` は `remocon.json` の色をそのまま使うので、`color-map.json` は読みません。

## 静的リモコンを生成する

`remocon.json` から、サーバーなしで動く静的な HTML（`index.html`）を生成します。

```bash
npx rz-remocon generate -i data/remocon.json -o output
```

- 既定は `-i data/remocon.json`、`-o output` です。エディタで保存する前は `data/remocon.json` がないので、標準のリモコンから作るときは `-i dist/public/data/remocon.json` を指定します。
- 出力先に `index.html` と `assets/` が作られます。
- アイコンの表は、`-i` と同じディレクトリの `icon-urls.json` があれば、それを使います。別のファイルは `--icon-urls <path>` で指定します（指定したファイルがないとエラーです）。不正な項目があるときは、項目を挙げて警告し、その項目だけ飛ばします。
- 生成したファイルは、同じ CLI の `server` で配信できます（`npx rz-remocon server -d output`）。ビルドから配信までの手順は [examples/README.md](examples/README.md) を参照してください。

> **注意**
>
> `generate` は `npm run build` の後で実行してください（ビルドで作られる `dist/` の中のファイルを使います）。
> `npm run cli -- generate` のように `tsx` から実行すると、動きません。

## 設定ファイル

`setup` と `confirm` が完了すると、`regza.json` に REGZA TV の接続情報が保存されます。

設定ファイルには認証情報が含まれるため、他のユーザーから読み取れないように `0600` のパーミッションで保存されます。

リモコンの設定は `data/` に保存されます。`data/` の中のファイルは、次のとおりです。

| ファイル | 内容 |
|---|---|
| `data/remocon.editor.json` | エディタの編集データ（正本） |
| `data/remocon.json` | 表示用のリモコン設定（`/` と `generate` が読む） |
| `data/icon-urls.json` | アイコン名と画像 URL の表（任意。`/`、エディタ、`generate` が読む。[アイコンを追加する](#アイコンを追加する)） |
| `data/color-map.json` | キー名・種類と色の表（任意。エディタが読む。[キーの色を変える](#キーの色を変える)） |

`server` の `-D` で `data/` の場所を変えたときは、そこのファイルが使われます。

## 開発

### 開発サーバー

```bash
npm run dev
```

### ビルド

```bash
npm run build
```

`dist/`（配布物）と `refs/`（API リファレンス）を作ります。流れは [docs/build.md](docs/build.md) にまとめています。

ビルドでは、標準のリモコン（`src/gen/default-remocon.ts`）も `dist/public/data/remocon.json` に出力されます。
このとき、作業ディレクトリの `data/icon-urls.json` と `data/color-map.json` があれば読み、標準のリモコンのアイコンと色に反映します。公開するものをビルドするときは、これらのファイルを置かないでください。
`data/` に標準のリモコンを書き出す場合は、次を実行します（`remocon.json` と `remocon.editor.json` を生成します）。

```bash
npm run default-remocon
```

### テスト

```bash
npm test
```

### 型チェック・lint / format

```bash
npm run tsc     # 型チェック
npm run check   # lint / format（Biome。直せるものは自動で直す）
npm run lint    # check と tsc を続けて実行（片方が失敗しても、両方の結果を出す）
```

方針と実装状況は [docs/todo.md](docs/todo.md)、キーコードのメモは [docs/memo-code.md](docs/memo-code.md) にあります。

## プロジェクト構成

```text
.
├── src/
│   ├── cli/          # CLI / Web server
│   ├── lib/          # REGZA API / 共通処理
│   ├── api/          # Web API のコントラクト、リモコン設定のスキーマ、Builder
│   ├── gen/          # 静的リモコンの生成（generate）、標準のリモコン（default-remocon.ts）
│   └── web/          # React frontend（リモコン画面、エディタ）
├── scripts/          # ビルド補助（build.sh、静的リモコンの送信処理 remote.js）
├── public/           # 静的ファイル（favicon など。ビルドで dist/public にコピーされる）
├── data/             # リモコンの設定（実行時に生成）
├── dist/             # ビルドの出力（配布物。毎回作り直す）
├── work/             # API Extractor などの中間生成物（ビルドが毎回消す。コミットしない）
├── typedoc/          # ソース位置の取得に使う typedoc の設定（独立した npm プロジェクト）
├── docs/             # 方針と実装状況（todo.md）、ビルドの流れ（build.md）、キーコードのメモ（memo-code.md）
├── refs/             # API リファレンス（ビルドで生成。入口は index.md）
├── examples/         # 利用例（実行手順は examples/README.md）
├── package.json
├── README.md
├── regza.json        # 実行時に生成される設定
├── support.jsonl     # support コマンドの出力
└── ...
```

## 補足

本プロジェクトは REGZA の API と Digest 認証を利用しています。

REGZA の機種や設定、ネットワーク環境によっては、利用できない機能や接続が安定しない場合があります。

接続できない場合は、以下を確認してください。

- REGZA TV と PC が同じ LAN に接続されている
- REGZA TV の IP アドレスが正しい
- REGZA TV 側で必要な設定が有効になっている
- ネットワークから REGZA TV の API に接続できる

## 参考

- [regza-digest-auth](https://github.com/9SQ/regza-digest-auth)
- [homebridge-regza-app-connect](https://github.com/sylpied/homebridge-regza-app-connect)
