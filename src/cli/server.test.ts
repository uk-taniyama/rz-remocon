import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createORPCClient } from "@orpc/client";
import type { ContractRouterClient } from "@orpc/contract";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import type { Hono } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { contract } from "../api";
import { getToken, sendKeyCode } from "../lib";
import { createServerApp, resolveDefaultPublicDir } from "./server";

vi.mock("../lib", () => ({
  getToken: vi.fn(),
  getPublicSupport: vi.fn(),
  sendKeyCode: vi.fn(),
}));

vi.mock("../lib/regza-client", () => ({
  freezeRegzaConfig: vi.fn(),
}));

describe("createServerApp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createTestClient(app: Hono) {
    const link = new OpenAPILink(contract, {
      url: "http://localhost/api",
      fetch: async (input, init) => app.request(input, init),
    });

    const client: ContractRouterClient<typeof contract> =
      createORPCClient(link);
    return client;
  }

  it("sendKey", async () => {
    vi.mocked(getToken).mockResolvedValue("token-123");
    vi.mocked(sendKeyCode).mockResolvedValue(1);

    const app = createServerApp({
      publicDir: "./public",
      dataDir: "./public",
    });
    const client = createTestClient(app);

    const result = await client.sendCode({
      code: "40BF2F",
    });

    expect(result).toBe(1);
    expect(sendKeyCode).toHaveBeenCalledWith("40BF2F", "token-123");
  });

  it("serves static files from publicDir", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rz-remocon-"));
    fs.writeFileSync(path.join(dir, "index.html"), "<h1>OK</h1>");

    const app = createServerApp({ publicDir: dir, dataDir: dir });
    const res = await app.request("http://localhost/");

    expect(res.status).toBe(200);
    expect(await res.text()).toContain("OK");
  });

  it("serves dataDir under /data/", async () => {
    const publicDir = fs.mkdtempSync(path.join(os.tmpdir(), "rz-public-"));
    const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "rz-data-"));
    fs.writeFileSync(path.join(dataDir, "remocon.json"), '{"keys":[]}');

    const app = createServerApp({ publicDir, dataDir });
    const res = await app.request("http://localhost/data/remocon.json");

    expect(res.status).toBe(200);
    expect(await res.text()).toBe('{"keys":[]}');
  });

  it("serves icon-urls.json under /data/, and returns 404 when it does not exist", async () => {
    const publicDir = fs.mkdtempSync(path.join(os.tmpdir(), "rz-public-"));
    const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "rz-data-"));
    const app = createServerApp({ publicDir, dataDir });

    const missing = await app.request("http://localhost/data/icon-urls.json");
    expect(missing.status).toBe(404);

    fs.writeFileSync(
      path.join(dataDir, "icon-urls.json"),
      '{"logo":"/logo.svg"}',
    );
    const res = await app.request("http://localhost/data/icon-urls.json");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ logo: "/logo.svg" });
  });

  it("does not serve dataDir without /data/ prefix", async () => {
    const publicDir = fs.mkdtempSync(path.join(os.tmpdir(), "rz-public-"));
    const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "rz-data-"));
    fs.writeFileSync(path.join(dataDir, "remocon.json"), "{}");

    const app = createServerApp({ publicDir, dataDir });
    const res = await app.request("http://localhost/remocon.json");

    expect(res.status).toBe(404);
  });
});

describe("allowOrigin（書き込みの API だけを守る）", () => {
  const allowed = "http://localhost:5173";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createGuardedApp() {
    const publicDir = fs.mkdtempSync(path.join(os.tmpdir(), "rz-public-"));
    const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "rz-data-"));
    fs.writeFileSync(path.join(publicDir, "index.html"), "<h1>OK</h1>");
    fs.writeFileSync(path.join(dataDir, "remocon.json"), "{}");
    return createServerApp({ publicDir, dataDir, allowOrigin: allowed });
  }

  it.each(["POST", "PUT"])(
    "%s /api は、許可した Origin 以外なら 403 にする",
    async (method) => {
      const app = createGuardedApp();

      const other = await app.request("http://localhost/api/sendCode", {
        method,
        headers: { origin: "http://evil.example" },
      });
      expect(other.status).toBe(403);
      expect(await other.text()).toBe("Forbidden origin");

      const none = await app.request("http://localhost/api/sendCode", {
        method,
      });
      expect(none.status).toBe(403);
      expect(sendKeyCode).not.toHaveBeenCalled();
    },
  );

  it("書き込みでも、許可した Origin なら通す", async () => {
    const app = createGuardedApp();
    const res = await app.request("http://localhost/api/sendCode", {
      method: "POST",
      headers: { origin: allowed },
    });
    expect(res.status).not.toBe(403);
  });

  it("GET と、静的ファイル、/data/ は、Origin がなくても通す", async () => {
    const app = createGuardedApp();

    const page = await app.request("http://localhost/");
    expect(page.status).toBe(200);

    const data = await app.request("http://localhost/data/remocon.json");
    expect(data.status).toBe(200);

    const status = await app.request("http://localhost/api/status");
    expect(status.status).not.toBe(403);
  });

  it("allowOrigin がなければ、何も拒否しない", async () => {
    const publicDir = fs.mkdtempSync(path.join(os.tmpdir(), "rz-public-"));
    const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "rz-data-"));
    const app = createServerApp({ publicDir, dataDir });
    const res = await app.request("http://localhost/api/sendCode", {
      method: "POST",
    });
    expect(res.status).not.toBe(403);
  });
});

describe("resolveDefaultPublicDir", () => {
  it("隣に public があれば、それを使う（ビルド後の dist/public）", () => {
    const base = fs.mkdtempSync(path.join(os.tmpdir(), "rz-base-"));
    fs.mkdirSync(path.join(base, "public"));

    expect(resolveDefaultPublicDir(base)).toBe(path.join(base, "public"));
  });

  it("隣に public がなければ、2つ上の public を使う（開発時）", () => {
    const base = fs.mkdtempSync(path.join(os.tmpdir(), "rz-base-"));

    expect(resolveDefaultPublicDir(base)).toBe(
      path.resolve(base, "../../public"),
    );
  });
});
