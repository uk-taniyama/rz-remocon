/*
 * REGZA の標準のキー定義。
 *
 * - キーの種類は、キー名の接頭辞（prefix）で決まる。
 * - FALLBACK_KIND は、REMOTE_KEY_KIND_DEFS のいずれかの kind と一致させる（一致しないと、読み込み時にエラーになる）。
 */
import type { RemoteKeyDef, RemoteKeyKindDef } from "./key-types";

/**
 * REGZA のリモコンキーの定義（キー名から code とラベルへの対応表）。
 *
 * - 異なるキーが同じ code を持つ場合があるが、これは意図的な定義である。
 *   例: keyLeft2 と mediaBack10s、keyRight2 と mediaSkip30s は code を共有する。
 * - code の重複は不具合ではないため、重複の検出や統合は行わない。
 */
export const REMOTE_KEY_DEFS = {
  // power
  powerOn: { code: "40BF7E", label: "電源ON" },
  powerOff: { code: "40BF7F", label: "電源OFF" },
  powerToggle: { code: "40BF12", label: "電源" },
  powerSleep: { code: "40BF17", label: "オフタイマー" },

  // volume
  volMute: { code: "40BF10", label: "消音" },
  volUp: { code: "40BF1A", label: "音量＋" },
  volDown: { code: "40BF1E", label: "音量ー" },

  // channel
  chUp: { code: "40BF1B", label: "チャンネル上" },
  chDown: { code: "40BF1F", label: "チャンネル下" },
  chDTT: { code: "40BF7A", label: "地デジ" },
  chBS: { code: "40BF7C", label: "BS" },
  chCS: { code: "40BF7D", label: "CS" },
  ch4K: { code: "40BE7C", label: "4K" },
  chToggle: { code: "40BF79", label: "放送切替" } /* 地デジ → BS → CS → 4K */,
  chNumber: { code: "40BF60", label: "Ch番号入力" },

  // program
  pgDesc: { code: "40BF71", label: "番組説明" },
  pgGGuide: { code: "40BF6D", label: "Gガイド" },
  pgInfo: { code: "40BF33", label: "チャンネル情報" },
  pgAudio: { code: "40BF13", label: "音声切換" },
  pgDisplay: { code: "40BF1C", label: "画面表示" },
  pgGuide: { code: "40BE64", label: "番組ガイド" },
  pgTable: { code: "40BF6E", label: "番組表" },
  pgPastTable: { code: "40BE35", label: "過去番組表" },

  // number
  num0: { code: "40BF00", label: "0" },
  num1: { code: "40BF01", label: "1" },
  num2: { code: "40BF02", label: "2" },
  num3: { code: "40BF03", label: "3" },
  num4: { code: "40BF04", label: "4" },
  num5: { code: "40BF05", label: "5" },
  num6: { code: "40BF06", label: "6" },
  num7: { code: "40BF07", label: "7" },
  num8: { code: "40BF08", label: "8" },
  num9: { code: "40BF09", label: "9" },
  num10: { code: "40BF0A", label: "10" },
  num11: { code: "40BF0B", label: "11" },
  num12: { code: "40BF0C", label: "12" },

  // input
  inputToggle: { code: "40BF0F", label: "入力切換" },
  inputHdmi1: { code: "40BE37", label: "HDMI1" },
  inputHdmi2: { code: "40BE38", label: "HDMI2" },
  inputHdmi3: { code: "40BE39", label: "HDMI3" },
  inputHdmi4: { code: "40BE3A", label: "HDMI4" },

  // media
  mediaJumpStart: { code: "40BE47", label: "始めにジャンプ" },
  mediaSceneList: { code: "40BE4D", label: "シーンリスト" },
  mediaSubTitle: { code: "43BC52", label: "字幕" },
  mediaRewind: { code: "40BE2C", label: "早戻し" }, // <<
  mediaPlay: { code: "40BE2D", label: "再生" },
  mediaFastForward: { code: "40BE2E", label: "早送り" }, // >>
  mediaPrev: { code: "40BE27", label: "前チャプター" }, // |<<
  mediaStop: { code: "40BE2B", label: "停止" }, // □
  mediaPause: { code: "40BF50", label: "一時停止" }, // ||
  mediaNext: { code: "40BE26", label: "次チャプター" }, // >>|
  mediaBack10s: { code: "40BE22", label: "10秒戻し" },
  mediaSkip30s: { code: "40BE23", label: "30sec送り" },
  mediaRecord: { code: "40BF86", label: "録画" },

  // button
  btnBlue: { code: "40BF73", label: "青", color: "#2563eb", showLabel: false },
  btnRed: { code: "40BF74", label: "赤", color: "#dc2626", showLabel: false },
  btnGreen: { code: "40BF75", label: "緑", color: "#16a34a", showLabel: false },
  btnYellow: {
    code: "40BF76",
    label: "黄",
    color: "#facc15",
    showLabel: false,
  },

  // app
  appYoutube: { code: "40BF2F", label: "Youtube" },
  appAmazonPrime: { code: "40BFDE", label: "Amazon Prime" },
  appWowow: { code: "40BF93", label: "Wowow" },
  appNhkOne: { code: "40BF94", label: "NHK+" },
  appTver: { code: "40BF95", label: "TVer" },
  appDisneyPlus: { code: "40BF96", label: "Disney+" },
  appNetVision: { code: "40BF97", label: "Net Vision" },
  appHulu: { code: "40BF98", label: "Hulu" },
  appAbema: { code: "40BF99", label: "Abema" },
  appDazn: { code: "40BF9A", label: "DAZN" },
  appLemino: { code: "40BF9C", label: "Lemino" },
  appNetflix: { code: "40BF9D", label: "NETFLIX" },
  appFod: { code: "40BF9E", label: "FOD" },

  // key
  keyUp: { code: "40BF3E", label: "上" },
  keyDown: { code: "40BF3F", label: "下" },
  keyLeft: { code: "40BF5F", label: "左" },
  keyRight: { code: "40BF5B", label: "右" },
  keyEnter: { code: "40BF3D", label: "決定" },
  keyBack: { code: "40BF3B", label: "戻る" },
  keyExit: { code: "40BF3C", label: "終了" },
  keyUp2: { code: "40BE20", label: "PgUp" },
  keyDown2: { code: "40BE21", label: "PgDown" },
  keyLeft2: { code: "40BE22", label: "PgLeft" },
  keyRight2: { code: "40BE23", label: "PgRight" },
  keyHome: { code: "40BFC4", label: "ホーム" },

  // etc
  etcRegzaNavi: { code: "40BE34", label: "レグザナビ" },
  etcSmartAccess: { code: "40BE4C", label: "ざんまい" },
  etcRecList: { code: "40BE28", label: "録画リスト" },
  etcNews: { code: "40BE29", label: "今すぐニュース" },
  etcDdata: { code: "43BC14", label: "dデータ" },
  etcAllCh: { code: "40BF26", label: "丸ごとチャンネル" },
  etcSetting: { code: "40BFD0", label: "設定" },
  etcSubMenu: { code: "40BF27", label: "サブメニュー" },
  // Hybridcast に関連し、別の仕組みが動作するとされるが、詳細は不明。
  etcDualScreen: { code: "40BF29", label: "二画面" },
} as const satisfies Record<string, RemoteKeyDef>;

export type RemoteKeyName = keyof typeof REMOTE_KEY_DEFS;

export const REMOTE_KEY_KIND_DEFS = [
  { kind: "power", prefix: "power", label: "電源", color: "#ef4444" },
  { kind: "volume", prefix: "vol", label: "音量", color: "#f59e0b" },
  { kind: "channel", prefix: "ch", label: "チャンネル", color: "#10b981" },
  { kind: "program", prefix: "pg", label: "番組", color: "#6366f1" },
  { kind: "number", prefix: "num", label: "数字", color: "#0ea5e9" },
  { kind: "input", prefix: "input", label: "入力切替", color: "#8b5cf6" },
  { kind: "media", prefix: "media", label: "メディア", color: "#ec4899" },
  { kind: "button", prefix: "btn", label: "ボタン", color: "#0094ff" },
  { kind: "app", prefix: "app", label: "アプリ", color: "#000000" },
  { kind: "key", prefix: "key", label: "キー", color: "#64748b" },
  { kind: "etc", prefix: "etc", label: "その他", color: "#94a3b8" },
  { kind: "layout", prefix: "$", label: "レイアウト", color: "#475569" },
] as const satisfies readonly RemoteKeyKindDef[];

export type RemoteKeyKind = (typeof REMOTE_KEY_KIND_DEFS)[number]["kind"];

/** どの接頭辞にも一致しないキー名に使う種類。 */
export const FALLBACK_KIND: RemoteKeyKind = "etc";
