import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { builtinIcons, createGenerateTools, fromUrls } from "../remoteKeys";
import type { EditorKey } from "./editor-grid";
import { PreviewView } from "./PreviewView";

const grid = { columns: 20, unit: 4 };

const key = (override: Partial<EditorKey>): EditorKey => ({
  id: "k1",
  name: "powerOn",
  code: "40BF7E",
  icon: "powerOn",
  label: "電源",
  showLabel: false,
  color: "#ef4444",
  x: 0,
  y: 0,
  w: 4,
  h: 4,
  ...override,
});

describe("PreviewView", () => {
  it("編集中のキーを、背景色つきの枠の中に描く", () => {
    const html = renderToStaticMarkup(
      createElement(PreviewView, {
        keys: [key({})],
        background: "#334155",
        grid,
      }),
    );

    expect(html).toContain('class="editor-preview"');
    expect(html).toContain("background-color:#334155");
    expect(html).toContain('class="remote-key-container"');
    expect(html).toContain('data-code="40BF7E"');
  });

  it("iconRender を渡すと、表の名前のアイコンを描く", () => {
    const html = renderToStaticMarkup(
      createElement(PreviewView, {
        keys: [key({ icon: "logo", showLabel: false })],
        background: "#ffffff",
        grid,
        iconRender: createGenerateTools([
          builtinIcons,
          fromUrls({ logo: "/logo.svg" }),
        ]).iconRender,
      }),
    );

    expect(html).toContain('src="/logo.svg"');
  });

  it("キーがなくても描ける", () => {
    const html = renderToStaticMarkup(
      createElement(PreviewView, { keys: [], background: "#ffffff", grid }),
    );

    expect(html).toContain('class="editor-preview__screen"');
  });
});
