import { describe, expect, it } from "vitest";
import {
  isSpecialKey,
  LABEL_KEY_NAME,
  resolveRemoteKeyKindDef,
  TAB_KEY_NAME,
} from "./remote-keys";

describe("resolveRemoteKeyKindDef", () => {
  it("特殊キーは「ラベル・タブ」の種別になる", () => {
    expect(resolveRemoteKeyKindDef(TAB_KEY_NAME).kind).toBe("layout");
    expect(resolveRemoteKeyKindDef(LABEL_KEY_NAME).kind).toBe("layout");
  });

  it("どの接頭辞にも当たらない名前は、従来どおり「その他」になる", () => {
    expect(resolveRemoteKeyKindDef("custom").kind).toBe("etc");
    expect(resolveRemoteKeyKindDef("unknownName").kind).toBe("etc");
  });
});

describe("isSpecialKey", () => {
  it("$ で始まる名前は、特殊キー（タブ・ラベル）", () => {
    expect(isSpecialKey(TAB_KEY_NAME)).toBe(true);
    expect(isSpecialKey(LABEL_KEY_NAME)).toBe(true);
  });

  it("REGZA のキー名と、カスタムキーは特殊キーではない", () => {
    expect(isSpecialKey("powerOn")).toBe(false);
    expect(isSpecialKey("custom")).toBe(false);
  });
});
