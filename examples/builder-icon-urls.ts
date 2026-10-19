import { mkdirSync, writeFileSync } from "node:fs";
import { RemoteKeys, remoteKeysBuilder } from "rz-remocon/api";
import {
  createGenerateToolsWithUrls,
  generate,
  loadIconUrlsFile,
} from "rz-remocon/gen";

// アイコン名と画像 URL の表（icon-urls.json）を読んで、標準のアイコンに足す。
//
//   - loadIconUrlsFile(file, required): 表を読み込む。不正な項目は、警告を出して飛ばす。
//     required が false の場合、ファイルがなければ空の表を返す。
//   - createGenerateToolsWithUrls(urls): 標準のアイコンに、表を足した decorator と iconRender を、組で生成する。
//     同じ名前は、表を優先する。createGenerateTools([builtinIcons, fromUrls(urls)]) と同じ。
//
// 表は、server や generate コマンドが読む data/icon-urls.json と、同じ形式。
//
// 実行: npm run builder:icon-urls   → 生成: output/icon-urls/
// 配信: npx rz-remocon server -p 8485 -d output/icon-urls

const outputDir = "output/icon-urls";

const urls = loadIconUrlsFile("icon-urls.json", true);
const { decorator, iconRender } = createGenerateToolsWithUrls(urls);

const remocon = remoteKeysBuilder({
  columns: 20,
  background: "#0f172a",
  decorator,
})
  .add(RemoteKeys.volUp)
  // 表に載せた名前は、icon に指定する
  .addCustom("dot", "40BF10", { icon: "dot", color: "#334155" })
  .build();

mkdirSync(outputDir, { recursive: true });
writeFileSync(
  `${outputDir}/remocon.json`,
  `${JSON.stringify({ version: 1, ...remocon }, null, 2)}\n`,
);

await generate({ remocon, outputDir, iconRender });
