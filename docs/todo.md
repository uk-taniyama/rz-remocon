# ダッシュボードUI基盤 方針と実装状況

この文書は、方針と、現在の実装の状況をまとめたものです。
状態の表記は次のとおりです。

* **済**: 実装済み
* **一部**: 一部だけ実装済み
* **未**: 未実装
* **変更**: 当初の方針から変えた（理由を併記）

## 目的

Reactで、Widget（キー）をグリッド上に配置・編集できるダッシュボードUI基盤を作る。

REGZAリモコンを最初の用途とするが、リモコン専用にはせず、汎用的なWidget配置基盤として利用できる構成にする。

## 全体の状況

| フェーズ | 内容 | 状態 |
|---|---|---|
| 0 | 仕様確定（`?dev=editor` の入口、保存形式、自動配置、D&D、spacer、REGZA の表現） | 済（spacer はエディタに置かず、Builder のみ） |
| 1 | エディタの骨格（カテゴリ別一覧、グリッド、追加、自動配置、プロパティ） | 済 |
| 2 | レイアウト制御（x/y/w/h、グリッドスナップ、D&D、リサイズ、spacer） | 済（spacer は Builder のみ） |
| 3 | REGZA 統合（RemoteKey を Widget として扱う、`REMOTE_KEY_DEFS` の接続、送信） | 済 |
| 4 | 保存と復元（JSON 保存、再読込で復元、初期配置の自動生成） | 一部（保存と復元は済。初期配置の自動生成は未） |

## エディタ

開発用画面として `editor.html`（`?dev=editor` の代わり）で EditorView を起動する。

```text
?dev=editor
    ↓
EditorView
```

ページは `editor.html` に分けた（ビューアの `index.html` とは別のバンドル）。（試行）

### UI

左ペインに追加可能なキーの一覧を置き、右側をグリッドキャンバスとする。（済）

* 左ペイン: 種別ごとに折りたたみ可能な一覧。項目をクリックすると追加し、隣の「送信」ボタンでそのキーを送信できる。
* 中央: グリッドキャンバス。
* 右ペイン: 選択中のキーのプロパティ、カスタムキー（任意のコード）、通信ログ。
* 上部: ツールバー（保存、背景色、空行の詰め、全削除、再読込）。

### 追加と配置

追加時にユーザーが配置位置を指定するのではなく、**次の空き位置へ順番に自動配置**する。（済）

* 末尾キーの右側に置く。入らなければ次の行の左端に置く。
* D&D は追加後の配置調整・隙間調整に使う。（済）

### カテゴリ

追加可能なキーは、種別ごとに整理する。（済）

種別は `REMOTE_KEY_KIND_DEFS` が持つ。電源、音量、チャンネル、番組、数字、入力切替、メディア、ボタン、アプリ、キー、その他、レイアウト（`$` で始まる特殊キー。タブとラベル）。

> 変更: 当初の例にあった「ナビゲーション」は独立した種別にしていない。方向キーなどは「キー」に入る。

カテゴリは折りたたみ可能な一覧（`<details>`）で表示する。（済）

### UIの方針

画像エディタや Visio のような完全な自由配置エディタではなく、グリッドベースのダッシュボードとする。

* Widget を一覧から追加（済）
* 空いている位置へ自動配置（済）
* ドラッグ＆ドロップで配置位置を変更（済）
* グリッドにスナップ（済）
* 必要に応じて Widget をリサイズ（済。右下のハンドルのみ）
* Widget を選択するとプロパティを編集（済。ラベル、コード、x/y/w/h、色）
* レイアウトをデータとして保存・復元（済。サーバーの `data/`）

基本的には「配置を一からデザインする」のではなく、「追加して並べ、必要な部分だけ D&D で調整する」操作感を目指す。

## レイアウト

Widget はグリッド上の座標とサイズを持つ。（済）

単位はセル（整数）。1キーは `grid.unit` セル（既定 4）。描画側だけで rem に換算する。

```ts
// 実装の型（api/schema.ts の editorRemoteKeyConfigSchema）
type EditorKey = {
  id: string;
  name: string;
  code?: string;
  x: number; y: number; w: number; h: number;  // セル
  label?: string;
  showLabel: boolean;
  icon?: string;   // 名前か画像 URL
  color: string;
};
```

> 変更: 当初の `{ id, type, x, y, w, h, props: Record<string, unknown> }` の汎用型は採用していない。キーは専用のスキーマにした。`type` と `props` による汎用化は、Widget の種類が増えた時点で改めて検討する。

## Spacer

空白は、Builder の `spacer(w)` で表現する。カーソルを進めるだけで、Widget は作らない。（済）

エディタには spacer を置かない。空白が必要なら、キーを動かすか、空のラベルだけのキー（カスタムキーの「追加」で空欄のまま追加）を使う。（決定）

> 変更: 当初の `{ type: "spacer", ... }` という Widget としての spacer は作らない。

## Widget

当初の想定は次のとおり。

| 種類 | 状態 |
|---|---|
| RemoteKey | 済（キー） |
| Button | 未 |
| Text | 未 |
| Image | 未 |
| Spacer | 済（Builder のみ。エディタには置かない） |

REGZA リモコンのキーも Widget の一種として扱う。（済）

## レイアウトライブラリ

候補は snapgrid、react-grid-layout、GridStack だった。

> 変更: snapgrid の検証は行わず、**GridStack を採用**した（`package.json` の `gridstack`）。ドラッグ、グリッドスナップ、リサイズ、自動配置の確認は、GridStack で行っている。

確認項目の状況:

* Widget 追加（済）
* 自動配置（済。独自の空き位置計算。GridStack の `compact` は使わない）
* ドラッグ（済）
* グリッドスナップ（済）
* リサイズ（済）
* 複数 Widget の配置（済）
* Widget 間の詰まり方（未記録。確認結果を残す）
* 行全体の空け（Builder では `spacer` で可能。エディタでは、キーを動かして行う）
* レイアウトの保存・復元（済）

## サーバーの静的ファイルの既定（済）

`server` の `-d` の既定値は、ビルド後は隣の `dist/public`、開発時はリポジトリの `public`（`resolveDefaultPublicDir`）。
以前は `../../public` 固定で、ビルド後にパッケージの外を指していた。（修正済み。この項目は終了）

## 保存と復元

保存先は、次の 2 つのファイル（`data/`）。（済）

| ファイル | 内容 |
|---|---|
| `remocon.editor.json` | 編集用の正本。id、showLabel、ラベルの文字列などを保持する |
| `remocon.json` | 表示用。編集用から導出する（`toRemoconConfig`） |

* 保存は `PUT` で行い、リビジョンで競合を検知する。競合時は、上書きか再読込を選ぶ。（済）
* 正本を最後に書き、途中で失敗しても再保存できるようにしている。（済）
* ページ再読込時は、保存済みのレイアウトを読み直して復元する。（済）

> 変更: 当初は `localStorage` への永続化を想定していた。サーバーの `data/` に保存する形にした。`localStorage` はブラウザごとにしか残らず、表示用の `remocon.json` と揃えられないため。

初期配置の自動生成は、エディタについては未実装。現状は空のキャンバスから始める。（未）

### 標準のリモコン（ひな形）

`data/remocon.json` がないときに、ビューアが表示する標準のリモコン。（**ひな形。ちゃんとした内容にする必要がある**）

* 定義は `src/gen/default-remocon.ts`（Builder で組む）。`build.sh` が `vite build` の後に `dist/public/data/remocon.json` へ出力する。（済）
* サーバーは `/data/*` を、先に `data/`、なければ `public`（`dist/public/data/`）から探す。そのため、保存するまでは標準が表示され、保存後は保存したものが優先される。（済）
* テスト（`default-remocon.test.ts`）は、スキーマを通ること、先頭がタブではみ出さないこと、書き出しだけを見る。（済）
* **中身はひな形。** 基本・放送・アプリ・再生の4タブを置いただけで、キーの選び方、並び、色、アイコン、背景色は、仮の決め方。使い込んで決める。（未）
  * 確認項目: 実機での見た目（タブの切り替え、十字キーの並び、番号キーの並び）、よく使うキーが漏れていないか、ラベルだけになるキーの見た目。
* **未確認。** この環境では `npm install` ができず、`build.sh` の `tsx --tsconfig tsconfig.gen.json src/gen/default-remocon.ts` の実行と、`npm test` は、まだ通していない。
* エディタの初期配置（保存がないときに、標準から始める）は未。保存形式が違う（`id`、`showLabel` を持つ）ため、`remocon.json` から編集用への変換が要る。（未）
* `generate` の既定入力（`data/remocon.json`）は、保存がないと失敗する。標準から作るときは `-i dist/public/data/remocon.json` を指定する。（未決）

## REGZA 統合

* RemoteKey を Widget として扱う。（済）
* `REMOTE_KEY_DEFS` を、キー一覧（カタログ）に接続する。（済）
* 送信は既存の `sendCode` を使う。（済）
* UI 上では Widget として扱う。（済）

### 未解決

* **エディタでアイコンを指定できない。** カタログの既定値だけが入り、プロパティ欄には項目がない。Builder は名前か画像 URL を指定できる。
* **指定できるキー名と種類を、README だけでは確認できない。（未）** `icon-urls.json` や `color-map.json` に書く名前は、`src/api/key-defs.ts`（`RemoteKeys`）を見るしかない。`rz-remocon dump-keys` のようなコマンドで、キー名、種類、ラベル、コード、標準の色、標準のアイコンの有無を一覧にする案。出力の形式（表か JSON か）と、`default-color-map` との関係（統合するか）は未決。
* ~~キーコードの重複~~: `mediaBack10s` と `keyLeft2`（`40BE22`）、`mediaSkip30s` と `keyRight2`（`40BE23`）は同じコードを持つ。問題なしとして扱う。

## タブとラベル（特殊キー）

`$` で始まる名前のキーは、REGZA のキーではなく、レイアウト用の特殊キーとする。（済）

* `isSpecialKey(name)`（`name.startsWith("$")`）で判定する。
* `TAB_KEY_NAME`（`$TAB$`）: タブ。全幅の見出し帯で、コードを持たない。
* `LABEL_KEY_NAME`（`$_LABEL$`）: ラベル。コードを持たない、名前付きの普通のキー。
* 保存データ（`remocon.editor.json` / `remocon.json`）の形は変えない。`tabMode` などの項目も足さない。
* 表示用（`toRemoconConfig`）では、特殊キーの `code` を落とす。押せないキーになる。
* 表示用キーは `toRemoconConfig` で y、x 順に並べる。タブは全幅なので、他のキーと同じ位置には並ばない（重なりは配置の制約で防ぐ）。先頭のタブが `[0]` になるのは、先頭のタブを `y = 0` に固定しているため。
* `[0]` がタブなら、各タブから次のタブまでをグループ化し、ラジオボタンで切り替える。タブが `[0]` でなければ従来どおり一画面に描画する。
* 切り替え表示ではタブを下部の選択ボタンとして描き、各グループのキーはタブ見出しの直下から配置する。切り替えない表示では、タブは白背景・`key.color` の文字色の `div` として描く。ラベルは通常のキーと同じ。
* エディタ: カタログの末尾（種別「レイアウト」）に、「タブ」と「ラベル」を置く。タブは全幅、1キー高さ。
* 種別の既定（`resolveRemoteKeyKindDef`）は、どの接頭辞にも当たらない名前を「その他」（`etc`）に入れる。

### 初版の残り

* ~~タブの全幅のガード~~: `getKeyRules`（`editor-grid.ts`）で、タブの `x` / `w` / `h` を固定し、ラベルを常に表示する。先頭のタブ（`y = 0`）は `y` も固定して、`locked` にする。（済）
* **先頭のタブの削除（未決）。** 現状は、他のタブがある間は先頭のタブを削除できない（`canRemoveEditorKey`。タイルの × は無効表示、プロパティ欄の削除ボタンは無効）。
  * 先頭のタブを消すと、先頭がタブでなくなり、タブ表示が崩れる（`[0]` がタブでない）ため。
  * この制限だと、先頭のタブは並べ替えも削除もできない。名前と色だけ変えられる。
  * 削除できないとき、タイルの × は出さない（非表示）。何が起きているか分かりにくい。薄く表示して無効にする案は、見た目が逆に分かりづらかったため戻した。見せ方（理由の表示、別の導線など）は未決。
  * 案: 次のタブを `y = 0` に繰り上げ、元のグループのキーはその下へ引き継ぐ（キーは消えない。`shiftEditorKeysDown` を使える）。または、グループのキーごと削除する（確認が要る）。
  * 先頭以外のタブを消す場合は、そのグループのキーが直前のグループに併合される。空いた行は詰まる。
* **タブを下へドラッグすると、下にあるボタンと入れ替わる（未調査）。** 期待は、タブが下の行のキーを押し上げずに、その位置へ動くこと（タブより上のキー群は、前のグループに併合される）。入れ替わるとキーの上下が逆転し、グループの構成が意図せず変わる。
  * 原因は未調査。gridstack の衝突時の入れ替え（swap）の挙動が関係している可能性がある（推測。未確認）。
  * 先頭以外のタブが対象。先頭のタブは `locked` で動かせない。
* `groupRemoteKeysByTab` は、配列の先頭がタブであることを前提にする（先頭でなければ従来表示にフォールバックする）。先頭のタブは `y = 0` に固定されているので、通常は満たされる。
* タブバーの背景色は固定（`main.css` の `.remote-key-tabs__label` の `background-color: #ffffff`）。`remocon.background` とは連動していない。

### レビューメモ（2026-10-12）

* **Builder の `tab()` の既定色が背景色になる。（済）**
  * 既定の背景は白（`DEFAULT_BACKGROUND`）なので、タブバーが「白地に白文字、枠も白」になり、読めなかった。
  * 色を省いたときは、エディタと同じ既定色（`resolveKeyColor(TAB_KEY_NAME)`、種別「レイアウト」の `#475569`）にした。テストも合わせて直した。
* **キーの中身の共通化（`KeyFace`）。** ビューア（`RemoteKeyButton`）とエディタ（`EditorKeyView`）が、同じ `KeyFace`（`remoteKeys/KeyFace.tsx`）で、外枠（`div.key-face`）・アイコン・ラベルを描く。外枠は常に `div`（ビューアのキーボード操作は持たない。送信は `data-code` のクリック委譲）。
  * アイコン本体（`fromComponents`、`imgRender`）は、枠いっぱい（100%）に描く。大きさは枠が決める（アイコンだけ 70%、ラベルと一緒 35%。値は `.key-face__icon` / `--with-label`）。
  * 文字と隙間の基準は `--key-font-size` / `--key-gap`。ビューアは `scaled()`、エディタは `editor.css` の 0.8rem を渡す。
* **キーの共通スタイル `.key-button`（試行、未検証）。** `common.css` に作り、ビューアの通常キーとエディタのキータイル（`key-tile__button`）に付けた。背景色と文字色は `--key-bg` / `--key-fg` で渡す。
  * 文字色は `readableTextColor`（`remoteKeys/contrast.ts`）で決める。背景の相対輝度 L が `TEXT_COLOR_LUMINANCE_THRESHOLD`（0.6）より大きければ黒、以下なら白。2026-10-12 に 0.6 で導入（未検証）。
  * 0.6 では、黒になるのは薄い色だけ（`#39ff88`、`#e2e8f0`、`#ffffff`）。黄橙 `#faad14`（L 0.503）と黄緑 `#84cc16`（L 0.481）は白のまま。白との比は、それぞれ約 1.9 と約 2.0 で弱い。読みやすさを優先するなら、閾値を 0.5 にすると `#faad14` が黒になる。
  * タブは対象外（従来どおり inline）。
* **ビューアの色の見直し。CSS を含む。（現状で可。2026-10-12 に実機で確認し、タブの見た目はよいと判断。）**
  * 文字色が見づらくなるかもしれない。選択中のタブの文字色は `#fff` 固定で、明るいタブ色だと、背景との差が出ない。
  * 案: タブ色を基準に、読みやすいほうの文字色（白か黒）を決める。コントラスト比（WCAG の式）の大きいほうを選ぶ。ライブラリ（`colord` など）を使ってもよい。使うなら `dependencies` に入れる（`dist/` で解決できなくなるため）。
  * タブバーの配色（`main.css` の `.remote-key-tabs__label`）は、背景 `#ffffff` 固定、色の変数が未設定のときの既定は `#2563eb`、タブの色は枠・文字・選択中の背景に使う。この構成のままでよいかを含めて見直す。
  * 従来表示（タブ表示にならない場合）のタブは、背景が `DEFAULT_BACKGROUND` 固定、文字色が `key.color`（`RemoteKeyButton`）。タブ表示のときの色の扱いと揃える。
  * タブバーの背景色（`#ffffff` 固定）が `remocon.background` と連動していない点（上に記載）も、ここで合わせて決める。
* **エディタ: タブのロック状態が、gridstack のノードと食い違いうる。（現状は問題なし。削除の設計時に再確認）**
  * 先頭のタブの固定（`y` の固定）は、`getKeyRules` が `y === 0` で、その都度判定する。一方、ドラッグを止める `locked` / `noMove` は、ノードを作るとき（`editorKeyToWidget`）に一度付けるだけで、あとから更新しない。
  * 現状は、先頭のタブが `y = 0` でロックされ、他のキーに押しのけられない（実機で確認済み）。作成後に他のタブが `y = 0` へ来ることもないので、食い違いは起きない。
  * 先頭のタブの削除を設計するとき（上の「先頭のタブの削除（未決）」）に、次のタブを繰り上げて `y = 0` に置く案を採るなら、そのタブにロックを付ける必要が出る。そのときに、ノードのフラグを同期する仕組みも合わせて決める。
* **ビューア: タブ表示の細かい課題。（未）**
  * 選択中のタブを記憶しない（再読込で先頭のタブに戻る）。
  * タブ数が減る再読込があると、`defaultChecked` がマウント時にしか効かず、選択中のタブがなくなって何も表示されない（今は再読込がないので、顕在化しない）。
  * タブが多いと、等幅の列に分けるため、タブ名が省略される。
  * パネルの `scrollbar-gutter: stable` と、`--cell`（`.remote-key-container` の幅、`100cqw` 基準）の計算で、狭い画面のとき右端がはみ出さないか、確認していない。
* **HTML の分割（試行、未検証）。** `index.html`（ビューア）と `editor.html`（エディタ）に分けた。`vite.config.ts` の `rollupOptions.input` で2ページをビルドする。
  * 依存パッケージを入れられない環境で作ったので、ビルドは未確認。まず `npm run build` で、次を確認する。
    * `dist/public/assets/` に `index-*.css` が1つだけ（`generate` の `findCssFile` が前提にする）。エディタ側の CSS が別名で出ると、`generate` が失敗する。
    * `dist/public/editor.html` があり、`/editor.html` で EditorView が描画される。
  * `main.tsx` はビューアだけを描くようにした。`App.tsx` と `App.test.tsx`（`?dev=editor` の切り替え）は、使われなくなったので削除した（2026-10-12）。
  * CSS を3つに分けた（未検証）。`common.css`（トークンと素の要素の既定値）、`main.css`（ビューア）、`editor.css`（エディタ・カラーピッカー）。
    * Pico と `common.css` は、`main.css` / `editor.css` の先頭で `@import` している。JS の import にすると共有チャンク（`web-*.css`）になり、ビューアの `index.html` の CSS が2つになって `generate` が失敗するため。
    * ビューアから Pico を外すには、`main.css` の `@import "@picocss/pico/..."` を消す。
    * 確認点: `dist/public/index.html` の stylesheet が1つだけ（`main-*.css`）であること。`common.css` が別ファイルとして出ていないこと。
* **エディタの Preview（広い画面だけ横並び。試行、未検証）。** `PreviewView`（`views/PreviewView.tsx`）が、編集中のキーを `toRemoconConfig` で変換して、ビューアと同じ `RemoteKeyButtons` で描く。
  * `EditorView` は、`syncDirty` のたびに `readCurrent()` を `previewKeys` に入れて渡す（保存前の編集も見える）。
  * 操作はさせない。`RemoteKeySender` を使わず、枠に `inert` を付ける。キーを押しても送信されない。
  * 幅は 1400px 以上で 4 列目に出す（`editor.css`）。それ未満は非表示で、3 列のまま。
  * キーの大きさは `.remote-key-container`（`container-type: inline-size`）の幅、`100cqw` で決まる。ビューアと Preview は、同じクラスの div で包む。
  * CSS は `remote-keys.css`（キーの枠・タブ）を新しく分け、`main.css` と `editor.css` の両方が `@import` する。エディタで Pico を外した版を使うときは、`editor.css` の先頭の `@import` を、その版に合わせる。
  * 確認点: 1400px 前後で列が切り替わること、タブ付きのデータで Preview のタブバーが枠の下に張り付くこと、`inert` で操作できないこと。
* **CSS の残存クラスの見直し。（見直し済み。そのままでよい）** 2026-10-12 時点の静的な調べ。
  * `main.css` / `editor.css` / `common.css` で定義していて、コードから使われていないクラスは、gridstack が実行時に付ける `grid-stack-item` / `grid-stack-item-content` / `ui-resizable-se` だけ。これは残す。
  * ビューアのタブ（`RemoteKeyButton`）が付ける `class="tab"` に、CSS がない。`.tab` のルールは、エディタ用の `.key-tile .key-tile__button.tab` だけで、ビューアのタブはインラインの style で描いている。クラスを外すか、CSS に移すかを決める。
  * コードが付けているのに、CSS にルールがないクラス: `color-picker-dialog`、`color-picker-dialog__action--cancel`、`color-picker-dialog__action--ok`、`color-picker__hex-label`。見た目には効かず、フック用として残す。（`color-picker-dialog__body` などは `editor.css` にルールがある。）
  * 値の未参照の CSS 変数は、`--pico-*`（Pico の上書き）だけ。問題なし。
* **先頭がタブでない場合の扱い。対応不要と判断。**
  * エディタは、最初のタブを必ず `y = 0` に差し込み、ロックする。Builder は、最初のタブを最初に置かないとエラーにする。どちらの経路でも、`[0]` はタブになる。
  * Builder で `spacer()` / `newline()` を先に呼んでも、`keys[0]` がタブなら、タブ表示になる。タブの `y` は 0 でなくなるが、描画はタブ自身の `y` を使わない（グループ内のキーは `key.y - tab.y - tab.h` で相対化する）。
  * 旧データはなく、API への直接保存や手書きの JSON は想定しない。先頭がタブでないデータへの対策（警告、読み込み時の補正、スキーマ検証）は、入れない。

## Builder（コードでの組み立て）

Builder（`remoteKeysBuilder`）は、エディタとは別の入口として実装している。（済）

* `build()` の結果は `RemoconData`（`version` を除いた形）。`{ version: 1, ...build() }` で `remocon.json` として保存できる。
* `buildEditor()` の結果は `EditorRemoconConfig`。そのまま `remocon.editor.json` として保存できる。（済）
  * キーは、`label` の文字列と `showLabel` を持ち続け、結果を作るときに形を整える。`build()` は、`showLabel` が `false` のキーの `label` を省く。`buildEditor()` は、文字列を残す。
  * `RemoteKeyDraft` に `showLabel`（任意）を足した。`decorator`（`createDecorator`）は、アイコンが付くキーの `label` を消さず、`showLabel` を `false` にする。`label` を `undefined` にするだけの `decorator` も、従来どおり非表示になる。
  * `overrides` に `label` だけを指定すると、その文字列を表示する。`showLabel` も指定したときは、そちらが優先。
  * `id` は `k1`、`k2`、…（追加した順）。タブとラベルは、`code` を持たず、`showLabel` が `true`。`toRemoconConfig(buildEditor())` は、`build()` と同じ内容になる（並びは上から左へ揃う）。
* 出力は検証していない。`w: 0` や不正な色も通る。（未）
* `tab(label, color?)` で、タブを置く。途中の行でも、自動で改行してから置く（`newline()` は不要）。幅は全幅、高さは1キー分（エディタの表示と揃える）。最初のタブは、キーを1つも置く前に置く。違えばエラー（先頭がタブでないと、タブ表示にならないため）。2つ目以降は、どこに置いてもよい。（済）
* `label(text, overrides?)` で、コードのないラベルを置く。既定は1キー分。（済）
* `add` / `addCustom` は、`$` で始まる名前を受けず、「不正な名前です」でエラーにする。特殊キーは `tab()` と `label()` で作る。（済）

### アイコン（createGenerateTools）

Builder の `decorator` と `generate` の `iconRender`、アイコンの有無を返す `hasIcon` は、同じアイコンセットから組で作る。（済）

* `IconSet`（名前 → 描画関数）を、`builtinIcons`、`fromComponents`、`fromUrls` で作り、`createGenerateTools(...sets)` に渡す。後ろのセットが優先。
* 標準のアイコンに `icon-urls.json` の表を足す組は、`createGenerateToolsWithUrls(urls)`（`createGenerateTools(builtinIcons, fromUrls(urls))` と同じ）で作る。`generate`、標準のリモコン（`default-remocon.ts`）、ビューア・エディタ（`useIconSet`）が使う。（済）
* `decorator` は、表にある名前をキーの `icon` に入れる。`iconRender` は、表にある名前はその描画関数、それ以外の文字列は `<img>` で描く。
* `hasIcon(name)` は、表に名前があるかを返す。`decorator` が `icon` を入れるかの判定に使い、エディタのキー一覧（`createEditorCatalog`）にも渡す。
* `keepLabel` は、呼び出しごとに `defaultDecorator(key, { keepLabel: true })` で指定する。既定値には足さない。
* 色の差し替え（`colorResolver`）は未対応。`decorator` をラップして `color` を先に入れる方法で代用できる。（未）
* 公開は `types.ts` と `utils.ts` に書いたものだけ。`internal.ts`（`createDecorator`、`createIconRenderer`、`imgRender`）は非公開。（済）

## color-map.json

キー名・種類ごとの色を、ファイル（`color-map.json`）で上書きできるようにする。`icon-urls.json` と同じ作り。（済。画面上での編集は保留）

* 置き場所は `<dataDir>/color-map.json`。`/data/color-map.json` で取得する。
* 形式は「名前 → `#RRGGBB`」の表。名前は、キー名か kind。標準の色（`defaultColorMap`）に重ねる（`mergeColorMap`）。`DEFAULT` は、どのキー名も kind（最後は `etc`）に解決されるため、上書きしても効かない。
* `api/colors.ts` の `parseColorMap` で、項目ごとに検証する。不正な項目は `errors` に記録して飛ばす。
* エディタ: `useColorMap()`（`web/remoteKeys/useColorMap.ts`）が取得して、`colorResolver` を返す。`loadColorMap` は失敗しても例外を投げず、`{ colors, warnings }` を返す。警告は `console.warn` だけに出す（エディタ上部の表示は、`icon-urls.json` のみ）。`useEditorData` が、アイコンの表と一緒に揃うまで待つ。
* 標準のリモコン: `default-remocon.ts` が `loadColorMapFile("data/color-map.json", false)` で読む。
* `generate` は、`remocon.json` の色（必須）をそのまま使うため、`color-map.json` は読まない。`--color-map` も作らない。
* 標準の色は、`rz-remocon default-color-map`（`cli/color-map.ts`）で、`-o`（既定 `data`）の `color-map.json` に書き出す。すでにあるときは、編集済みの内容を失わないようエラーにする（`--force` で上書き）。`defaultColorMap` から実行時に作るため、build.sh での生成は不要。`DEFAULT` は出さない。
* テスト: `colors.test.ts`、`load.test.ts`、`useColorMap.test.ts`。

## icon-urls.json

名前を付けた画像 URL の表を、ファイル（`icon-urls.json`）で渡せるようにする。（済。画面上での編集は保留）

```json
{
  "logo": "/logo.svg",
  "nhk": "https://example.com/nhk.svg"
}
```

### 方針

* 置き場所は `<dataDir>/icon-urls.json`。`/data/icon-urls.json` で取得する。（決定）
  * `remocon.json` と同じ方式（静的配信を、クライアントが直接 fetch する）。API（`icons.get`）は作らない。`contract.ts` と `apiRouter` は変更しない。
  * `server` 時の指定は、既存の `-D, --data-dir` で足りる。`--icon-urls` のような個別のオプションは、`data/` の外のファイルを使いたくなるまで作らない。
* 形式は「名前 → URL」の表。`fromUrls` の入力と同じ。`api/icon-urls.ts` の `parseIconUrls` で、項目ごとに検証する。
  * URL の検証は `isIconUrl`。値を `new URL(value, "http://localhost/")` で解析し、プロトコルを許可リスト（`http:`、`https:`、`data:` は `image/` のみ）で確かめる。相対パスは、基準 URL で解決されて `http:` になるので、`logo.svg`、`icons/a.svg`、`/logo.svg` のどれも通る。空の文字列は、基準 URL に解決されてしまうので、別に弾く。（変更）
  * 当初は、正規表現で「`/` `./` `../` で始まるものだけ」と絞っていた。`logo.svg` のような普通の書き方まで弾いたので、定番（`new URL` で解析して `protocol` を確かめる）に改めた。
  * 不正な項目は飛ばし、使える項目は使う（`generate` と同じ）。（変更）
  * 途中で「1件でも不正なら、表全体を使わない」にしたが、1件のミスで全部のアイコンが消えるため、「不正な項目だけ飛ばす」に戻した。
* 標準アイコンと同じ名前は、こちらが優先（`createGenerateTools` の「後ろが優先」と同じ）。標準アイコンの差し替えにも使える。
  * `decorator` は、キー名と同じ名前のアイコンを自動で入れる。差し替えると、そのキーの見た目が変わる。
* 名前は描画時に解決する。`remocon.json` には名前のまま入る。（決定）
  * `icon-urls.json` を編集すれば、保存し直さなくても反映される。既存の `IconSet` の考え方と同じ。

### 実装の範囲

| 項目 | 内容 | 状態 |
|---|---|---|
| `isIconUrl` / `parseIconUrls` | 項目ごとの検証。不正な項目は `errors` に記録して飛ばす。`api/icon-urls.ts`。公開 API（`api/index.ts`）には出していない | 済 |
| `useIconSet()` | `/data/icon-urls.json` を取得して検証する（`web/remoteKeys/useIconUrls.ts`）。`loadIconUrls` は失敗しても例外を投げず、`{ urls, warnings }` を返す（不正な項目は飛ばして `urls` に入れず、`warnings` に全部残す）。`useIconSet` は `ready`・描画関数・警告を返し、警告は `console.warn` にも出す。 | 済 |
| 描画 | `createGenerateTools(builtinIcons, fromUrls(map)).iconRender` を作り、`MainView`、`PreviewView`、`EditorKeyView` の `defaultIconRender` を置き換えた。エディタは、`EditorContext` の `iconRender` 経由で、`PreviewView` は `iconRender` プロパティ（省略時は標準）で受ける | 済 |
| `generate` | `--icon-urls <path>`。省略時は、入力（`-i`）と同じディレクトリの `icon-urls.json`（なければ空）。指定したのにないとき、形式が不正なときは、エラー。 | 済 |
| ドキュメント | `README.md`（アイコンの追加、`generate`、設定ファイルの表）、この文書 | 済 |
| テスト | スキーマ（`icon-urls.test.ts`）、`loadIconUrls` の404・不正・通信失敗（`useIconUrls.test.ts`）、表を足した `createGenerateTools` の描画と `hasIcon`（`utils.test.ts`）、`generate` の読み込み、`/data/icon-urls.json` の配信（`server.test.ts`）、`PreviewView`、エディタでの `icon` の保持（`editor-grid.test.ts`）、キー一覧（`editor-catalog.test.ts`）、エディタ全体を実物の `useEditorData` ごと jsdom に描画する `editor-icons.jsdom.test.tsx`（表が届くまで描かない、一覧と保存済みのキーの画像、404、不正な項目、通信失敗） | 済 |
| キー一覧（カタログ） | `createEditorCatalog(hasIcon)`（`editor-catalog.ts`。`hasIcon` は必須で、標準のアイコンだけを見る既定値は持たない）が、標準のアイコン + 表で、キーの `icon` とラベルの表示を決める。`useEditorData`（`editor-client.ts`）が `useIconSet()` の `hasIcon`（`createGenerateTools` の戻り値）から作り、`catalog` として、`iconRender`・`iconWarnings` と一緒に返す。`EditorCanvas` は props で受ける。描画は `renderCatalogIcon(entry, iconRender)` で、`EditorContext` の `iconRender` を使う（`REMOTE_ICONS` を直接引かない）。`RemoteKeyCatalogEntry.icon` は `string`。標準のアイコンがない REGZA のキー（`num1` など）も、表に同じ名前があれば、アイコンが付く。 | 済 |
| `sample-icon-urls-from-google-favicons` コマンド | `rz-remocon sample-icon-urls-from-google-favicons`（`cli/icon-urls.ts`。個人用のサンプル）。名前 → ドメインの表（`-d`。省略時は `-o` の `app-domains.json`、なければ標準のアプリキーの表）から、Google の favicon の URL を並べた `icon-urls.json` と、確認用の `icon-urls.html` を、`-o`（既定 `data`）に書き出す。画像は取得しない。`-s` で大きさ（既定 128）。テストは `icon-urls.test.ts` | 済 |
| 画面上での編集 | 下の「保留」を参照 | 保留 |

* 取得前と取得失敗のときは、標準アイコンだけで描く。
* 404 は「アイコン定義なし」として、空の表にする。`remocon.json` と違い、エラー表示にはしない。
* ファイルが読めない、JSON でない、オブジェクトでない、のいずれかのときは、空の表にして警告する。項目が不正なときは、その項目だけ飛ばして警告する。サーバー起動時の検証は行わない（`remocon.json` と同じ）。
* 不正な項目は、エディタのツールバー（`<small role="alert">`）に件数と最初の1件を出し、全件は `title` に入れる。ビューアは `console.warn` だけ（画面には出さない）。
* エディタでは、読み込んだ表で、すでにあるキーのアイコンを描画する（編集データの `icon` が名前のとき）。エディタとプレビューを、ビューアと同じ見た目にするため。
* `generate` は、不正な項目があると、項目を挙げて警告し、その項目だけ飛ばす。
* 表の読み込みが終わるまで、ビューアとエディタはキーを描かない（ビューアは `useRemoconConfig` が remocon.json と表をまとめて待つ。エディタは `useEditorData` が編集データと表をまとめて待つ）（名前のアイコンが、壊れた画像で一瞬出るのを防ぐ）。
* `generate` の既定の場所は、当初の「`data/icon-urls.json`」から、「入力と同じディレクトリ」に変えた。`-i` が既定のとき（`data/remocon.json`）は同じ場所になり、`-i` を変えたときも、その隣を見るため。（変更）
* 名前が空、または `__proto__` の項目は、エラーにして表に入れない。

### 保留

**画面上での編集（エディタでアイコンを選ぶ UI）は、今回は行わない。**

* プロパティパネルの「アイコン」の選択（「なし」、「標準の既定」、表の名前。サムネイル付き）。
* キー一覧への「カスタムアイコン」の追加。キー一覧は、REGZA のキー名と同じ名前の表の項目だけを反映する。キー名にない名前（`logo` など）は、一覧に出ない。
* エディタからの `icon-urls.json` の編集。
* 上を行わないので、アイコンの名前を `remocon.editor.json` に入れる手段は、手書きか Builder に限られる。
* `EditorKey.icon` は `string`（`EditorKey` は zod スキーマの型）。`RemoteKeyName` に限るのは、キー一覧の項目（`RemoteKeyCatalogEntry`）だけ。読み込みと保存の経路でも `icon` はそのままコピーされるので、エディタで開いて保存し直しても保持される。型を広げる必要はない。（コードの確認。保持はテストで固定する）

### 未決

* 表にない名前（`icon-urls.json` から消した名前）の扱い。今は「表にない文字列は URL」として `<img>` で描くので、壊れた画像になる。名前と URL の見分け方、エディタでの警告は、保留中の編集 UI と合わせて決める。
* 相対 URL（`/logo.svg`）の基準。`-d` の静的ディレクトリが配信している前提。`generate` の出力でも、同じ前提でよいか。
* `data/` の外のファイルを `server` に指定したい場合の `--icon-urls`。必要になるまで作らない。
* **検証を無視して読む逃げ道（オプション）を作るか。（未決）**
  * 不正な項目は、その項目だけ飛ばして残りは使うので、逃げ道がなくても、全体が使えなくなることはない。逃げ道が要るのは、`http(s)` と `data:image/` 以外のスキームを、本当に使いたいときだけ。
  * ビューアとエディタは、静的ファイルを直接 fetch するので、サーバーのオプションを渡す経路がない。作るなら、ファイルの中に設定を持たせる形になり、設計が増える。
  * `generate` だけなら、`--no-validate` のようなオプションは安く作れる。
  * 推奨は、作らない。`http(s)` と `data:image/` 以外のスキームが、実際に必要になってから決める。

## 静的リモコンの生成

`generate` CLI と `generate()` API で、`index.html` と `assets/` を作る。（済）

* ファビコン（`favicon.svg`）は `public/` に置き、ビルドで `dist/public/` に入る。生成時に `output/favicon.svg` へコピーする。（済）

## remoteKeys の整理と src/ui の分離（未）

`src/web/remoteKeys` を、将来 `src/ui` として独立させる。`gen` と `web` が `ui` を参照する構成にする。

* 循環 import の解消（`RemoteKeyIconRender` と `OnChangeCode` は `types.ts` に集約。済）
* `apiClient` を `src/web/client.ts` に移し、`useRegzaApi` と `sendCode` は `client` を引数で受ける。（済）
* 型の import は、`remoteKeys` の外からは `remoteKeys/index.ts` 経由にする。（済）
* `remoteKeys/index.ts` の境界（`ui` の入口）と、`gen/index.ts` の公開（`rz-remocon/gen`）の整理。（未・後回し）
  * `gen/index.ts` の `export * from "../web/remoteKeys"` をやめ、README に載っている名前（`fromUrls` などを含む）を明示する。
  * `remoteKeys/index.ts` の中身は増やさない。`ui` を分けるときに、部品とフックの入口を決める。
* fetch 先 URL（`/data/…`）の引数化は、やらない。既定値のまま `ui` に置く。（方針）
* `src/ui` の作成、`tsconfig` / `tsup` / `api-extractor` の対象の更新。（未）
* `src/web/remokey.ts` は残す（削除しない）。
* 確認: `npm run tsc`、`npm run test`、`npm run build`。（手元で確認済み。ただし型 import の統一後は未確認）

## キー定義の差し替え（一部）

`api` は通信の基盤であり、`rz-remocon` の基盤でもある。標準のキー定義は、そこに置く。差し替えやすくするため、データとロジックを分ける。

* データだけを `src/api/key-defs.ts` に分けた。`REMOTE_KEY_DEFS`、`REMOTE_KEY_KIND_DEFS`、`FALLBACK_KIND`（どれにも一致しないキー名の種類）。このファイルを置き換えれば、定義を差し替えられる。判定などのロジックは `remote-keys.ts` に残す。`api/index.ts` から、これまでどおり公開する。（済）
* 特殊キー（`$TAB$` と `$_LABEL$`）は、仕組みの一部なので、差し替えの対象にしない。（方針）
* 種類の判定は、キー名の接頭辞（`power*`、`vol*` など）のまま。定義を差し替えるときは、キー名を接頭辞に合わせる。（未）各キーの定義に `kind` を持たせて、接頭辞に頼らない形にするかは、必要になってから決める。
* `defineKeySet(defs, kinds)` のようなファクトリで、実行時に差し替える案。（保留）2つ目のキーセットが必要になってから設計する。`editor-catalog` と `Builder` が、キーセットを引数で受ける形にし、`Icons.tsx` の `RemoteKeyName` の型付けも見直す必要がある。
* `RemoteKeyName`（定義から作るリテラル型）に、`Icons.tsx` が依存している。定義を差し替えると、アイコンの対応表も合わせる必要がある。

## 実装禁止事項

以下は現時点では行わない。

* 既存の開発用画面の機能を壊す変更
* 実装前の仕様確認なしに大量のコンポーネント追加
* レイアウトライブラリを決めずに実装を進めること
* 暗黙的な設計変更を行うこと
* 指示のない段階でのソース修正は行わない
* モデルとして MAI-Code-1.1-Flash を用いない。

