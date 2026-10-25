import { fileURLToPath } from "node:url";
import { describe, it } from "vitest";
import { cliMain } from "./generate-docs";

const projectDir = fileURLToPath(new URL("../..", import.meta.url));

describe("test", () => {
  it("all", () => {
    cliMain({
      apiJsonDir: `${projectDir}/work/doc`,
      typedoc: `${projectDir}/work/typedoc/docs.json`,
      work: `${projectDir}/test-gen-docs`,
      out: `${projectDir}/test-refs`,
    });
  });
});
