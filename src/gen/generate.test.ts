import { describe, expect, it } from "vitest";
import { RemoteKeys, remoconBuilder, remoconConfigSchema } from "../api";
import { defaultDecorator } from "./index";

describe("generate", () => {
  it("usecase", async () => {
    const remocon = remoconBuilder({
      columns: 20, // 5キー分の幅
      background: "#0f172a",
      decorator: defaultDecorator,
    })
      .add(RemoteKeys.powerOn, { color: "#ef4444" })
      .add(RemoteKeys.btnBlue, { w: 5, h: 2 })
      .build();
    expect(remocon).toEqual({
      version: 1,
      background: "#0f172a",
      grid: {
        columns: 20,
        unit: 4,
      },
      keys: [
        {
          name: "powerOn",
          code: RemoteKeys.powerOn.code,
          color: "#ef4444",
          icon: "powerOn",
          x: 0,
          y: 0,
          w: 4,
          h: 4,
        },
        {
          name: "btnBlue",
          code: RemoteKeys.btnBlue.code,
          color: RemoteKeys.btnBlue.color,
          x: 4,
          y: 0,
          w: 5,
          h: 2,
        },
      ],
    });
  });

  it("icon は名前のまま持つので、version を付ければ remocon.json にできる", () => {
    const remocon = remoconBuilder({
      columns: 20,
      background: "#0f172a",
      decorator: defaultDecorator,
    })
      .add(RemoteKeys.powerOn)
      .addCustom("custom", "40BF7E", { icon: "https://example.com/a.png" })
      .build();

    const json = JSON.parse(JSON.stringify(remocon));

    expect(json.keys[0].icon).toBe("powerOn");
    expect(json.keys[1].icon).toBe("https://example.com/a.png");
    expect(remoconConfigSchema.safeParse(json).success).toBe(true);
  });

  it("color は decorator、overrides の順に決まり、なければ背景色になる", () => {
    const keys = remoconBuilder({ columns: 20, background: "#0f172a" })
      .add(RemoteKeys.powerOn) // decorator なし、色の指定なし → カテゴリーの色
      .add(RemoteKeys.powerOn, { color: "#123456" }) // 色の指定あり
      .add(RemoteKeys.btnBlue) // キー定義の色
      .build().keys;

    expect(keys.map((key) => key.color)).toEqual([
      "#ef4444",
      "#123456",
      RemoteKeys.btnBlue.color,
    ]);
  });

  it("標準のアイコンがないキーは、ラベルを残す", () => {
    const [key] = remoconBuilder({
      columns: 20,
      decorator: defaultDecorator,
    })
      .add(RemoteKeys.chDTT, { w: 8 })
      .build().keys;

    expect(key.label).toBe(RemoteKeys.chDTT.label);
    expect(key.icon).toBeUndefined();
  });

  it("addCustom のラベルは、overrides で指定したときだけ出る", () => {
    const keys = remoconBuilder({ columns: 20 })
      .addCustom("custom", "40BF7E")
      .addCustom("custom", "", { label: "メモ" })
      .build().keys;

    expect(keys[0].label).toBeUndefined();
    expect(keys[1].label).toBe("メモ");
  });

  it("build() の後に add() しても、返した結果は変わらない", () => {
    const builder = remoconBuilder({ columns: 20 }).add(RemoteKeys.powerOn);
    const remocon = builder.build();

    builder.add(RemoteKeys.volUp);

    expect(remocon.keys).toHaveLength(1);
  });
});
