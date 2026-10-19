import { describe, expect, it } from "vitest";
import { type RemoteKeyConfig, TAB_KEY_NAME } from "../../api";
import { groupRemoteKeysByTab } from "./tab-group";

const tab = (label: string, y: number): RemoteKeyConfig => ({
  name: TAB_KEY_NAME,
  label,
  color: "#123456",
  x: 0,
  y,
  w: 20,
  h: 4,
});

const button = (name: string, y: number): RemoteKeyConfig => ({
  name,
  code: "40BF7E",
  color: "#123456",
  x: 0,
  y,
  w: 4,
  h: 4,
});

describe("groupRemoteKeysByTab", () => {
  it("タブで始まるキー列を [tab, buttons] グループに分ける", () => {
    const firstButton = button("powerOn", 4);
    const secondButton = button("volUp", 8);
    const lastButton = button("mediaPlay", 16);
    const groups = groupRemoteKeysByTab([
      tab("メイン", 0),
      firstButton,
      secondButton,
      tab("録画", 12),
      lastButton,
    ]);

    expect(groups).toEqual([
      {
        tab: tab("メイン", 0),
        buttons: [
          { ...firstButton, y: 0 },
          { ...secondButton, y: 4 },
        ],
      },
      { tab: tab("録画", 12), buttons: [{ ...lastButton, y: 0 }] },
    ]);
    expect(firstButton.y).toBe(4);
    expect(secondButton.y).toBe(8);
    expect(lastButton.y).toBe(16);
  });

  it("先頭がタブでなければグループ化しない", () => {
    expect(
      groupRemoteKeysByTab([button("powerOn", 0), tab("録画", 4)]),
    ).toBeUndefined();
    expect(groupRemoteKeysByTab([])).toBeUndefined();
  });

  it("連続するタブも空のグループとして保持する", () => {
    expect(groupRemoteKeysByTab([tab("空", 0), tab("次", 4)])).toEqual([
      { tab: tab("空", 0), buttons: [] },
      { tab: tab("次", 4), buttons: [] },
    ]);
  });
});
