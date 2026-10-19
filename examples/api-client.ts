import { getClient, RemoteKeys, safeApiCall } from "rz-remocon/api";

async function main() {
  // 組み込みサーバーには、Web ページからも接続できる。
  // - 作成した Web ページは、-d オプションでそのまま配信できる。
  // - この場合は、baseUrl に location.origin を指定する。
  const baseUrl = "http://localhost:8484";
  console.log("サーバー接続する");

  const client = getClient(baseUrl);

  // キーコードを送信する。
  // - REGZA API が返したステータスコードが、結果に入る。
  const result = await safeApiCall(
    client.sendCode({
      code: RemoteKeys.volMute.code,
    }),
  );
  console.log(result);

  // REGZA との接続を確認する（ヘルスチェック）。
  console.log(await safeApiCall(client.status()));
}

main();
