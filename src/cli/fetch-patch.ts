import { Agent, fetch, setGlobalDispatcher } from "undici";

// TLS の証明書検証を無効にする（REGZA が自己署名証明書を使用しているため）。
setGlobalDispatcher(new Agent({ connect: { rejectUnauthorized: false } }));
// biome-ignore lint/suspicious/noExplicitAny: This CLI intentionally patches the global fetch with undici so self-signed TLS certificates can be used against the appliance.
(globalThis as any).fetch = fetch;
