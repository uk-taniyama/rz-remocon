import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { RemoteKeyConfig, RemoteKeyDraft } from "../../api";
import {
  builtinIcons,
  createGenerateTools,
  createGenerateToolsWithUrls,
  defaultDecorator,
  defaultIconRender,
  fromComponents,
  fromUrls,
} from "./utils";

const base = { color: "#000000", x: 0, y: 0, w: 4, h: 4 };

const key = (name: string, icon?: string): RemoteKeyConfig => ({
  ...base,
  name,
  icon,
});

const render = (config: RemoteKeyConfig) =>
  renderToStaticMarkup(createElement("div", null, defaultIconRender(config)));

describe("builtinIcons", () => {
  it("標準の対応表にある名前は、アイコンを持つ", () => {
    expect(Object.hasOwn(builtinIcons, "powerOn")).toBe(true);
  });

  it("対応表にない名前は、持たない（Object のプロパティ名も含む）", () => {
    expect(Object.hasOwn(builtinIcons, "favorite")).toBe(false);
    expect(Object.hasOwn(builtinIcons, "toString")).toBe(false);
  });
});

describe("defaultIconRender", () => {
  it("標準の対応表にある名前は、90% の SVG で描画する（大きさは枠が決める）", () => {
    const html = render(key("x", "powerOn"));

    expect(html).toContain("<svg");
    expect(html).toContain("width:90%");
  });

  it("標準にない文字列は、95% の画像URLとして描画する", () => {
    const html = render(key("x", "https://example.com/a.png"));

    expect(html).toContain("<img");
    expect(html).toContain('src="https://example.com/a.png"');
    expect(html).toContain("width:95%");
  });

  it("Object のプロパティ名（toString など）は、画像URLとして描画する", () => {
    expect(render(key("x", "toString"))).toContain('src="toString"');
  });

  it("icon がなければ、キー名が標準の名前でも何も描画しない", () => {
    expect(render(key("powerOn"))).toBe("<div></div>");
    expect(render(key("custom"))).toBe("<div></div>");
  });
});

describe("defaultDecorator", () => {
  const draft = (name: string, label?: string): RemoteKeyDraft => ({
    name,
    label,
    x: 0,
    y: 0,
    w: 4,
    h: 4,
  });

  it("標準のアイコンがあるキーは、icon に名前を入れ、ラベルを隠す（文字列は残す）", () => {
    const result = defaultDecorator(draft("powerOn", "電源ON"));

    expect(result.icon).toBe("powerOn");
    expect(result.showLabel).toBe(false);
    expect(result.label).toBe("電源ON");
  });

  it("keepLabel のときは、アイコンがあってもラベルを隠さない", () => {
    const result = defaultDecorator(draft("powerOn", "電源ON"), {
      keepLabel: true,
    });

    expect(result.icon).toBe("powerOn");
    expect(result.showLabel).not.toBe(false);
    expect(result.label).toBe("電源ON");
  });

  it("標準のアイコンがないキーは、icon を持たず、ラベルを隠さない", () => {
    const result = defaultDecorator(draft("chDTT", "地デジ"));

    expect(result.icon).toBeUndefined();
    expect(result.showLabel).not.toBe(false);
    expect(result.label).toBe("地デジ");
  });

  it("color は、指定があれば残し、なければ種別の色にする", () => {
    const given = defaultDecorator({ ...draft("powerOn"), color: "#123456" });
    const fallback = defaultDecorator(draft("powerOn"));

    expect(given.color).toBe("#123456");
    expect(fallback.color).toBe("#ef4444");
  });
});

describe("fromComponents / fromUrls", () => {
  const Dot = ({ style }: { style?: React.CSSProperties }) =>
    createElement("i", { style });

  it("fromComponents は、指定の大きさを style に付ける。undefined の値は飛ばす", () => {
    const set = fromComponents({ dot: Dot, none: undefined }, "50%");

    expect(Object.keys(set)).toEqual(["dot"]);
    expect(
      renderToStaticMarkup(createElement("div", null, set.dot(key("x")))),
    ).toContain("width:50%");
  });

  it("fromUrls は、名前で登録した画像を 95% で描画する", () => {
    const set = fromUrls({ logo: "/logo.svg" });
    const html = renderToStaticMarkup(
      createElement("div", null, set.logo(key("x"))),
    );

    expect(html).toContain('src="/logo.svg"');
    expect(html).toContain("width:95%");
  });
});

describe("createGenerateTools", () => {
  const Dot = ({ style }: { style?: React.CSSProperties }) =>
    createElement("i", { style, "data-extra": "1" });
  const tools = createGenerateTools([
    builtinIcons,
    fromComponents({ favorite: Dot, powerOn: Dot }),
    fromUrls({ logo: "/logo.svg" }),
  ]);
  const html = (config: RemoteKeyConfig) =>
    renderToStaticMarkup(createElement("div", null, tools.iconRender(config)));
  const draft = (name: string, label?: string): RemoteKeyDraft => ({
    name,
    label,
    x: 0,
    y: 0,
    w: 4,
    h: 4,
  });

  it("追加したセットの名前を、icon に入れて描画する（decorator と iconRender がそろう）", () => {
    const decorated = tools.decorator(draft("favorite", "お気に入り"));

    expect(decorated.icon).toBe("favorite");
    expect(decorated.showLabel).toBe(false);
    expect(decorated.label).toBe("お気に入り");
    expect(html({ ...base, name: "favorite", icon: decorated.icon })).toContain(
      "data-extra",
    );
  });

  it("後ろのセットが、同じ名前を上書きする", () => {
    expect(html(key("x", "powerOn"))).toContain("data-extra");
    expect(
      renderToStaticMarkup(
        createElement("div", null, defaultIconRender(key("x", "powerOn"))),
      ),
    ).not.toContain("data-extra");
  });

  it("どのセットにもない文字列は、画像として描画する。icon がなければ何も描画しない", () => {
    expect(html(key("x", "https://example.com/a.png"))).toContain("<img");
    expect(html(key("powerOn"))).toBe("<div></div>");
  });

  it("hasIcon は、追加したセットと標準の名前を見る（decorator と同じ判定）", () => {
    expect(tools.hasIcon("favorite")).toBe(true);
    expect(tools.hasIcon("logo")).toBe(true);
    expect(tools.hasIcon("powerOn")).toBe(true);
    expect(tools.hasIcon("chDTT")).toBe(false);
    expect(tools.hasIcon("https://example.com/a.png")).toBe(false);
  });

  it("fromUrls の表は、標準のアイコンを上書きし、hasIcon・decorator・iconRender がそろう", () => {
    const urlTools = createGenerateTools([
      builtinIcons,
      fromUrls({ logo: "/logo.svg", powerOn: "/my-power.svg" }),
    ]);
    const out = (name: string) =>
      renderToStaticMarkup(
        createElement("div", null, urlTools.iconRender(key(name, name))),
      );

    expect(urlTools.hasIcon("logo")).toBe(true);
    expect(urlTools.decorator(draft("logo")).icon).toBe("logo");
    expect(out("logo")).toContain('src="/logo.svg"');
    expect(out("powerOn")).toContain('src="/my-power.svg"');
    expect(out("powerOff")).toContain("<svg");
  });

  it("標準の組（defaultDecorator）と同じく、アイコンのないキーはラベルを残す", () => {
    const result = tools.decorator(draft("chDTT", "地デジ"));

    expect(result.icon).toBeUndefined();
    expect(result.showLabel).not.toBe(false);
    expect(result.label).toBe("地デジ");
  });
});

describe("createGenerateToolsWithUrls", () => {
  const urls = { logo: "/logo.svg", powerOn: "/my-power.svg" };
  const tools = createGenerateToolsWithUrls(urls);
  const out = (name: string) =>
    renderToStaticMarkup(
      createElement("div", null, tools.iconRender(key(name, name))),
    );

  it("標準のアイコンに、表の名前を加える（hasIcon・decorator・iconRender がそろう）", () => {
    expect(tools.hasIcon("logo")).toBe(true);
    expect(tools.hasIcon("powerOff")).toBe(true);
    expect(tools.hasIcon("chDTT")).toBe(false);
    expect(tools.decorator({ name: "logo", x: 0, y: 0, w: 4, h: 4 }).icon).toBe(
      "logo",
    );
    expect(out("logo")).toContain('src="/logo.svg"');
    expect(out("powerOff")).toContain("<svg");
  });

  it("表は、標準のアイコンと同じ名前を上書きする", () => {
    expect(out("powerOn")).toContain('src="/my-power.svg"');
  });

  it("表が空なら、標準のアイコンだけ（createGenerateTools([builtinIcons]) と同じ）", () => {
    const empty = createGenerateToolsWithUrls({});
    const plain = createGenerateTools([builtinIcons]);
    for (const name of ["powerOn", "logo", "chDTT"]) {
      expect(empty.hasIcon(name)).toBe(plain.hasIcon(name));
    }
  });

  it("createGenerateTools([builtinIcons, fromUrls(urls)]) と同じ結果になる", () => {
    const manual = createGenerateTools([builtinIcons, fromUrls(urls)]);
    for (const name of ["powerOn", "powerOff", "logo", "chDTT"]) {
      expect(tools.hasIcon(name)).toBe(manual.hasIcon(name));
      expect(
        renderToStaticMarkup(
          createElement("div", null, tools.iconRender(key(name, name))),
        ),
      ).toBe(
        renderToStaticMarkup(
          createElement("div", null, manual.iconRender(key(name, name))),
        ),
      );
    }
  });
});
