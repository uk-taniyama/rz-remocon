import {
  type ClientPromiseResult,
  createORPCClient,
  ORPCError,
} from "@orpc/client";
import type { ContractRouterClient } from "@orpc/contract";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import { apiPrefix, type Contract, contract } from "./contract";

/**
 * 指定したベース URL に接続する、型付きの API クライアントを生成する。
 *
 * @param baseUrl - API サーバーのベース URL（`apiPrefix` は含めない）。
 * @returns API クライアント。
 */
export function getClient(baseUrl: string): ContractRouterClient<Contract> {
  const url = baseUrl + apiPrefix;
  const link = new OpenAPILink(contract, { url });
  return createORPCClient(link);
}

/** API クライアントの型。 */
export type Client = ContractRouterClient<Contract>;

/**
 * API 呼び出しの成功結果。
 *
 * @typeParam T - 成功時に返される値の型。
 */
export type ApiSuccess<T> = { ok: true; value: T };

/** API 呼び出しの失敗結果。 */
export type ApiFailure =
  | { ok: false; reason: "server_error"; code: string; data: unknown }
  | { ok: false; reason: "unexpected_status"; status: number; body: unknown }
  | { ok: false; reason: "bad_request"; detail: unknown }
  | { ok: false; reason: "network_error"; detail: string }; // `fetch` の失敗、不正な JSON、タイムアウトなどを含む

/**
 * API 呼び出しの結果。
 *
 * - `ok` プロパティで成否を判定する。
 * - `true` の場合は {@link ApiSuccess}
 * - `false` の場合は {@link ApiFailure}
 *
 * @typeParam T - 成功時に返される値の型。
 */
export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

/**
 * API 呼び出しを安全に実行する。
 *
 * - 結果を {@link ApiSuccess} に、例外を {@link ApiFailure} に変換して返す。
 *
 * @typeParam T - API の成功時に返される値の型。
 * @typeParam TError - API クライアントが返すエラーの型。
 * @param apiResult - API 呼び出しの Promise。
 * @returns API 呼び出しの結果。
 */
export async function safeApiCall<T, TError extends Error>(
  apiResult: ClientPromiseResult<T, TError>,
): Promise<ApiResult<T>> {
  try {
    const value = await apiResult;
    return { ok: true, value };
  } catch (error) {
    if (error instanceof ORPCError) {
      if (error.defined) {
        // API の契約で定義したエラー（`STORAGE_ERROR`、`REVISION_CONFLICT` など）
        return {
          ok: false,
          reason: "server_error",
          code: error.code,
          data: error.data,
        };
      }
      if (error.code === "BAD_REQUEST") {
        // data.issues に Zod の検証エラーが含まれる
        return { ok: false, reason: "bad_request", detail: error.data };
      }
      return {
        ok: false,
        reason: "unexpected_status",
        status: error.status,
        body: {
          code: error.code,
          data: error.data,
        },
      };
    }
    return { ok: false, reason: "network_error", detail: String(error) };
  }
}
