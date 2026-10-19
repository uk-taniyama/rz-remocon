import { useCallback, useRef, useState } from "react";
import { type ApiResult, type Client, safeApiCall } from "../../api";
import type { OnChangeCode } from "./types";

/** キーコードの送信結果。 */
export interface SendCodeResult {
  code: string;
  result: ApiResult<number>;
}

/**
 * キーコードを送信し、送信したコードと API 呼び出しの結果を返す。
 *
 * @param client - 送信に使う API クライアント。
 * @param code - 送信するキーコード。
 * @returns 送信したコードと、API 呼び出しの結果。
 */
export async function sendCode(
  client: Client,
  code: string,
): Promise<SendCodeResult> {
  const result = await safeApiCall(client.sendCode({ code }));
  return { code, result };
}

/**
 * キーコードを送信するフック。
 * 送信中は、次の送信を受け付けない（多重送信の防止）。送信中かどうかは busy で参照できる。
 *
 * @param client - 送信に使う API クライアント。
 */
export function useRegzaApi(client: Client) {
  const inFlight = useRef(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SendCodeResult>();
  const handleSendCode = useCallback<OnChangeCode>(
    async (value) => {
      if (inFlight.current) return;
      inFlight.current = true;
      setBusy(true);
      try {
        setResult(await sendCode(client, value));
      } finally {
        inFlight.current = false;
        setBusy(false);
      }
    },
    [client],
  );

  return {
    busy,
    result,
    onSendCode: handleSendCode,
  };
}
