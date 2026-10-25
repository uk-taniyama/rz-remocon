import { describe, expect, it } from "vitest";
import {
  type RemoteKeyDecorator,
  type RemoteKeyDraft,
  remoconBuilder,
} from "./builder";
import {
  isSpecialKey,
  LABEL_KEY_NAME,
  RemoteKeys,
  resolveRemoteKeyKindDef,
  TAB_KEY_NAME,
} from "./remote-keys";
import { editorRemoconConfigSchema } from "./schema";
import { toRemoconConfig } from "./utils";

describe("RemoconBuilder.tab()", () => {
  const builder = () => remoconBuilder({ columns: 20, unit: 4 });

  it("途中の行でも、自動で改行してから置く（全幅・1キー高さ）", () => {
    const { keys } = builder()
      .tab("メイン")
      .add(RemoteKeys.powerOn)
      .tab("録画")
      .build();

    expect(keys[2]).toMatchObject({
      name: TAB_KEY_NAME,
      label: "録画",
      x: 0,
      y: 8,
      w: 20,
      h: 4,
    });
  });

  it("タブの後のキーは、次の行の左端から始まる", () => {
    const { keys } = builder().tab("メイン").add(RemoteKeys.powerOn).build();

    expect(keys[1]).toMatchObject({ x: 0, y: 4 });
  });

  it("最初のタブが、キーの後にあるとエラーになる", () => {
    expect(() => builder().add(RemoteKeys.powerOn).tab("メイン")).toThrow(
      Error,
    );
  });

  it("最初のタブの後なら、2つ目以降のタブは途中に置ける", () => {
    expect(() =>
      builder().tab("メイン").add(RemoteKeys.powerOn).tab("録画"),
    ).not.toThrow();
  });

  it("色を省くと、エディタと同じ既定色（背景色ではない）になる", () => {
    const { keys, background } = builder().tab("メイン").build();

    expect(keys[0].color).toBe(resolveRemoteKeyKindDef(TAB_KEY_NAME).color);
    expect(keys[0].color).not.toBe(background);
  });

  it("色を指定すると、その色になる", () => {
    const { keys } = builder().tab("メイン", "#123456").build();

    expect(keys[0].color).toBe("#123456");
  });
});

describe("RemoconBuilder（特殊キーのガード）", () => {
  it("addCustom で $ の名前は作れない", () => {
    expect(() =>
      remoconBuilder({ columns: 20 }).addCustom("$TAB$", "", {
        label: "x",
      }),
    ).toThrow("不正な名前です");
  });

  it("label() は、コードのないラベルキーを置く", () => {
    const { keys } = remoconBuilder({ columns: 20, unit: 4 })
      .label("メモ", { w: 8 })
      .build();

    expect(keys[0]).toMatchObject({
      name: LABEL_KEY_NAME,
      label: "メモ",
      code: undefined,
      x: 0,
      y: 0,
      w: 8,
      h: 4,
    });
  });
});

describe("RemoconBuilder（ラベルの表示）", () => {
  /** アイコンが設定されたものとして、ラベルを隠す decorator（defaultDecorator と同じ動作）。 */
  const hideLabel = (key: RemoteKeyDraft): RemoteKeyDraft => ({
    ...key,
    icon: key.name,
    showLabel: false,
  });
  const builder = (decorator?: RemoteKeyDecorator) =>
    remoconBuilder({ columns: 20, unit: 4, decorator });

  it("showLabel が false のキーは、build() で label を省き、buildEditor() では文字列を残す", () => {
    const b = builder(hideLabel).add(RemoteKeys.powerOn);

    expect(b.build().keys[0].label).toBeUndefined();
    expect(b.buildEditor().keys[0]).toMatchObject({
      label: RemoteKeys.powerOn.label,
      showLabel: false,
      icon: "powerOn",
    });
  });

  it("decorator を使わなければ、ラベルは表示される", () => {
    const b = builder().add(RemoteKeys.powerOn);

    expect(b.build().keys[0].label).toBe(RemoteKeys.powerOn.label);
    expect(b.buildEditor().keys[0].showLabel).toBe(true);
  });

  it("定義の showLabel が false のキーは、build() で label を省き、buildEditor() では文字列を残す", () => {
    const b = builder().addCustom("memo", "AB12");

    expect(b.build().keys[0].label).toBeUndefined();
    expect(b.buildEditor().keys[0]).toMatchObject({
      label: "memo",
      showLabel: false,
    });
  });

  it("overrides で label だけを指定すると、decorator が隠していても、その文字列を表示する", () => {
    const b = builder(hideLabel).add(RemoteKeys.powerOn, { label: "入" });

    expect(b.build().keys[0].label).toBe("入");
    expect(b.buildEditor().keys[0]).toMatchObject({
      label: "入",
      showLabel: true,
    });
  });

  it("overrides の showLabel は、label の指定より優先される", () => {
    const b = builder().add(RemoteKeys.powerOn, {
      label: "入",
      showLabel: false,
    });

    expect(b.build().keys[0].label).toBeUndefined();
    expect(b.buildEditor().keys[0]).toMatchObject({
      label: "入",
      showLabel: false,
    });
  });

  it("label を undefined にする overrides は、ラベルなしになる", () => {
    const b = builder().add(RemoteKeys.powerOn, { label: undefined });

    expect(b.build().keys[0].label).toBeUndefined();
    expect(b.buildEditor().keys[0].showLabel).toBe(false);
  });

  it("label を undefined にするだけの decorator でも、ラベルは表示されない", () => {
    const b = builder((key) => ({ ...key, label: undefined })).add(
      RemoteKeys.powerOn,
    );

    expect(b.build().keys[0].label).toBeUndefined();
    expect(b.buildEditor().keys[0].showLabel).toBe(false);
  });
});

describe("RemoconBuilder.buildEditor()", () => {
  const build = () =>
    remoconBuilder({
      columns: 20,
      unit: 4,
      background: "#0f172a",
      decorator: (key) => ({ ...key, icon: key.name, showLabel: false }),
    })
      .tab("基本")
      .add(RemoteKeys.powerOn)
      .add(RemoteKeys.powerOff, { label: "切" })
      .newline()
      .spacer(8)
      .add(RemoteKeys.keyUp)
      .tab("メモ")
      .label("説明", { w: 8 })
      .addCustom("custom", "", { label: "自由", w: 8 });

  it("version と grid と背景色を持ち、キーの id は追加した順の id1, id2, ... になる", () => {
    const editor = build().buildEditor();

    expect(editor).toMatchObject({
      version: 1,
      grid: { columns: 20, unit: 4 },
      background: "#0f172a",
    });
    expect(editor.keys.map((key) => key.id)).toEqual(
      editor.keys.map((_, i) => `id${i + 1}`),
    );
  });

  it("特殊キー（タブ・ラベル）は、code を持たず、ラベルを常に表示する", () => {
    const special = build()
      .buildEditor()
      .keys.filter((key) => isSpecialKey(key.name));

    expect(special.map((key) => key.name)).toEqual([
      TAB_KEY_NAME,
      TAB_KEY_NAME,
      LABEL_KEY_NAME,
    ]);
    for (const key of special) {
      expect(key.code).toBeUndefined();
      expect(key.showLabel).toBe(true);
    }
  });

  it("保存形式の検証（editorRemoconConfigSchema）を通る", () => {
    expect(() =>
      editorRemoconConfigSchema.parse(build().buildEditor()),
    ).not.toThrow();
  });

  it("toRemoconConfig で導出した結果は、build() と同じ内容になる（並びは上から左へ揃う）", () => {
    const b = build();
    const byPosition = (
      a: { y: number; x: number; name: string },
      c: { y: number; x: number; name: string },
    ) => a.y - c.y || a.x - c.x || a.name.localeCompare(c.name);
    const built = b.build();

    expect(toRemoconConfig(b.buildEditor())).toEqual({
      ...built,
      keys: built.keys
        .map((key) => ({
          ...key,
          code: isSpecialKey(key.name) ? undefined : key.code,
        }))
        .sort(byPosition),
    });
  });
});
