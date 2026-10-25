import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { generateApiDocsMd } from "./api-docs";
import { convertApiJson } from "./api-json";
import { loadSourceDict } from "./typedoc";
import { saveJson } from "./utils";

const usage = `Usage: generate-docs.ts <api-json-dir> <typedoc-json> <work-dir> <out-dir>

  api-json-dir  API Extractor の .api.json があるディレクトリ（例: work/doc）
  typedoc-json  typedoc の JSON 出力（例: work/typedoc/docs.json）
  work-dir      中間生成物の出力先（<work-dir>/converted, <work-dir>/documents に出力）
  out-dir       Markdown の出力先（例: refs）
`;

function parseCliArgs() {
  const [apiJsonDir, typedoc, work, out, ...rest] = process.argv.slice(2);
  if (!apiJsonDir || !typedoc || !work || !out || rest.length > 0) {
    console.error(usage);
    process.exit(1);
  }
  return { apiJsonDir, typedoc, work, out };
}

type CliArgs = ReturnType<typeof parseCliArgs>;

export async function cliMain(args: CliArgs) {
  const convertedDir = join(args.work, "converted");
  const documentsDir = join(args.work, "documents");
  mkdirSync(convertedDir, { recursive: true });
  mkdirSync(documentsDir, { recursive: true });
  mkdirSync(args.out, { recursive: true });

  const sourceDict = loadSourceDict(args.typedoc);
  convertApiJson(args.apiJsonDir, convertedDir);
  saveJson(join(convertedDir, "sourceDict.json"), sourceDict);
  await generateApiDocsMd(convertedDir, args.out, documentsDir);
}

async function main() {
  const args = parseCliArgs();
  await cliMain(args);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  await main();
}
