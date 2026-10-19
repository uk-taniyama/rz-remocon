/*
 * 標準のリモコン設定（remocon.json）を、Builder で組み立てる。
 *
 * data/remocon.json（エディタで保存したもの）が存在しない場合に、サーバーが代わりに返す。
 * サーバーは /data/* を data/ から先に探し、見つからなければ public の中から探す。
 * そのため、ビルド時に dist/public/data/remocon.json として出力しておけば、
 * 保存するまでは標準のリモコンが表示される。
 *
 * 使い方（build.sh から呼び出される）:
 *   npx tsx --tsconfig tsconfig.gen.json src/gen/default-remocon.ts [出力先]
 *   既定: dist/public/data → <出力先>/remocon.json
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createColorResolver,
  mergeColorMap,
  RemoteKeys,
  remoteKeysBuilder,
} from "../api";
import {
  createGenerateToolsWithUrls,
  loadColorMapFile,
  loadIconUrlsFile,
} from "./index";

const BACKGROUND = "#0f172a";

const tools = createGenerateToolsWithUrls(
  loadIconUrlsFile("data/icon-urls.json", false),
  createColorResolver(
    mergeColorMap(loadColorMapFile("data/color-map.json", false)),
  ),
);

/**
 * 標準のリモコンを組み立てるビルダー。1キー = 4セル、幅は5キー分（20セル）。
 *
 * タブ: 基本 / 放送 / 番組 / 再生
 * 配置: 1行5キーを基本に、意味のまとまりごとに行を分ける。
 * 十字キーと数字キーは、行の途中に空き（spacer）を入れて、形になるように配置する。
 */
const builder = remoteKeysBuilder({
  columns: 20,
  background: BACKGROUND,
  decorator: tools.decorator,
})
  // 基本: 電源、入力切替、音量、チャンネル、十字キーとページ送り（PgUp / PgDown など）、戻る・ホーム・設定
  .tab("基本")
  .add(RemoteKeys.powerOn, { showLabel: true })
  .add(RemoteKeys.powerOff, { showLabel: true })
  .add(RemoteKeys.powerToggle)
  .add(RemoteKeys.powerSleep)
  .add(RemoteKeys.inputToggle)
  .newline()
  .add(RemoteKeys.volDown)
  .add(RemoteKeys.volMute)
  .add(RemoteKeys.volUp)
  .add(RemoteKeys.chDown)
  .add(RemoteKeys.chUp)
  .newline()
  .spacer(4)
  .add(RemoteKeys.keyUp2)
  .add(RemoteKeys.keyUp)
  .newline()
  .add(RemoteKeys.keyLeft2)
  .add(RemoteKeys.keyLeft)
  .add(RemoteKeys.keyEnter)
  .add(RemoteKeys.keyRight)
  .add(RemoteKeys.keyRight2)
  .newline()
  .spacer(4)
  .add(RemoteKeys.keyDown2)
  .add(RemoteKeys.keyDown)
  .newline()
  .add(RemoteKeys.keyBack, { showLabel: true })
  .add(RemoteKeys.keyHome, { showLabel: true })
  .add(RemoteKeys.keyExit, { showLabel: true })
  .add(RemoteKeys.etcSetting, { showLabel: true })
  .add(RemoteKeys.etcSubMenu, { showLabel: true })

  // 放送: 放送の切替、HDMI 入力、数字キー（3列）
  .tab("放送")
  .add(RemoteKeys.chDTT)
  .add(RemoteKeys.chBS)
  .add(RemoteKeys.chCS)
  .add(RemoteKeys.ch4K)
  .add(RemoteKeys.chToggle)
  .newline()
  .add(RemoteKeys.inputHdmi1)
  .add(RemoteKeys.num1)
  .add(RemoteKeys.num2)
  .add(RemoteKeys.num3)
  .newline()
  .add(RemoteKeys.inputHdmi2)
  .add(RemoteKeys.num4)
  .add(RemoteKeys.num5)
  .add(RemoteKeys.num6)
  .newline()
  .add(RemoteKeys.inputHdmi3)
  .add(RemoteKeys.num7)
  .add(RemoteKeys.num8)
  .add(RemoteKeys.num9)
  .newline()
  .add(RemoteKeys.inputHdmi4)
  .add(RemoteKeys.num10)
  .add(RemoteKeys.num11)
  .add(RemoteKeys.num12)
  .newline()
  .spacer(4)
  .add(RemoteKeys.chNumber)
  .add(RemoteKeys.num0)

  // 番組: 番組表、番組の情報、データ放送（dボタン・色ボタン）、REGZA の機能
  .tab("番組")
  .add(RemoteKeys.pgTable)
  .add(RemoteKeys.pgPastTable)
  .add(RemoteKeys.pgGuide, { showLabel: true })
  .add(RemoteKeys.pgGGuide)
  .add(RemoteKeys.etcAllCh)
  .newline()
  .add(RemoteKeys.pgInfo, { showLabel: true })
  .add(RemoteKeys.pgDesc)
  .add(RemoteKeys.pgAudio, { showLabel: true })
  .add(RemoteKeys.pgDisplay, { showLabel: true })
  .add(RemoteKeys.mediaSubTitle)
  .newline()
  .add(RemoteKeys.etcDdata)
  .add(RemoteKeys.btnBlue)
  .add(RemoteKeys.btnRed)
  .add(RemoteKeys.btnGreen)
  .add(RemoteKeys.btnYellow)
  .newline()
  .add(RemoteKeys.etcRegzaNavi)
  .add(RemoteKeys.etcSmartAccess)
  .add(RemoteKeys.etcRecList)
  .add(RemoteKeys.etcNews)
  .add(RemoteKeys.etcDualScreen)

  // 再生: 再生の操作、チャプター、録画、各種アプリ（キーの色は背景色にそろえる）
  .tab("再生")
  .add(RemoteKeys.mediaPrev)
  .add(RemoteKeys.mediaRewind)
  .add(RemoteKeys.mediaPlay)
  .add(RemoteKeys.mediaFastForward)
  .add(RemoteKeys.mediaNext)
  .newline()
  .add(RemoteKeys.mediaJumpStart)
  .add(RemoteKeys.mediaBack10s)
  .add(RemoteKeys.mediaStop)
  .add(RemoteKeys.mediaPause)
  .add(RemoteKeys.mediaSkip30s)
  .newline()
  .add(RemoteKeys.mediaSceneList, { showLabel: true })
  .add(RemoteKeys.mediaRecord)
  .newline()
  .newline()
  .add(RemoteKeys.appYoutube, { color: BACKGROUND })
  .add(RemoteKeys.appNetflix, { color: BACKGROUND })
  .add(RemoteKeys.appAmazonPrime, { color: BACKGROUND })
  .add(RemoteKeys.appTver, { color: BACKGROUND })
  .add(RemoteKeys.appDisneyPlus, { color: BACKGROUND })
  .newline()
  .add(RemoteKeys.appHulu, { color: BACKGROUND })
  .add(RemoteKeys.appAbema, { color: BACKGROUND })
  .add(RemoteKeys.appDazn, { color: BACKGROUND })
  .add(RemoteKeys.appLemino, { color: BACKGROUND })
  .add(RemoteKeys.appFod, { color: BACKGROUND })
  .newline()
  .add(RemoteKeys.appWowow, { color: BACKGROUND })
  .add(RemoteKeys.appNhkOne, { color: BACKGROUND })
  .add(RemoteKeys.appNetVision, { color: BACKGROUND });

/**
 * 標準のリモコンを、編集用の <outDir>/remocon.editor.json として書き出す。
 *
 * @param outDir - 出力先のディレクトリ。存在しない場合は作成する。
 * @returns 書き出したファイルのパス。
 */
export function writeDefaultRemoconEditorJson(outDir: string): string {
  const file = path.join(path.resolve(outDir), "remocon.editor.json");
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(builder.buildEditor(), null, 2)}\n`);
  return file;
}

/**
 * 標準のリモコンを、表示用の <outDir>/remocon.json として書き出す。
 *
 * @param outDir - 出力先のディレクトリ。存在しない場合は作成する。
 * @returns 書き出したファイルのパス。
 */
export function writeDefaultRemoconJson(outDir: string): string {
  const file = path.join(path.resolve(outDir), "remocon.json");
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(builder.build(), null, 2)}\n`);
  return file;
}

// 直接実行した場合にのみ書き出す（テストから import した場合は書き出さない）。
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [outArg = "dist/public/data"] = process.argv.slice(2);
  console.log(`generate ${writeDefaultRemoconJson(outArg)}`);
  console.log(`generate ${writeDefaultRemoconEditorJson(outArg)}`);
}
