import { mkdirSync, writeFileSync } from "node:fs";
import { RemoteKeys, remoconBuilder } from "rz-remocon/api";
import { builtinIcons, createGenerateTools, generate } from "rz-remocon/gen";

// タブで切り替えるリモコンを、Builder で組み立てて生成する。
//
//   - tab(label) でタブを配置する。最初のタブは、最初のキーより前に配置すること。
//     タブがある場合、リモコンはタブで切り替える表示になる。
//     次のタブの手前までが、そのタブに属するキーになる。
//   - label(text) で、押せないラベルを配置する。見出しや説明に使用する。
//   - spacer(w) で横に空白を空け、newline() で改行する。
//
// 実行: npm run builder:tabs   → 生成: output/tabs/
// 配信: npx rz-remocon server -p 8485 -d output/tabs

const outputDir = "output/tabs";

const { decorator, iconRender } = createGenerateTools([builtinIcons]);

const remocon = remoconBuilder({
  columns: 20, // 5キー分の幅
  background: "#0f172a",
  decorator,
})
  // タブ1: 基本
  .tab("基本", "#2563eb")
  .label("電源", { w: 20, h: 2, color: "#0f172a" })
  .newline()
  .add(RemoteKeys.powerOn)
  .add(RemoteKeys.powerOff)
  .spacer(4)
  .add(RemoteKeys.volMute)
  .newline()
  .label("音量・チャンネル", { w: 20, h: 2, color: "#0f172a" })
  .newline()
  .add(RemoteKeys.volDown)
  .add(RemoteKeys.volUp)
  .spacer(4)
  .add(RemoteKeys.chDown)
  .add(RemoteKeys.chUp)
  // タブ2: 入力切換。2つ目以降のタブは、行の途中で追加しても、自動で改行してから配置される。
  .tab("入力", "#7c3aed")
  .add(RemoteKeys.inputToggle)
  .add(RemoteKeys.inputHdmi1)
  .add(RemoteKeys.inputHdmi2)
  .add(RemoteKeys.inputHdmi3)
  .add(RemoteKeys.inputHdmi4)
  .build();

mkdirSync(outputDir, { recursive: true });
writeFileSync(
  `${outputDir}/remocon.json`,
  `${JSON.stringify({ version: 1, ...remocon }, null, 2)}\n`,
);

await generate({ remocon, outputDir, iconRender });
