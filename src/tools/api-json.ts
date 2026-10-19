import { join } from "node:path";
import { itemKey, loadJson, saveJson } from "./utils";

interface ApiParameter {
  parameterName: string;
  parameterTypeTokenRange: {
    startIndex: number;
    endIndex: number;
  };
}

interface ApiDocItem {
  kind: string;
  name?: string;
  text?: string;
  canonicalReference?: string;
  members?: ApiDocItem[];
  excerptTokens?: ApiDocItem[];
  parameters?: ApiParameter[];
}

const exportedKinds = [
  "Class",
  "Function",
  "Interface",
  "TypeAlias",
  "Variable",
];

function traverseMembers(
  item: ApiDocItem,
  callback: (item: ApiDocItem) => void,
) {
  item.members?.forEach((member) => {
    callback(member);
  });
}

function traverseTokens(
  item: ApiDocItem,
  callback: (item: ApiDocItem) => void,
) {
  item.excerptTokens?.forEach((token) => {
    callback(token);
  });
}

function traverse(
  item: ApiDocItem,
  callback: (item: ApiDocItem, stack: string[]) => void,
) {
  const stack: string[] = [];

  function visit(item: ApiDocItem) {
    stack.push(item.kind);
    callback(item, stack);

    traverseMembers(item, visit);
    traverseTokens(item, visit);

    stack.pop();
  }

  visit(item);
}

/**
 * rz-remoconとして出力されている名前を、指定された名称に置き換える。
 */
function replaceNames(item: ApiDocItem, from: string, to: string) {
  traverse(item, (item) => {
    if (item.name) {
      item.name = item.name.replaceAll(from, to);
    }
    if (item.canonicalReference) {
      item.canonicalReference = item.canonicalReference.replaceAll(
        `${from}!`,
        `${to}!`,
      );
    }
  });
}

type Dict = Record<string, string>;

function collectExported(item: ApiDocItem, pkg: string) {
  const dict: Dict = {};
  traverse(item, (item) => {
    if (exportedKinds.includes(item.kind)) {
      if (item.name && item.canonicalReference) {
        dict[itemKey(pkg, item.name)] = item.canonicalReference;
      }
    }
  });
  return dict;
}

function splitExcerptToken(token: ApiDocItem, dict: Dict) {
  if (token.kind !== "Content" || !token.text) {
    return [token];
  }
  const text = token.text;
  const re = /import\("(rz-remocon-\w+)"\)\.(\w+)/g;
  const out: ApiDocItem[] = [];
  let last = 0;
  while (true) {
    const m = re.exec(text);
    if (!m) {
      break;
    }
    const [whole, pkg, name] = m;
    const key = itemKey(pkg, name);
    const ref = dict[key];
    if (ref == null) {
      console.error(`${key}が解決できない......`);
      continue;
    }
    // import("pkg"). の部分は捨てて、Reference だけを残す
    if (last < m.index) {
      out.push({ kind: "Content", text: text.slice(last, m.index) });
    }
    out.push({
      kind: "Reference",
      // 画面で出どころが分かるよう、パッケージ名つきで表示する（例: rz-remocon-api.RemoteKeyDraft）
      // ※ patchMarkdown で rz-remocon-api → rz-remocon/api に変わる
      text: `${pkg}.${name}`,
      canonicalReference: ref,
    });
    last = m.index + whole.length;
  }
  if (last < text.length) {
    out.push({ kind: "Content", text: text.slice(last) });
  }
  // 空のContentを除く
  return out.filter((t) => t.kind !== "Content" || t.text !== "");
}

interface TokenRange {
  startIndex: number;
  endIndex: number;
}

function isRange(v: unknown): v is TokenRange {
  return (
    typeof v === "object" &&
    v !== null &&
    typeof (v as TokenRange).startIndex === "number" &&
    typeof (v as TokenRange).endIndex === "number"
  );
}

/**
 * item 内の *TokenRange / *TokenRanges（returnTypeTokenRange、
 * parameters[].parameterTypeTokenRange など）の添字を、分割後の添字に付け替える。
 * map は 旧index -> 新index（末尾の endIndex 分も含む）。
 */
function remapRanges(obj: unknown, map: number[]) {
  if (Array.isArray(obj)) {
    obj.forEach((o) => {
      remapRanges(o, map);
    });
    return;
  }
  if (typeof obj !== "object" || obj === null) return;
  for (const [key, value] of Object.entries(obj)) {
    if (key === "excerptTokens" || key === "members") continue;
    if (/TokenRanges?$/.test(key)) {
      const ranges = Array.isArray(value) ? value : [value];
      for (const r of ranges) {
        if (isRange(r)) {
          r.startIndex = map[r.startIndex];
          r.endIndex = map[r.endIndex];
        }
      }
    } else if (typeof value === "object") {
      remapRanges(value, map); // parameters, typeParameters など
    }
  }
}

/**
 * 直後が Reference の Content 末尾にある `import("...").` を取り除く。
 * （API Extractor が元から分割している `import("./types").Name` 用。トークン数は変えない。）
 */
function stripImportPrefix(tokens: ApiDocItem[]) {
  tokens.forEach((token, i) => {
    if (token.kind === "Content" && tokens[i + 1]?.kind === "Reference") {
      token.text = token.text?.replace(/import\("[^"]*"\)\.$/, "");
    }
  });
}

/**
 * excerptTokens の Content に含まれる `import("rz-remocon-xxx").Name` を解決する。
 *
 * - 参照先は dict（"パッケージ名/名前" → canonicalReference）で引く。
 * - トークン数が増えるので、*TokenRange の添字も付け替える。
 * @deprecated もう影響するコードがなくなった模様.....
 */
export function resolveExcerptTokens(item: ApiDocItem, dict: Dict) {
  traverse(item, (item) => {
    if (!item.excerptTokens) return;
    stripImportPrefix(item.excerptTokens);
    const map: number[] = []; // 旧index -> 新index
    const out: ApiDocItem[] = [];
    for (const token of item.excerptTokens) {
      map.push(out.length);
      out.push(...splitExcerptToken(token, dict));
    }
    map.push(out.length); // endIndex は排他的
    item.excerptTokens = out;
    remapRanges(item, map);
  });
}

export function resolveUnknownReference(item: ApiDocItem, dict: Dict) {
  traverse(item, (item) => {
    if (item.text && item.canonicalReference === "!unknown") {
      for (const pkg of ["rz-remocon", "rz-remocon-api"]) {
        const key = itemKey(pkg, item.text);
        const value = dict[key];
        if (value) {
          item.canonicalReference = value;
          return;
        }
      }
      console.log("Not resolved", item);
    }
  });
}

/**
 * API Extractor が生成する不正な分割代入パラメーターを除去する。
 */
function cleanupParameter(item: ApiDocItem) {
  if (!item.parameters) return;

  item.parameters = item.parameters.filter(
    (p) =>
      !(
        (p.parameterName.startsWith("{") || p.parameterName.startsWith("[")) &&
        p.parameterTypeTokenRange.startIndex === 0 &&
        p.parameterTypeTokenRange.endIndex === 0
      ),
  );
}

export function cleanupParameters(item: ApiDocItem) {
  traverse(item, (item) => {
    cleanupParameter(item);
  });
}

/**
 * API Extractor が生成した .api.json を読み込み変換する。
 *
 * @param inputDirectoryPath - 変換元の.api.json があるディレクトリ（例: work/doc）
 * @param outputDirectoryPath - 変換後の .api.json の出力先ディレクトリ（例: work/doc3）
 */
export function convertApiJson(
  inputDirectoryPath: string,
  outputDirectoryPath: string,
): void {
  const index = loadJson<ApiDocItem>(
    join(inputDirectoryPath, "index.api.json"),
  );
  const api = loadJson<ApiDocItem>(join(inputDirectoryPath, "api.api.json"));
  const gen = loadJson<ApiDocItem>(join(inputDirectoryPath, "gen.api.json"));

  replaceNames(api, "rz-remocon", "rz-remocon-api");
  replaceNames(gen, "rz-remocon", "rz-remocon-gen");

  const dict = {
    ...collectExported(index, "rz-remocon"),
    ...collectExported(api, "rz-remocon-api"),
  };

  // resolveExcerptTokens(gen, dict);
  resolveUnknownReference(gen, dict);
  cleanupParameters(gen);

  saveJson(join(outputDirectoryPath, "dict.json"), dict);
  saveJson(join(outputDirectoryPath, "index.api.json"), index);
  saveJson(join(outputDirectoryPath, "api.api.json"), api);
  saveJson(join(outputDirectoryPath, "gen.api.json"), gen);
}
