import { mkdirSync, writeFileSync } from "node:fs";
import { RemoteKeys, remoteKeysBuilder } from "rz-remocon/api";
import { builtinIcons, createGenerateTools } from "rz-remocon/gen";

// Builder で組み立てたリモコンを、エディタで編集できる形（data/）で保存する。
//
//   - build():       表示用の設定。remocon.json の形（version を付けて保存する）。
//   - buildEditor(): 編集用の設定。remocon.editor.json の形。キーに id（k1、k2、...）が付く。
//
// 2 つとも保存すると、エディタで開いて編集を続けられる。
// 保存先は server の既定の data/（-D で変更できる）。
//
// ラベルの扱い（showLabel）:
//   - decorator がアイコンを付けたキーは、showLabel が false になり、アイコンだけを表示する。
//     build() では label が省かれ、buildEditor() では label の文字列が残る。
//   - overrides に label だけを指定すると、その文字列を表示する。
//
// 実行: npm run builder:editor   → 生成: data/remocon.json, data/remocon.editor.json
// 編集: npx rz-remocon server -p 8485 → http://localhost:8485/editor.html

const dataDir = "data";

const { decorator } = createGenerateTools([builtinIcons]);

const builder = remoteKeysBuilder({
  columns: 20,
  background: "#0f172a",
  decorator,
})
  .add(RemoteKeys.powerOn)
  .add(RemoteKeys.volUp)
  // アイコンのあるキーでも、label を指定すると、その文字列を表示する
  .add(RemoteKeys.volDown, { label: "音量−" })
  .newline()
  // 押せないラベルだけのキー
  .label("メモ", { w: 20, h: 2, color: "#334155" });

mkdirSync(dataDir, { recursive: true });
writeFileSync(
  `${dataDir}/remocon.json`,
  `${JSON.stringify({ version: 1, ...builder.build() }, null, 2)}\n`,
);
writeFileSync(
  `${dataDir}/remocon.editor.json`,
  `${JSON.stringify(builder.buildEditor(), null, 2)}\n`,
);
console.log(`write ${dataDir}/remocon.json, ${dataDir}/remocon.editor.json`);
