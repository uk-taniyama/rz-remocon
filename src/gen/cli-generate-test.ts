/*
 * remocon.json から静的な HTML を生成する開発用スクリプト（generateFromFile を呼び出す）。
 *
 * 目的: CLI 用インタフェースの型検証
 *   CLI（src/cli/index.ts）は、generateFromFile を動的 import（./gen.js）し、GenExport としてキャストして呼び出す。
 *   動的 import は、型もビルドの成否も、実行するまで確認できない。
 *   そのため、このスクリプトで、公開エントリ（./index）の generateFromFile を、CLI と同じ GenExport の形で受けて呼び出し、
 *   インタフェースがずれたときに、ビルドの前に tsc で検出できるようにしている。
 *   isDev は、ソースから実行（tsx）するために、出力元を dist/public に切り替える。
 *
 *   data/remocon.json ──▶ (このスクリプト) ──▶ <out>/index.html  … キーを配置済みの HTML（SSR）
 *                                             <out>/assets/index*.css … Vite が生成した CSS
 *                                             <out>/assets/remote.js  … キー送信用のスクリプト
 *
 * 使い方:
 *   npx tsx --tsconfig tsconfig.gen.json src/gen/cli-generate-test.ts [remocon.json] [出力先]
 *   （事前に npm run build を実行し、dist/public/assets/ に CSS と remote.js を生成しておく）
 *   既定: data/remocon.json → output
 *
 * 配信:
 *   npx rz-remocon server -d ./output          （/api は同じサーバーで提供するため、相対パスで呼び出せる）
 *
 * キーの配置は RemoteKeyLayout、アイコンの描画は defaultIconRender で行うため、MainView と見た目が一致する。
 * 生成した HTML には React が含まれない（HTML は renderToStaticMarkup で生成する）。
 */
import path from "node:path";
import { _generateFromFile } from "./index";
import type { GenExport } from "./types";

// CLI が動的 import の結果をキャストしている GenExport と、公開エントリの generateFromFile が一致することを、型で検証する。
const gen = { _generateFromFile } satisfies GenExport;

const [inputArg, outArg] = process.argv.slice(2);
const inputJson = path.resolve(inputArg ?? "data/remocon.json");
const outputDir = path.resolve(outArg ?? "output/");

gen._generateFromFile({
  inputJson,
  outputDir,
  isDev: true,
});
