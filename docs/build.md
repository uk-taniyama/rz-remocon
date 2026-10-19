# ビルドとドキュメント生成

`npm run build`（= `scripts/build.sh`）の流れをまとめる。
前半で配布物（`dist/`）を作り、後半で API リファレンス（`refs/`）を生成する。

- 中間生成物は `work/` に出力する（毎回消す。コミットしない）。
- `dist/` も毎回消して作り直す。

## 全体の流れ

```text
rm -rf work dist
 │
 ├─ 1. バンドル            tsup / vite build / default-remocon / remote.js
 ├─ 2. 型宣言の生成        tsc → work/dts, work/dts-gen
 ├─ 3. patch-dts PH1       内部参照を仮パッケージ名へ
 ├─ 4. API Extractor ×3    work/doc/*.api.json と dist/*.d.ts
 ├─ 5. patch-dts PH2       仮パッケージ名を実名へ
 ├─ 6. typedoc             work/typedoc/docs.json
 └─ 7. generate-docs.ts    refs/*.md
```

## 1. バンドル

| コマンド | 内容 |
| --- | --- |
| `tsup` | `index`（lib）/ `cli` / `api` を `dist/` に出力。`gen` は別設定（minify、`tsconfig.gen.json`）で出力する。 |
| `vite build` | Web UI を `dist/public/` に出力する。 |
| `tsx --tsconfig tsconfig.gen.json src/gen/default-remocon.ts dist/public/data` | 標準のリモコン（`remocon.json`）を `dist/public/data/` に出力する。 |
| `cp scripts/remote.js dist/public/assets/` | `remote.js` を配信用の assets にコピーする。 |

## 2. 型宣言の生成

| コマンド | 出力 | 対象 |
| --- | --- | --- |
| `tsc -p tsconfig.dts.json` | `work/dts/` | `src/lib`, `src/api`, `src/cli` |
| `tsc -p tsconfig.dts.gen.json` | `work/dts-gen/` | `src/gen/index.ts` |

どちらも `emitDeclarationOnly`。

## 3. patch-dts PH1

```sh
npx tsx src/tools/patch-dts.ts PH1 $(find work/ -name '*.d.ts')
```

`work/` 配下の `.d.ts` で、api への内部の相対パス（`"../api"`、`"../../api"`）を仮パッケージ名 `"rz-remocon-api"` に置換する。

- lib / gen から api の型を参照する箇所を、API Extractor に「外部パッケージの参照」として認識させるため。
- `/` を含む名前（`rz-remocon/api`）だと `ae-forgotten-export` になり、パッケージとして認識されないので、仮にハイフン区切りにしている。

## 4. API Extractor

```sh
api-extractor run --local -c api-extractor.lib.json
api-extractor run --local -c api-extractor.api.json
api-extractor run --local -c api-extractor.gen.json
```

`api-extractor.shared.json` を共通設定とし、各設定が継承する。

| 設定 | エントリ | docModel（`work/doc/`） | dtsRollup（`dist/`） |
| --- | --- | --- | --- |
| lib | `work/dts/lib/index.d.ts` | `index.api.json` | `index.d.ts` |
| api | `work/dts/api/index.d.ts` | `api.api.json` | `api.d.ts` |
| gen | `work/dts-gen/gen/index.d.ts` | `gen.api.json` | `gen.d.ts` |

`dist/*.d.ts` は公開用の型定義になる。

## 5. patch-dts PH2

```sh
npx tsx src/tools/patch-dts.ts PH2 $(find dist/ -name '*.d.ts')
```

`dist/` 配下の `.d.ts` で、仮パッケージ名 `'rz-remocon-api'` を実パッケージ名 `'rz-remocon/api'` に戻す。

## 6. typedoc

```sh
cd typedoc
[ -d node_modules ] || npm i
npm run gen
```

`typedoc/` は独立した npm プロジェクト（`typedoc.json` で lib / api / gen の `index.ts` を対象にする）。
`work/typedoc/docs.json` を出力する。用途は **ソース位置（ファイル名と行）の取得だけ**で、Markdown は作らない。

## 7. generate-docs.ts

```sh
# generate-docs.ts <api-json-dir> <typedoc-json> <work-dir> <out-dir>
npx tsx src/tools/generate-docs.ts work/doc work/typedoc/docs.json work/gen-docs refs
```

| 引数 | 内容 | build.sh での値 |
| --- | --- | --- |
| `api-json-dir` | API Extractor の `.api.json` があるディレクトリ | `work/doc` |
| `typedoc-json` | typedoc の JSON 出力 | `work/typedoc/docs.json` |
| `work-dir` | 中間生成物の出力先 | `work/gen-docs` |
| `out-dir` | Markdown の出力先 | `refs` |

引数が 4 つでない場合は usage を表示して終了コード 1 で終わる。
出力先のディレクトリはスクリプトが作成する。

### 処理の流れ

1. **`convertApiJson`**（`src/tools/api-json.ts`）
   `work/doc` の `.api.json` を読み、`work/gen-docs/converted/` に出力する。
   - api / gen のパッケージ名を `rz-remocon-api` / `rz-remocon-gen` に置換する。
   - lib と api の公開項目から `dict.json`（`"pkg/名前"` → canonicalReference）を作る。
   - gen 側で `!unknown` になっている参照を `dict` で解決する。
2. **`loadSourceDict`**（`src/tools/typedoc.ts`）
   typedoc の `docs.json` から `"pkg/名前"` → ソース位置の辞書を作る。
   - `converted/sourceDict.json` に保存する。
   - キーが重複した場合は警告し、先に出たものを使う。
3. **`generateApiDocsMd`**（`src/tools/api-docs.ts`）
   - `@fluid-tools/api-markdown-documenter` でドキュメントツリー（mdast）を作る。
     - ファイルをモジュール単位で一つの `markdown` にする。
   - `patchDocument` で次の加工をする。
     - h3 見出しをソースへのリンク（`../../src/<file>#L<line>`）にする。
     - 表の Description セルを短縮する。
     - 長い `Type` / `Return type` 段落（zod 型、`@orpc/contract` 型、180 文字超）を消す。空になった Returns 見出しも消す。
   - Markdown にレンダリングする。
     - `patchMarkdown` でパッケージ名を `rz-remocon/api`、`rz-remocon/gen` に戻す。
     - `refs/` に保存する。

### 中間生成物

| パス | 内容 |
| --- | --- |
| `work/doc/*.api.json` | API Extractor の出力（変換前） |
| `work/typedoc/docs.json` | typedoc の出力 |
| `work/gen-docs/converted/` | 変換後の `.api.json`、`dict.json`、`sourceDict.json` |
| `work/gen-docs/documents/` | `documents.json`（加工前）と `documents.patched.json`（加工後）。デバッグ用。 |

## 関連ファイル

- `scripts/build.sh`
- `tsup.config.ts`
- `tsconfig.dts.json` / `tsconfig.dts.gen.json`
- `api-extractor.*.json`
- `typedoc/typedoc.json`
- `src/tools/`（`patch-dts.ts` / `generate-docs.ts` / `api-json.ts` / `api-docs.ts` / `typedoc.ts` / `utils.ts`）
