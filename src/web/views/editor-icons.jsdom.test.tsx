import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RemoteKeys } from "../../api";
import { REMOTE_ICONS } from "../remoteKeys/Icons";

/*
 * エディタ全体（実物の useEditorData を含む）を jsdom に描画して、
 * icon-urls.json のアイコンが、キー一覧と保存済みのキーに表示されることを検証する。
 * スタブに置き換えるのは、API クライアントと、icon-urls.json の fetch だけである。
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

const mocks = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock("../client", () => ({
  apiClient: { editor: { get: () => mocks.get() } },
}));

/** 標準のアイコンを持たない REGZA のキー（num1 など）。 */
const noBuiltin = Object.values(RemoteKeys).find(
  (key) => !REMOTE_ICONS[key.name as keyof typeof REMOTE_ICONS],
);
const noBuiltinName = noBuiltin?.name ?? "";

/** 保存済みのキー。icon には、icon-urls.json の名前を指定している。 */
const savedKey = {
  id: "k1",
  name: "custom",
  code: "40BF7E",
  x: 0,
  y: 0,
  w: 4,
  h: 4,
  showLabel: false,
  icon: "logo",
  color: "#22c55e",
};

const emptyEditor = {
  revision: "r1",
  config: { keys: [], background: "#ffffff" },
  invalid: false,
};

let root: Root | undefined;

/** icon-urls.json の fetch を、テストから任意のタイミングで完了させられるようにスタブ化する。 */
function stubIconUrls() {
  let respond: (response: Response) => void = () => {};
  const pending = new Promise<Response>((resolve) => {
    respond = resolve;
  });
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) =>
      String(url).includes("icon-urls.json")
        ? pending
        : new Response("{}", { status: 404 }),
    ),
  );
  return {
    json: (body: unknown) => respond(new Response(JSON.stringify(body))),
    notFound: () => respond(new Response("", { status: 404 })),
  };
}

async function mountEditor() {
  const { default: EditorView } = await import("./EditorView");
  document.body.innerHTML = '<div id="root"></div>';
  root = createRoot(document.getElementById("root") as HTMLElement);
  await act(async () => {
    root?.render(<EditorView />);
  });
}

const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
  });

const imageSources = (selector: string) =>
  [...document.querySelectorAll(selector)].map((img) =>
    img.getAttribute("src"),
  );
const catalogImages = () => imageSources(".key-catalog__icon img");
const gridImages = () => imageSources(".grid-stack img");

describe("エディタ（icon-urls.json）", () => {
  afterEach(async () => {
    await act(async () => root?.unmount());
    root = undefined;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    mocks.get.mockReset();
  });

  it("前提: 標準のアイコンがないキーがある", () => {
    expect(noBuiltin).toBeDefined();
  });

  it("icon-urls.json が届くまでエディタを描かず、届いたら、一覧も保存済みのキーも、表の画像で出る", async () => {
    mocks.get.mockResolvedValue({
      revision: "r1",
      config: { keys: [savedKey], background: "#ffffff" },
      invalid: false,
    });
    const iconUrls = stubIconUrls();
    await mountEditor();
    await settle();

    // 保存データは取得済みだが、icon-urls.json はまだ取得できていない。この間は、中途半端な状態を表示しない。
    expect(document.body.textContent).toContain("読み込み中");
    expect(document.querySelector(".key-catalog")).toBeNull();
    expect(document.querySelectorAll("img")).toHaveLength(0);

    iconUrls.json({ logo: "logo.svg", [noBuiltinName]: "icons/n.svg" });
    await settle();

    expect(document.body.textContent).not.toContain("読み込み中");
    expect(catalogImages()).toEqual(["icons/n.svg"]);
    // 保存済みのキーは、最初から対応表の URL で描画される（icon の名前 "logo" が、そのまま URL として使用されることはない）。
    expect(gridImages()).toContain("logo.svg");
    expect(gridImages()).not.toContain("logo");
  });

  it("表がない（404）ときは、画像は出ない。一覧は出る", async () => {
    mocks.get.mockResolvedValue(emptyEditor);
    stubIconUrls().notFound();
    await mountEditor();
    await settle();

    expect(catalogImages()).toEqual([]);
    expect(
      document.querySelectorAll(".key-catalog__item").length,
    ).toBeGreaterThan(10);
  });

  it("不正な項目だけを飛ばし、使える項目は一覧に出る。警告も出る", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    mocks.get.mockResolvedValue(emptyEditor);
    stubIconUrls().json({
      [noBuiltinName]: "icons/n.svg",
      evil: "javascript:alert(1)",
    });
    await mountEditor();
    await settle();

    expect(catalogImages()).toEqual(["icons/n.svg"]);
    expect(document.body.textContent).toContain(
      "icon-urls.json に使えない項目",
    );
  });

  it("すべての項目が不正なときは、画像は出ない。エディタは開く", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    mocks.get.mockResolvedValue(emptyEditor);
    stubIconUrls().json({ [noBuiltinName]: "javascript:alert(1)" });
    await mountEditor();
    await settle();

    expect(catalogImages()).toEqual([]);
    expect(document.body.textContent).toContain(
      "icon-urls.json に使えない項目",
    );
    expect(document.querySelector(".key-catalog")).not.toBeNull();
  });

  it("icon-urls.json の通信に失敗しても、エディタは開く（警告つき）", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    mocks.get.mockResolvedValue(emptyEditor);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("Failed to fetch");
      }),
    );
    await mountEditor();
    await settle();

    expect(document.querySelector(".key-catalog")).not.toBeNull();
    expect(document.body.textContent).toContain("icon-urls.json");
  });

  it("保存データの取得に失敗したら、エラーを出す（icon-urls.json は関係ない）", async () => {
    mocks.get.mockRejectedValue(new Error("boom"));
    stubIconUrls().notFound();
    await mountEditor();
    await settle();

    expect(document.body.textContent).toContain("読み込みに失敗しました");
    expect(document.querySelector(".key-catalog")).toBeNull();
  });
});
