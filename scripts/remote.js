// remote.js — 静的 HTML 用の、キー送信スクリプト。
//
// React 版の RemoteKeySender（クリックイベントの委譲）と useRegzaApi（多重送信の防止と busy 状態）を、
// フレームワークなしで置き換えたもの。キーの配置は generateFromFile（gen）が HTML に埋め込み済みで、
// このスクリプトは「[data-code] を持つ要素をクリックしたら、そのコードを POST /api/sendCode で送信する」ことだけを行う。
//
// API の基点を変更する場合（別サーバーの API に向ける場合）は、
// <div id="remote" data-api-base="http://192.168.0.2:8484"> のように指定する。
// この場合は、server の起動時に -c <このページのオリジン> を指定して、CORS を許可すること。
(() => {
  const root = document.getElementById("remote");
  if (!root) return;

  const content = root.closest(".content") ?? root;
  const apiBase = (root.dataset.apiBase ?? "").replace(/\/+$/, "");
  let inFlight = false;

  /** 1つのコードを送信し、結果を { code, ok, status, body | error } で返す（例外は投げない）。 */
  async function sendCode(code) {
    try {
      const res = await fetch(`${apiBase}/api/sendCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const body = await res.json().catch(() => null);
      return { code, ok: res.ok, status: res.status, body };
    } catch (error) {
      return { code, ok: false, error: String(error) };
    }
  }

  root.addEventListener("click", async (event) => {
    const target =
      event.target instanceof Element
        ? event.target.closest("[data-code]")
        : null;
    const code = target?.dataset.code;
    if (!code || inFlight) return;

    inFlight = true;
    content.inert = true; // 送信中は操作を無効にする（MainView の <div inert={busy}> と同じ）
    try {
      console.log(await sendCode(code));
    } finally {
      inFlight = false;
      content.inert = false;
    }
  });
})();
