import { implement, ORPCError } from "@orpc/server";
import { contract } from "../api";
import { getPublicSupport, getToken, sendKeyCode } from "../lib";
import { loadEditorConfig, saveEditorConfig } from "./editor-storage";

/** 例外を、API のエラーの data（メッセージ文字列）に変換する。 */
function normalizeError(error: unknown) {
  return { data: error instanceof Error ? error.message : String(error) };
}

const base = implement(contract);

/** 想定外の例外を、INTERNAL_SERVER_ERROR に変換するミドルウェア。 */
const catchUnexpectedErrors = base.middleware(async ({ next, errors }) => {
  try {
    return await next();
  } catch (error) {
    if (error instanceof ORPCError) throw error;
    console.error(error);
    throw errors.INTERNAL_SERVER_ERROR(normalizeError(error));
  }
});

const os = base.use(catchUnexpectedErrors);

export const apiRouter = os.router({
  sendCode: os.sendCode.handler(async ({ input }) => {
    const token = await getToken();
    return await sendKeyCode(input.code, token);
  }),
  status: os.status.handler(async () => {
    const status = await getPublicSupport();
    return status.status;
  }),
  editor: {
    get: os.editor.get.handler(async ({ errors }) => {
      try {
        return await loadEditorConfig();
      } catch (error) {
        console.error(error);
        throw errors.STORAGE_ERROR(normalizeError(error));
      }
    }),
    save: os.editor.save.handler(async ({ input, errors }) => {
      let outcome: Awaited<ReturnType<typeof saveEditorConfig>>;
      try {
        outcome = await saveEditorConfig(input.revision, input.config);
      } catch (error) {
        console.error(error);
        throw errors.STORAGE_ERROR(normalizeError(error));
      }
      if (outcome.type === "conflict") {
        throw errors.REVISION_CONFLICT({
          data: { revision: outcome.revision },
        });
      }
      return { revision: outcome.revision };
    }),
  },
});
