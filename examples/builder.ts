import { mkdirSync, writeFileSync } from "node:fs";
import { RemoteKeys, remoconBuilder } from "rz-remocon/api";
import {
  builtinIcons,
  createGenerateTools,
  fromUrls,
  generate,
} from "rz-remocon/gen";

// Builder でリモコンを組み立て、静的なリモコン（output/）を生成する。
//
//   1. remoconBuilder でキーを並べる（座標と寸法はセル単位。1キー = 4セル）
//   2. build() の結果に version を付けて、remocon.json として保存する
//   3. build() の結果を generate() に渡して、index.html と assets/ を生成する
//
// 実行: npm run builder   → 生成: output/
// 配信: npx rz-remocon server -p 8485 -d output

const outputDir = "output";

// アイコンセットから、decorator（Builder 用）と iconRender（generate 用）を、組で生成する。
// 組で生成すると、Builder が設定するアイコン名と、generate が描画するアイコンがずれない。
// 別のアイコンセットを使用する場合は、fromComponents(...) で IconSet にして、配列の後ろに追加する
// （builder-icons.ts を参照）。
const { decorator, iconRender } = createGenerateTools([
  builtinIcons,
  fromUrls({ custom: "https://example.com/icon.svg" }),
]);

const remocon = remoconBuilder({
  columns: 20, // 5キー分の幅
  background: "#0f172a",
  decorator,
})
  // 1行目: 電源と入力切換。間を2キー分空ける
  .add(RemoteKeys.powerOn, { color: "#ef4444" })
  .spacer(8)
  .add(RemoteKeys.inputToggle)
  .newline()
  // 2行目: 音量とチャンネル（標準のアイコンだけで表示する）
  .add(RemoteKeys.volDown)
  .add(RemoteKeys.volMute)
  .add(RemoteKeys.volUp)
  .add(RemoteKeys.chDown)
  .add(RemoteKeys.chUp)
  .newline()
  // 3行目: 標準のアイコンがないキーは、ラベルが表示される。幅は2キー分
  .add(RemoteKeys.chDTT, { w: 8 })
  .add(RemoteKeys.appYoutube)
  .add(RemoteKeys.keyHome)
  .newline()
  // 4行目: カタログにないキー。画像 URL のアイコンを持つキーと、押せないラベルだけのキー
  .addCustom("custom", "40BF7E", { icon: "custom", color: "#22c55e" })
  .addCustom("custom", "", { label: "メモ", w: 16, h: 2, color: "#334155" })
  .build();

mkdirSync(outputDir, { recursive: true });
writeFileSync(
  `${outputDir}/remocon.json`,
  `${JSON.stringify({ version: 1, ...remocon }, null, 2)}\n`,
);

await generate({
  remocon,
  outputDir,
  // 独自の React コンポーネントをアイコンにする場合は、fromComponents で IconSet にして
  // createGenerateTools の配列に追加する（builder-icons.ts を参照）。
  iconRender,
});
