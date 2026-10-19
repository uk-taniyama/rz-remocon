import { describe, expect, it } from "vitest";
import {
  readableTextColor,
  relativeLuminance,
  TEXT_COLOR_LUMINANCE_THRESHOLD,
} from "./contrast";

describe("relativeLuminance", () => {
  it("白は 1、黒は 0", () => {
    expect(relativeLuminance("#ffffff")).toBeCloseTo(1, 3);
    expect(relativeLuminance("#000000")).toBeCloseTo(0, 3);
  });
});

describe("readableTextColor（閾値 0.6）", () => {
  it("薄い色（L > 0.6）には黒", () => {
    expect(readableTextColor("#ffffff")).toBe("#000000");
    expect(readableTextColor("#e2e8f0")).toBe("#000000");
    expect(readableTextColor("#39ff88")).toBe("#000000");
  });

  it("濃い色と中間の色（L ≤ 0.6）には白", () => {
    expect(readableTextColor("#000000")).toBe("#ffffff");
    expect(readableTextColor("#0f172a")).toBe("#ffffff");
    expect(readableTextColor("#ef4444")).toBe("#ffffff");
    expect(readableTextColor("#faad14")).toBe("#ffffff");
    expect(readableTextColor("#84cc16")).toBe("#ffffff");
  });
});

describe("readableTextColor（閾値を引数で渡す）", () => {
  it("閾値を下げると、同じ色でも黒になる", () => {
    // #faad14 は L ≈ 0.503。閾値が 0.5 の場合は黒、0.6 の場合は白になる。
    expect(readableTextColor("#faad14", 0.5)).toBe("#000000");
    expect(readableTextColor("#faad14", 0.6)).toBe("#ffffff");
  });

  it("引数を省くと、既定の閾値（0.6）を使う", () => {
    expect(readableTextColor("#faad14")).toBe(
      readableTextColor("#faad14", TEXT_COLOR_LUMINANCE_THRESHOLD),
    );
  });
});
