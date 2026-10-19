import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { RemoconConfig } from "../api";
import { renderHtml } from "./HtmlView";

const config: RemoconConfig = {
  version: 1,
  grid: { columns: 20, unit: 4 },
  background: "#0f172a",
  keys: [
    {
      name: "powerOn",
      code: "40BF7E",
      icon: "powerOn",
      color: "#ef4444",
      x: 0,
      y: 0,
      w: 4,
      h: 4,
    },
    {
      name: "custom",
      code: "40BF1A",
      icon: "https://example.com/a.png",
      color: "#22c55e",
      x: 4,
      y: 0,
      w: 4,
      h: 4,
    },
  ],
};

describe("renderHtml", () => {
  it("背景色、CSS、JS の参照を含む HTML を作る", () => {
    const html = renderToStaticMarkup(
      createElement(
        "div",
        null,
        renderHtml({
          cssPath: "assets/a.css",
          jsPath: "assets/remote.js",
          remocon: config,
        }),
      ),
    );

    expect(html).toContain("#0f172a");
    expect(html).toContain("assets/a.css");
    expect(html).toContain("assets/remote.js");
    expect(html).toContain('data-code="40BF7E"');
  });

  it("タブ付きのキーは、タブ表示で描画し、#remote は React 版と同じクラスを持つ", () => {
    const tab = (label: string, y: number) => ({
      name: "$TAB$",
      label,
      color: "#475569",
      x: 0,
      y,
      w: 20,
      h: 4,
    });
    const html = renderToStaticMarkup(
      createElement(
        "div",
        null,
        renderHtml({
          cssPath: "a.css",
          jsPath: "remote.js",
          remocon: {
            ...config,
            keys: [tab("メイン", 0), config.keys[0], tab("録画", 8)],
          },
        }),
      ),
    );

    // タブバーの高さ 100% の指定は、.remote-key-container（main.css）が #remote まで伝える。
    expect(html).toContain('<div id="remote" class="remote-key-container">');
    expect(html.match(/type="radio"/g)).toHaveLength(2);
    expect(html).toContain(">メイン</label>");
    expect(html).toContain(">録画</label>");
    expect(html).toContain('data-code="40BF7E"');
  });

  it("iconRender を渡すと、そのアイコンを描画する", () => {
    const html = renderToStaticMarkup(
      createElement(
        "div",
        null,
        renderHtml({
          cssPath: "a.css",
          jsPath: "remote.js",
          remocon: config,
          iconRender: (key) =>
            key.name === "powerOn" ? createElement("b", null, "CUSTOM") : null,
        }),
      ),
    );

    expect(html).toContain("<b>CUSTOM</b>");
  });
});
