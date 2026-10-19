import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Client } from "../../api";
import { useEditorData } from "./editor-client";

/*
 * useEditorData の reload() を検証する。
 * 読み込み済みの状態で再読み込みに失敗しても、画面（state）を保ち、reloadKey を進めず、reloadError に理由を入れる。
 */

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const loaded = (revision: string) => ({
  revision,
  config: null,
  invalid: false,
});

type Snapshot = ReturnType<typeof useEditorData>;
let latest: Snapshot | undefined;
let root: Root | undefined;

function Harness({ client }: { client: Client }) {
  latest = useEditorData(client);
  return null;
}

async function mount(get: () => Promise<unknown>) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("", { status: 404 })),
  );
  const client = { editor: { get } } as unknown as Client;
  document.body.innerHTML = '<div id="root"></div>';
  root = createRoot(document.getElementById("root") as HTMLElement);
  await act(async () => {
    root?.render(<Harness client={client} />);
  });
  await settle();
}

const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20));
  });

const revisionOf = () =>
  latest?.state.type === "loaded" ? latest.state.data.revision : undefined;

describe("useEditorData の reload", () => {
  afterEach(async () => {
    await act(async () => root?.unmount());
    root = undefined;
    latest = undefined;
    vi.unstubAllGlobals();
  });

  it("読み込み済みで、再読み込みに失敗しても、画面を保ち、理由を返す", async () => {
    const get = vi
      .fn()
      .mockResolvedValueOnce(loaded("r1"))
      .mockRejectedValueOnce(new Error("boom"));
    await mount(get);
    const keyBefore = latest?.reloadKey;
    expect(revisionOf()).toBe("r1");

    await act(async () => latest?.reload());
    await settle();

    expect(latest?.state.type).toBe("loaded");
    expect(revisionOf()).toBe("r1");
    expect(latest?.reloadKey).toBe(keyBefore);
    expect(latest?.reloadError).not.toBeNull();
  });

  it("再読み込みに成功したら、最新に差し替え、reloadKey を進め、エラーを消す", async () => {
    const get = vi
      .fn()
      .mockResolvedValueOnce(loaded("r1"))
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce(loaded("r2"));
    await mount(get);

    await act(async () => latest?.reload());
    await settle();
    expect(latest?.reloadError).not.toBeNull();
    const keyBefore = latest?.reloadKey ?? 0;

    await act(async () => latest?.reload());
    await settle();
    expect(revisionOf()).toBe("r2");
    expect(latest?.reloadKey).toBe(keyBefore + 1);
    expect(latest?.reloadError).toBeNull();
  });

  it("初回の読み込みに失敗したときは、従来どおり error になる", async () => {
    const get = vi.fn().mockRejectedValue(new Error("boom"));
    await mount(get);
    expect(latest?.state.type).toBe("error");
    expect(latest?.reloadError).toBeNull();
  });
});
