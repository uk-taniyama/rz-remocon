import {
  createFileConfigStore,
  type RegzaConfig,
  sendKeyCode,
  setRegzaConfigStore,
} from "rz-remocon";
import { RemoteKeys } from "rz-remocon/api";

// 自己署名証明書を使用するため、TLS の証明書検証を無効にする。
// ※セキュリティ上のリスクあり。
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function main() {
  console.log("直接接続する");

  setRegzaConfigStore(
    createFileConfigStore<RegzaConfig>("./regza.json", {
      notFoundMessage: "あらかじめREGZAに接続してください。",
    }),
  );

  const status = await sendKeyCode(RemoteKeys.volMute.code);
  console.log(status);
}

main();
