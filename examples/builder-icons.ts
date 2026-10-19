import { mkdirSync, writeFileSync } from "node:fs";
import { createElement, type CSSProperties } from "react";
import { RemoteKeys, remoteKeysBuilder } from "rz-remocon/api";
import {
  builtinIcons,
  createGenerateTools,
  fromComponents,
  fromUrls,
  generate,
} from "rz-remocon/gen";

// アイコンに名前を付けて追加する。
//
//   - fromComponents: React コンポーネントのアイコン（style を受け取るもの）
//   - fromUrls:       画像 URL のアイコン
//   - builtinIcons:   標準のアイコン。同じ名前がある場合は、後ろに追加したセットを優先する。
//
// createGenerateTools に配列で渡したセットから、Builder 用の decorator と、
// generate 用の iconRender が、組で生成される。
//
// 実行: npm run builder:icons   → 生成: output/icons/
// 配信: npx rz-remocon server -p 8485 -d output/icons

const outputDir = "output/icons";

// 自作のアイコン（SVG）。
// 大きさは枠で決まり、色は文字色（currentColor）に従う。
function Star({ style }: { style?: CSSProperties }) {
  return createElement(
    "svg",
    { viewBox: "0 0 24 24", style },
    createElement("path", {
      fill: "currentColor",
      d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    }),
  );
}

// 画像 URL のアイコン。
// ここでは、埋め込みの SVG（data URI）を使用する。
const dot =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#facc15"/></svg>',
  );

const { decorator, iconRender } = createGenerateTools([
  builtinIcons,
  fromComponents({ star: Star }),
  fromUrls({ dot }),
]);

const remocon = remoteKeysBuilder({
  columns: 20,
  background: "#0f172a",
  decorator,
})
  // 標準のアイコン
  .add(RemoteKeys.volUp)
  // 名前を付けて登録したアイコンは、icon にその名前を指定する
  .addCustom("fav", "40BF10", { icon: "star", color: "#f59e0b" })
  .addCustom("dot", "40BF10", { icon: "dot", color: "#334155" })
  .build();

mkdirSync(outputDir, { recursive: true });
writeFileSync(
  `${outputDir}/remocon.json`,
  `${JSON.stringify({ version: 1, ...remocon }, null, 2)}\n`,
);

await generate({ remocon, outputDir, iconRender });
