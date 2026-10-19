import {
  type ApiDocument,
  type ApiItem,
  ApiItemKind,
  HierarchyKind,
  loadModel,
  MarkdownRenderer,
  type RenderedDocument,
  type RenderMarkdownConfiguration,
  saveDocuments,
  transformApiModel,
} from "@fluid-tools/api-markdown-documenter";
import type {
  Heading,
  Html,
  Nodes,
  Parent,
  Root,
  RootContent,
  TableCell,
} from "mdast";
import remarkParse from "remark-parse";
import { unified } from "unified";
import type { SourceDict } from "./typedoc";
import { itemKey, saveJsonSafe } from "./utils";

function getTexts(node: Nodes) {
  if ("children" in node) {
    return node.children?.map((n) => (n.type === "text" ? n.value : undefined));
  }
  return [];
}

function getText(node: Nodes) {
  const texts = getTexts(node);
  if (texts.length === 1) {
    return texts[0];
  }
  return undefined;
}

// 表の先頭行から、各セルのテキストを順番に取り出す。
function getTableHeaders(node: Nodes): string[] {
  if (node.type !== "table") return [];

  const headerRow = node.children[0];
  if (headerRow?.type !== "tableRow") return [];

  return headerRow.children.map((cell) => getText(cell) ?? "");
}

function textOf(node: Nodes): string {
  if ("value" in node) return String(node.value);
  if ("children" in node)
    return (node.children as Nodes[]).map(textOf).join("");
  return "";
}

/**
 * 長すぎる段落か判定する。
 */
function isLongParagraph(node: RootContent): boolean {
  if (node.type !== "paragraph") return false;
  const first = node.children[0];
  const label = first?.type === "strong" ? getText(first) : undefined;
  if (label !== "Type" && label !== "Return type") {
    return false;
  }
  const text = textOf(node);
  if (text.startsWith("Type: z.") || text.startsWith("Return type: z.")) {
    return true;
  }
  if (text.includes("@orpc/contract")) {
    return true;
  }
  // console.log(text.length, text);
  return text.length > 180;
}

/**
 * 見出しか否かを判定する。
 *
 * - heading
 * - htmlでH1...H6タグ
 * @param node
 * @returns
 */
function isHeadingLike(node: RootContent | undefined): boolean {
  if (node == null) return true;
  if (node.type === "heading") return true;
  return node.type === "html" && /^<h[1-6][ >]/.test(node.value);
}

/**
 * 長い段落を消す。
 * Return type を消した結果、中身が空になった「Returns」見出しも消す。
 */
function removeLongParagraph(children: RootContent[]): RootContent[] {
  const removed = children.map((c) => isLongParagraph(c));
  if (!removed.includes(true)) {
    return children;
  }
  children.forEach((c, i) => {
    if (removed[i + 1]) {
      if (isHeadingLike(c) && isHeadingLike(children[i + 2])) {
        removed[i] = true;
      }
    }
  });
  return children.filter((_, i) => !removed[i]);
  // return next.filter((c, i) => {
  //   if (c.type !== "html" || !reReturnsH4.test(c.value)) return true;
  //   return !isHeadingLike(next[i + 1]);
  // });
}

/**
 * Descriptionセルの内容を更新する。
 *
 * - 長いコメントを最初の「。」までにする。ただし、「。」は除去する。
 * - htmlの場合、pタグで始まっているものを想定する。
 * @param cell
 * @returns 変換後のTableCell
 */
function updateDescriptionCell(cell: TableCell) {
  if (cell.children.length < 1) {
    return cell;
  }
  const item = cell.children[0];
  let nextItem = item;
  if (item.type === "html") {
    const m = /^<p>([^。]*)。?.*<\/p>/s.exec(item.value);
    if (m) {
      nextItem = {
        type: "html",
        value: m[1],
      } as Html;
    } else {
      console.warn(`未知のコメント形式：${item.value}`);
    }
  } else if (item.type === "text") {
    const eos = item.value.indexOf("。");
    if (eos > 0) {
      nextItem = {
        type: "text",
        value: item.value.substring(0, eos),
      };
    }
  }
  if (nextItem === item) {
    return cell;
  }
  return { ...cell, children: [nextItem] };
}

function withRoot(root: Nodes, callback: (root: Root) => void) {
  if (root.type !== "root") {
    return;
  }
  callback(root);
}

function dropPosition<T extends Parent>(parent: T): T {
  const { position, children, ...other } = parent;
  return {
    ...other,
    children: children.map(({ position, ...child }) => {
      if ("children" in child) {
        return dropPosition(child);
      } else {
        return child;
      }
    }),
  } as T;
}

function parseMarkdown(markdown: string): Root {
  const root = unified().use(remarkParse).parse(markdown);
  return dropPosition(root);
}

const reHeadingWithId = /<h(\d) id="(.+)">(.+)<\/h\d>/;

export function splitHeadingWithId(node: RootContent): RootContent[] {
  if (node.type !== "html") {
    return [node];
  }

  const m = reHeadingWithId.exec(node.value);
  if (!m) {
    return [node];
  }
  const [, h, id, value] = m;
  const depth = parseInt(h, 10);
  if (
    depth !== 1 &&
    depth !== 2 &&
    depth !== 3 &&
    depth !== 4 &&
    depth !== 5 &&
    depth !== 6
  ) {
    return [node];
  }

  const anchor: Html = {
    type: "html",
    value: `<a id="${id}"></a>`,
  };
  const heading: Heading = {
    type: "heading",
    depth,
    children: [
      {
        type: "text",
        value,
      },
    ],
  };

  return [anchor, heading];
}

function isSourceLinkTarget(node: Heading, parents: string[]) {
  if (parents.length === 1 && node.depth === 3) {
    return true;
  }
  if (parents.length === 2 && node.depth === 1) {
    return true;
  }
  return false;
}

function addSourceLink(
  node: RootContent,
  pkg: string,
  parents: string[],
  sourceDict: SourceDict,
): RootContent[] {
  if (node.type !== "heading" || !isSourceLinkTarget(node, parents)) {
    return [node];
  }
  const name = getText(node);
  if (!name) {
    return [node];
  }
  const sourceList = sourceDict[itemKey(pkg, name)];
  if (!sourceList?.length) {
    return [node];
  }

  const md =
    "Source: " +
    sourceList
      .map(
        (s) =>
          `[src/${s.fileName}:${s.line}](../../src/${s.fileName}#L${s.line})`,
      )
      .join(", ");
  const parsed = parseMarkdown(md);
  return [node, ...parsed.children];
}

function createBreadcrumb(parents: string[]) {
  const md = ['[README](../../README.md)'];
  for (let i = 0; i < parents.length; i += 1) {
    if (i < parents.length - 1) {
      md.push(`[${parents[i]}](../../${parents[i]}/)`);
    }
  }
  md.push(parents[parents.length - 1]);
  const parsed = parseMarkdown(md.join(' / '));
  return parsed.children[0];
}

function patchRoot(
  root: Root,
  sourceDict: SourceDict,
  parents: string[],
): void {
  const pkgMap: Record<string, string> = {
    "rz-remocon": "lib",
    "rz-remocon-api": "api",
    "rz-remocon-gen": "gen",
  };

  const pkg = pkgMap[parents[0]];
  if (pkg == null) {
    throw new Error(`Unknown package name: ${parents.join(",")}`);
  }
  root.children = root.children.flatMap((node) => splitHeadingWithId(node));
  root.children = root.children.flatMap((node) =>
    addSourceLink(node, pkg, parents, sourceDict),
  );
  root.children.forEach((node) => {
    if (node.type === "table") {
      const tableHeaders = getTableHeaders(node);
      const descIndex = tableHeaders.indexOf("Description");
      // 先頭とDescriptionを残す。
      const filterHeaders = tableHeaders.map(
        (_, i) => i === 0 || i === descIndex,
      );
      node.children.forEach((row) => {
        row.children = row.children
          .map((cell, index) =>
            index === descIndex ? updateDescriptionCell(cell) : cell,
          )
          .filter((_, index) => filterHeaders[index]);
      });
    }
  });
  root.children = removeLongParagraph(root.children);
  root.children.unshift(createBreadcrumb(parents));
}

function getParentNames(item: ApiItem, stack: string[]) {
  // Model
  // + Package <- ココ
  //   + EntryPoint
  //     + Class <- ココ
  if (item.kind !== "Model" && item.kind !== "EntryPoint") {
    stack.unshift(item.displayName);
  }
  if (item.parent) {
    getParentNames(item.parent, stack);
  }
  return stack;
}

function patchDocument(document: ApiDocument, sourceDict: SourceDict) {
  const parents = getParentNames(document.apiItem, []);
  withRoot(document.contents, (root) => patchRoot(root, sourceDict, parents));
}

function patchMarkdown(md: string): string {
  return (
    md
      .replaceAll("rz-remocon-api", "rz-remocon/api")
      .replaceAll("rz-remocon/api/", "rz-remocon-api/")
      .replaceAll("rz-remocon-gen", "rz-remocon/gen")
      .replaceAll("rz-remocon/gen/", "rz-remocon-gen/")
      // リンクを展開する。
      .replace(/\(\.\.\/[^)]+\)/g, (substring) => {
        if (substring.endsWith("/)")) {
          return substring.replace("/)", "/index.md)");
        }
        if (substring.includes("/#")) {
          return substring.replace("/#", "/index.md#");
        }
        return substring.replace("-class", "-class.md");
      })
  );
  // コメントの <img> が二重にエスケープされて出るのを直す
  // （表の中の html は <code>、本文は `…` にする）
  // →実際にhtml変換すると平気らしいのでやらない。
  // .replaceAll("&#x26;lt;img&#x26;gt;", "<code>&lt;img&gt;</code>")
  // .replaceAll("\\&lt;img\\&gt;", "`<img>`")
}

export async function loadApiDocuments(modelDirectoryPath: string) {
  // Create the API Model from our API reports
  const apiModel = await loadModel({
    modelDirectoryPath,
  });

  const documents = transformApiModel({
    apiModel,
    uriRoot: "..",
    includeBreadcrumb: false,
    hierarchy: {
      // パッケージは「フォルダ + index」ではなく、1ファイルにする
      // [ApiItemKind.Package]: HierarchyKind.Document,
      // 以下はすべて、パッケージのページ内の節にする
      // [ApiItemKind.Class]: HierarchyKind.Section,
      [ApiItemKind.Interface]: HierarchyKind.Section,
      [ApiItemKind.TypeAlias]: HierarchyKind.Section,
      [ApiItemKind.Enum]: HierarchyKind.Section,
      [ApiItemKind.Namespace]: HierarchyKind.Section,
    },
  });

  return documents;
}

export function renderApiDocuments(
  documents: ApiDocument[],
  conf: RenderMarkdownConfiguration = {},
): RenderedDocument[] {
  return documents.map((d) => MarkdownRenderer.renderDocument(d, conf));
}

export async function saveRenderedDocuments(
  outputDirectoryPath: string,
  documents: RenderedDocument[],
) {
  await saveDocuments(documents, { outputDirectoryPath });
}

/**
 * API Extractor の .api.json から Markdown の API リファレンスを生成する。
 *
 * @param modelDirectoryPath - .api.json が入っているディレクトリ
 * @param outputDirectoryPath - Markdown の出力先ディレクトリ
 */
export async function generateApiDocsMd(
  modelDirectoryPath: string,
  outputDirectoryPath: string,
  workDirectoryPath: string,
  sourceDict: SourceDict,
): Promise<void> {
  const documents = (await loadApiDocuments(modelDirectoryPath))
    // Modelを取り除く
    .filter((d) => d.apiItem.kind !== "Model");

  saveJsonSafe(`${workDirectoryPath}/documents.json`, documents);
  documents.forEach((d) => {
    patchDocument(d, sourceDict);
  });
  saveJsonSafe(`${workDirectoryPath}/documents.patched.json`, documents);

  const rendered = renderApiDocuments(documents);
  saveJsonSafe(
    `${workDirectoryPath}/rendered.json`,
    rendered.map((d) => ({
      displayName: d.apiItem.displayName,
      contents: d.contents,
    })),
  );

  const patched = rendered
    .map((d) => {
      console.log(d.apiItem.displayName);
      return d;
    })
    .map((d) => ({
      ...d,
      contents: patchMarkdown(d.contents),
    }));
  saveJsonSafe(
    `${workDirectoryPath}/rendered.patched.json`,
    rendered.map((d) => ({
      displayName: d.apiItem.displayName,
      contents: d.contents,
    })),
  );

  await saveRenderedDocuments(outputDirectoryPath, patched);
}
