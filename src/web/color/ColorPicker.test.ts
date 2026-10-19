import { describe, expect, it } from "vitest";
import { hexColorSchema } from "../../api";
import { normalizeHexColor } from "./ColorPicker";

describe("normalizeHexColor", () => {
  it("3桁の HEX を6桁に展開する", () => {
    expect(normalizeHexColor("#abc")).toBe("#aabbcc");
    expect(normalizeHexColor("#FFF")).toBe("#FFFFFF");
  });

  it("6桁はそのまま返す", () => {
    expect(normalizeHexColor("#0094ff")).toBe("#0094ff");
  });

  it("展開した結果は、保存形式（#RRGGBB）を満たす", () => {
    expect(hexColorSchema.safeParse(normalizeHexColor("#fff")).success).toBe(
      true,
    );
  });
});
