import {
  type DocComment,
  type DocNode,
  DocNodeKind,
  TSDocParser,
} from "@microsoft/tsdoc";

const parser = new TSDocParser();

export function parseComment(comment: string) {
  return parser.parseString(comment);
}

/** TSDoc のノードを装飾を落としたざっくりした文字列にする。 */
export function docNodeToString(node: DocNode | undefined): string {
  if (node == null) {
    return "";
  }
  switch (node.kind) {
    case DocNodeKind.PlainText:
      return (node as DocNode & { text: string }).text;
    case DocNodeKind.EscapedText:
      return (node as DocNode & { decodedText: string }).decodedText;
    case DocNodeKind.CodeSpan:
      return (node as DocNode & { code: string }).code;
    case DocNodeKind.FencedCode:
      return (node as DocNode & { code: string }).code;
    case DocNodeKind.LinkTag: {
      const link = node as DocNode & { linkText?: string };
      return link.linkText ?? "";
    }
    case DocNodeKind.SoftBreak:
      return " ";
    default:
      return node.getChildNodes().map(docNodeToString).join("");
  }
}

export type DocCommentRecord = {
  summary: string;
  remarks?: string;
  params: Record<string, string>;
  returns?: string;
  deprecated?: string;
};

const blockText = (block?: { content: DocNode }): string | undefined =>
  (block && docNodeToString(block.content).trim()) || undefined;

export function toDocCommentRecord(comment: DocComment): DocCommentRecord {
  const params: Record<string, string> = {};
  for (const param of comment.params) {
    params[param.parameterName] = docNodeToString(param.content).trim();
  }

  const result: DocCommentRecord = {
    summary: docNodeToString(comment.summarySection).trim(),
    params,
    remarks: blockText(comment.remarksBlock),
    returns: blockText(comment.returnsBlock),
    deprecated: blockText(comment.deprecatedBlock),
  };
  return result;
}

/** TSDoc 形式のコメント文字列をパースして、要約・`remarks` などを持つレコードにする。 */
export function createDocCommentRecord(comment: string): DocCommentRecord {
  return toDocCommentRecord(parseComment(comment).docComment);
}
