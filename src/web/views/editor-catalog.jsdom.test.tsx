import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RemoteKeys } from "../../api";
import { REMOTE_ICONS } from "../remoteKeys/Icons";

/*
 * エディタ全体を jsdom に描画して、キー一覧（カタログ）に、icon-urls.json のアイコンが表示されることを検証する。
 * 通信のうち、エディタの保存データ（API クライアント）と、icon-urls.json の fetch だけをスタブに置き換える。
 */

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// jsdom には存在しない ResizeObserver を、スタブで補う（useRem が使用する）。
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(
  globalThis as unknown as { ResizeObserver: typeof ResizeObserverStub }
).ResizeObserver = ResizeObserverStub;

// 実物の useEditorData を使い、API クライアントだけをスタブにする（editor-icons.jsdom.test.tsx と同じ方式）。
// useEditorData の戻り値（state の type、catalog、iconRender、iconWarnings）を、テスト側で再現しないため。
vi.mock("../client", () => ({
  apiClient: {
    editor: {
      get: async () => ({
        revision: "r1",
        config: { keys: [], background: "#ffffff" },
        invalid: false,
      }),
    },
  },
}));

/** 標準のアイコンを持たない REGZA のキー（num1 など）。 */
const noBuiltin = Object.values(RemoteKeys).find(
  (key) => !REMOTE_ICONS[key.name as keyof typeof REMOTE_ICONS],
);

let root: Root | undefined;

async function mountEditor(iconUrls: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) =>
      String(url).includes("icon-urls.json")
        ? new Response(JSON.stringify(iconUrls), { status })
        : new Response("{}", { status: 404 }),
    ),
  );
  const { default: EditorView } = await import("./EditorView");
  document.body.innerHTML = '<div id="root"></div>';
  root = createRoot(document.getElementById("root") as HTMLElement);
  await act(async () => {
    root?.render(<EditorView />);
  });
  // icon-urls.json の読み込みと、再描画の完了を待つ。
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
  });
}

const catalogImages = () =>
  [...document.querySelectorAll(".key-catalog__icon img")].map((img) =>
    img.getAttribute("src"),
  );

describe("エディタのキー一覧（icon-urls.json）", () => {
  afterEach(async () => {
    await act(async () => root?.unmount());
    root = undefined;
    vi.unstubAllGlobals();
  });

  it("前提: 標準のアイコンがないキーがある", () => {
    expect(noBuiltin).toBeDefined();
  });

  it("表の名前のアイコンが、キー一覧に出る", async () => {
    await mountEditor({ [noBuiltin?.name ?? ""]: "icons/n.svg" });

    expect(catalogImages()).toEqual(["icons/n.svg"]);
  });

  it("表がない（404）ときは、画像は出ない。キー一覧は出る", async () => {
    await mountEditor({}, 404);

    expect(catalogImages()).toEqual([]);
    expect(
      document.querySelectorAll(".key-catalog__item").length,
    ).toBeGreaterThan(10);
  });

  it("不正な項目があるときは、画像は出ず、警告が出る", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    await mountEditor({ [noBuiltin?.name ?? ""]: "javascript:alert(1)" });

    expect(catalogImages()).toEqual([]);
    expect(document.body.textContent).toContain(
      "icon-urls.json に使えない項目",
    );
  });
});
