import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { KeyFace } from "./KeyFace";

const render = (props: Partial<Parameters<typeof KeyFace>[0]>) =>
  renderToStaticMarkup(createElement(KeyFace, { color: "#123456", ...props }));

describe("KeyFace", () => {
  it("アイコンだけのとき、アイコンの枠は --with-label を付けない", () => {
    const html = render({ icon: createElement("svg") });

    expect(html).toContain('class="key-face__icon"');
    expect(html).not.toContain("key-face__label");
  });

  it("アイコンとラベルの両方があるとき、アイコンの枠とラベルを小さくする", () => {
    const html = render({ icon: createElement("svg"), label: "電源" });

    expect(html).toContain("key-face__icon--with-label");
    expect(html).toContain("key-face__label--small");
  });

  it("ラベルだけのとき、ラベルは小さくしない", () => {
    const html = render({ label: "地デジ" });

    expect(html).toContain('class="key-face__label"');
    expect(html).not.toContain("key-face__icon");
  });

  it('外枠は <div class="key-face ..."> で、className と属性をそのまま渡す', () => {
    const html = render({
      label: "A",
      className: "extra",
      "data-code": "40BF7E",
    } as Parameters<typeof render>[0]);

    expect(html).toContain('data-code="40BF7E"');
    expect(html).toContain('class="key-face key-button extra"');
  });

  it("色から --key-bg と、読みやすい --key-fg を作る", () => {
    expect(render({ color: "#123456" })).toContain(
      "--key-bg:#123456;--key-fg:#ffffff",
    );
    expect(render({ color: "#ffffff" })).toContain("--key-fg:#000000");
  });

  it("tab / selected で、クラスが切り替わる", () => {
    const tab = render({ tab: true });
    expect(tab).toContain("key-face tab");
    expect(tab).not.toContain("key-button");
    expect(render({})).not.toContain("selected");
    expect(render({ selected: true })).toContain("selected");
  });
});
