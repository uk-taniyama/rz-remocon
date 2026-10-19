import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LABEL_KEY_NAME, type RemoteKeyConfig, TAB_KEY_NAME } from "../../api";
import { RemoteKeyButton, RemoteKeyLayout } from "./RemoteKeyLayout";

const key = (icon?: string): RemoteKeyConfig => ({
  name: "x",
  icon,
  color: "#000000",
  x: 0,
  y: 0,
  w: 4,
  h: 4,
});

type IconRender = Parameters<typeof RemoteKeyButton>[0]["iconRender"];

const render = (keyConfig: RemoteKeyConfig, iconRender?: IconRender) =>
  renderToStaticMarkup(
    createElement(RemoteKeyButton, { keyConfig, iconRender }),
  );

describe("RemoteKeyButton（アイコン）", () => {
  it("iconRender がなければ、アイコンがあっても枠を描画しない", () => {
    expect(render(key())).not.toContain("key-face__icon");
    expect(render(key("powerOn"))).not.toContain("key-face__icon");
  });

  it("iconRender が要素を返せば、それをアイコンの枠に入れる", () => {
    const html = render(key("powerOn"), () => createElement("b", null, "X"));

    expect(html).toContain('<span class="key-face__icon"><b>X</b></span>');
  });

  it("iconRender が null を返せば、枠を描画しない", () => {
    expect(render(key("powerOn"), () => null)).not.toContain("key-face__icon");
  });

  it("iconRender には、キーの icon（文字列）がそのまま渡る", () => {
    let received: string | undefined;
    render(key("favorite"), (props) => {
      received = props.icon;
      return null;
    });

    expect(received).toBe("favorite");
  });
});

describe("RemoteKeyButton（タブ）", () => {
  const renderButton = (keyConfig: RemoteKeyConfig) =>
    renderToStaticMarkup(createElement(RemoteKeyButton, { keyConfig }));

  it("タブは押せない div で、タブ用の修飾クラスと key.color を持つ", () => {
    const html = renderButton({
      name: TAB_KEY_NAME,
      label: "メイン",
      color: "#123456",
      x: 0,
      y: 0,
      w: 20,
      h: 4,
    });

    expect(html).toContain("<div");
    expect(html).not.toContain("data-code");
    expect(html).toContain('class="key-face tab"');
    expect(html).toContain("--key-bg:#123456");
  });

  it("コードのない普通のキー（ラベル）は、背景が key.color のまま", () => {
    const html = renderButton({
      name: LABEL_KEY_NAME,
      label: "ラベル",
      color: "#123456",
      x: 0,
      y: 0,
      w: 4,
      h: 4,
    });

    expect(html).toContain("--key-bg:#123456");
    expect(html).toContain("--key-fg:#ffffff");
    expect(html).toContain('class="key-face key-button"');
  });

  it("スロットは位置と隙間（padding）を inline で持つ。どちらも --cell / --scaled-rem に比例する", () => {
    const html = render(key());

    expect(html).toContain("position:absolute");
    expect(html).toContain("left:calc(var(--cell) * 0)");
    expect(html).toContain("padding:calc(var(--scaled-rem) * 0.2)");
  });
});

describe("RemoteKeyLayout", () => {
  const renderButtons = (keys: RemoteKeyConfig[], columns = 4) =>
    renderToStaticMarkup(
      createElement(RemoteKeyLayout, { keys, cellsPerKey: 4, columns }),
    );

  it("グループ化されなければ通常のグリッドを描画する", () => {
    const keys = [{ ...key(), name: "powerOn", code: "40BF7E" }];
    const wrapper = renderButtons(keys);

    expect(wrapper).toContain('class="remote-key-layout key-scale-root"');
    expect(wrapper).toContain(
      'style="--cell:min(1.25rem, calc(100cqw / 4));--scaled-rem:calc(var(--cell) * 0.8);width:min(1.25rem * 4, 100cqw)"',
    );
    expect(wrapper).toContain('data-code="40BF7E"');
  });

  it("グループ化した場合、タブ用レイアウトを適用する", () => {
    const html = renderButtons(
      [
        {
          name: TAB_KEY_NAME,
          label: "メイン",
          color: "#123456",
          x: 0,
          y: 0,
          w: 20,
          h: 4,
        },
        { ...key(), name: "powerOn", code: "40BF7E" },
        {
          name: TAB_KEY_NAME,
          label: "録画",
          color: "#123456",
          x: 0,
          y: 4,
          w: 20,
          h: 4,
        },
        { ...key(), name: "mediaPlay", code: "40BE2D" },
      ],
      20,
    );

    expect(html.match(/type="radio"/g)).toHaveLength(2);
    expect(html.match(/class="remote-key-tabs__panel"/g)).toHaveLength(2);
    // 各グループの grid の幅（2グループ分）を検証する
    expect(html.match(/width:calc\(var\(--cell\) \* 20\)/g)).toHaveLength(2);
    expect(html).toContain('<div class="remote-key-layout key-scale-root"');
    expect(html).toContain('class="remote-key-tabs"');
    expect(html).toContain("--remote-key-tabs-count:2");
    expect(html).toContain('data-code="40BF7E"');
    expect(html).toContain('data-code="40BE2D"');
    const ids = [...html.matchAll(/id="([^"]+-\d+)"/g)].map(
      (match) => match[1],
    );
    expect(ids).toHaveLength(2);
    expect(html).toContain(`for="${ids[0]}"`);
    expect(html).toContain(">メイン</label>");
    expect(html).toContain(">録画</label>");
    expect(html).toContain("--remote-key-tabs-color:#123456");
    // input → 内容 → label の順に並んでいること（CSS の兄弟セレクタが、この順序を前提としている）
    expect(html).toMatch(
      /type="radio"[^>]*\/><div class="remote-key-tabs__panel">.*?<\/div><label class="remote-key-tabs__label"/,
    );
  });
});
