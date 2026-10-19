import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RemoteKeys, TAB_KEY_NAME } from "../../api";
import { defaultColorResolver } from "../../api/colors";
import { builtinIcons, createGenerateTools, fromUrls } from "../remoteKeys";
import { REMOTE_ICONS } from "../remoteKeys/Icons";
import { createEditorCatalog, renderCatalogIcon } from "./editor-catalog";
import { GRID_COLUMNS } from "./editor-grid";

/** 標準のアイコンを持たない REGZA のキー（num1 など）。 */
const noBuiltin = Object.values(RemoteKeys).find(
  (key) => !REMOTE_ICONS[key.name as keyof typeof REMOTE_ICONS],
);
/** 標準のアイコンを持つ REGZA のキー。 */
const withBuiltin = Object.values(RemoteKeys).find(
  (key) => REMOTE_ICONS[key.name as keyof typeof REMOTE_ICONS],
);
const find = (catalog: ReturnType<typeof createEditorCatalog>, name: string) =>
  catalog.find((entry) => entry.name === name);

/** 標準のアイコンに icon-urls.json の対応表を加えたセットから、hasIcon と iconRender を生成する。 */
const toolsFor = (urls: Record<string, string> = {}) =>
  createGenerateTools([builtinIcons, fromUrls(urls)]);
const catalogFor = (urls: Record<string, string> = {}) =>
  createEditorCatalog(toolsFor(urls).hasIcon, defaultColorResolver);
/** 対応表なし（標準のアイコンだけ）。 */
const editorCatalog = catalogFor();
const specialKeyCatalog = editorCatalog.slice(Object.keys(RemoteKeys).length);

describe("specialKeyCatalog", () => {
  it("全幅になるのは、タブだけ", () => {
    const full = specialKeyCatalog
      .filter((entry) => entry.w === GRID_COLUMNS)
      .map((entry) => entry.name);

    expect(full).toEqual([TAB_KEY_NAME]);
  });

  it("特殊キーは、code を持たない（押せない）", () => {
    expect(specialKeyCatalog.every((entry) => entry.code === undefined)).toBe(
      true,
    );
  });
});

describe("createEditorCatalog（icon-urls.json のアイコン）", () => {
  it("前提: 標準のアイコンがあるキーと、ないキーがある", () => {
    expect(noBuiltin).toBeDefined();
    expect(withBuiltin).toBeDefined();
  });

  it("表がなければ、標準のアイコンだけを見る", () => {
    const entry = find(editorCatalog, noBuiltin?.name ?? "");
    expect(entry?.icon).toBeUndefined();
    expect(entry?.showLabel).toBe(true);
  });

  it("標準のアイコンがあるキーは、icon に名前が入り、ラベルは隠れる", () => {
    const entry = find(editorCatalog, withBuiltin?.name ?? "");
    expect(entry?.icon).toBe(withBuiltin?.name);
    expect(entry?.showLabel).toBe(withBuiltin?.showLabel ?? false);
  });

  it("icon-urls.json にある名前は、標準のアイコンがないキーでも、icon が入り、ラベルは隠れる", () => {
    const name = noBuiltin?.name ?? "";
    const catalog = catalogFor({ [name]: "/n.svg" });
    const entry = find(catalog, name);
    expect(entry?.icon).toBe(name);
    expect(entry?.showLabel).toBe(noBuiltin?.showLabel ?? false);
  });

  it("表の名前は、他のキーには影響しない。標準のアイコンは、表になくても残る", () => {
    const name = noBuiltin?.name ?? "";
    const catalog = catalogFor({ [name]: "/n.svg" });
    expect(find(catalog, withBuiltin?.name ?? "")?.icon).toBe(
      withBuiltin?.name,
    );
    const other = Object.values(RemoteKeys).find(
      (key) =>
        key.name !== name &&
        !REMOTE_ICONS[key.name as keyof typeof REMOTE_ICONS],
    );
    expect(find(catalog, other?.name ?? "")?.icon).toBeUndefined();
  });

  it("特殊キーは、常に含まれる", () => {
    const catalog = catalogFor();
    expect(catalog.slice(-specialKeyCatalog.length)).toEqual(specialKeyCatalog);
  });
});

describe("renderCatalogIcon", () => {
  const html = (node: unknown) =>
    renderToStaticMarkup(createElement("div", null, node as never));

  it("icon-urls.json の名前は、その画像を描く", () => {
    const name = noBuiltin?.name ?? "";
    const urls = { [name]: "icons/n.svg" };
    const entry = find(catalogFor(urls), name);
    if (!entry) throw new Error("entry がない");

    expect(html(renderCatalogIcon(entry, toolsFor(urls).iconRender))).toContain(
      'src="icons/n.svg"',
    );
  });

  it("標準のアイコンは、svg を描く", () => {
    const entry = find(editorCatalog, withBuiltin?.name ?? "");
    if (!entry) throw new Error("entry がない");

    const out = html(renderCatalogIcon(entry, toolsFor().iconRender));
    expect(out).toContain("<svg");
    expect(out).not.toContain("<img");
  });

  it("icon がない項目は、何も描かない", () => {
    const entry = find(editorCatalog, noBuiltin?.name ?? "");
    if (!entry) throw new Error("entry がない");

    expect(renderCatalogIcon(entry, toolsFor().iconRender)).toBeNull();
  });
});
