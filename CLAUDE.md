# CLAUDE.md

このリポジトリは、REGZA TV を CLI / Web UI / ライブラリ経由で操作するための TypeScript プロジェクトです。

## プロジェクト概要

- 名前: `rz-remocon`
- パッケージ種別: ESM の Node.js ライブラリ / CLI
- 主要用途: REGZA TV への接続登録、認証、API 呼び出し、リモコン操作
- 実行基盤: Node.js + TypeScript + React + Vite
- サーバー基盤: Hono / @hono/node-server
- API/契約: @orpc / zod

## 主要コマンド

```bash
npm install
npm run dev          # CLI + Web の同時起動
npm run dev:web      # Vite Web UI の起動
npm run dev:server   # Hono CLI server の監視起動
npm run cli          # tsx で CLI を実行
npm run build        # build.sh によるビルド
npm run test         # Vitest 実行
npm run tsc          # TypeScript の型チェック
npm run check        # Biome によるチェックと自動整形
npm run lint         # check + tsc をまとめて実行
```

CLI の使い方は [README.md](README.md) の「CLI」「Web サーバー」を参照する。

## 依存関係の特徴

- `react`, `react-dom`: Web UI
- `vite`, `@vitejs/plugin-react`: フロントエンド開発・ビルド
- `hono`, `@hono/node-server`: Web API / server サイド
- `@orpc/*`, `zod`: API 契約とバリデーション
- `commander`: CLI
- `vitest`: テスト
- `@biomejs/biome`: lint / format
- `tsup`: バンドル
- `tsx`: TS 実行

## プロジェクト構成

ディレクトリの構成は [README.md](README.md) の「プロジェクト構成」を参照する（ここには重複して書かない）。
ビルドの流れは [docs/build.md](docs/build.md)、方針と実装状況は [docs/todo.md](docs/todo.md)。

## 変更時の注意

- TypeScript を中心に扱うため、型安全性を優先する
- CLI / Web / library の 3 層にまたがる変更が多いので、影響範囲を確認してから修正する
- 変換系コードがあるため、生成物とソースがずれないよう注意する
- `npm run check` / `npm run tsc` を実行して、lint と型安全性を確認する
- プロジェクトは `biome check --write .` を前提にしているため、フォーマットは Biome に従う

## 実装上の指針

- バックエンドとフロントエンドの境界を意識して実装する
- REGZA の接続、認証、リモコン送信の責務を `lib/` と `cli/` で整理する
- Web API は `src/api/` の contract / schema との整合に注意する
- UI 変更は `src/web/` を中心に行い、必要に応じて `src/gen/` を確認する
- 例示コードや `examples/` の利用方法を壊さないようにする

## テスト戦略

- `vitest` を使用する
- `src/cli/server.test.ts` や `src/gen/generate.test.ts`、`src/web/views/*.test.ts` などの既存テストに従う
- 機能追加時は、関連するテストの更新または追加を行う

## リリース / ビルド時の前提

- `package.json` の `exports` と `files` を踏まえ、公開 API を壊さないようにする
- `dist/` の生成物を前提にした CLI / ライブラリ利用を意識する
- ビルドは `scripts/build.sh` を通じて実行されるため、変更時はその前提を守る
- 標準のリモコンは `src/gen/default-remocon.ts` が組み立て、`build.sh` が `dist/public/data/remocon.json` に出力する（手書きの JSON は置かない）

## 重要なプロジェクトルール

- 変更は最小限で、必要な場所のみ修正する
- 既存の設計と命名規則を優先する
- Node.js ESM 環境なので、`import` / `export` を基本とする
- リポジトリの README と整合する説明を保つ
- 変更がライブラリ利用・CLI 実行・Web UI に及ぶ場合は、影響範囲を確認してから実装する

## トラブルシュート事例

現象：ドキュメント変換時に以下のような警告が出る。
WARNING: Encountered an HTML tag: "<img>". This library does not support embedded HTML content. Inner contents will be mapped as normal, but the HTML tags will be ignored.
対処：`<img>` のようにする。
