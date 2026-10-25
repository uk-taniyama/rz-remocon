import { describe, expect, it } from "vitest";
import { docNodeToString, parseComment, toDocCommentRecord } from "./tsdoc";

describe("parseComment", () => {
  it("TSDoc コメントを解析し、summary とタグを取り出す", () => {
    const { docComment, log } = parseComment(`
      /**
       * 概要です。
       *
       * @param value - 値の説明。
       * @returns 結果の説明。
       */
    `);

    expect(log.messages).toHaveLength(0);
    expect(toDocCommentRecord(docComment)).toEqual({
      summary: "概要です。",
      params: { value: "値の説明。" },
      returns: "結果の説明。",
    });
  });

  it("不正な @param の診断を返す", () => {
    const { log } = parseComment(`/**
     * @param value 説明にハイフンがない
     */`);

    expect(log.messages.map((message) => message.messageId)).toContain(
      "tsdoc-param-tag-missing-hyphen",
    );
  });

  it("linkを確認する", () => {
    const links = [
      // tsdoc-reference-missing-hash (1,12): The declaration reference appears to contain a package name or import path, but it is missing the "#" delimiter api/remoconBuilder
      "{@link api/remoconBuilder} で作成可能。",
      // tsdoc-link-tag-destination-syntax (1,15): Unexpected character after link destination !
      "{@link api!remoconBuilder} で作成可能。",
      "{@link api.remoconBuilder} で作成可能。",
      "{@link api#remoconBuilder} で作成可能。",
      // tsdoc-reference-missing-hash (1,12): The declaration reference appears to contain a package name or import path, but it is missing the "#" delimiter rz-remocon-api/remoconBuilder
      "{@link rz-remocon-api/remoconBuilder} で作成可能。",
      "{@link rz-remocon-api!remoconBuilder} で作成可能。",
      // tsdoc-link-tag-destination-syntax (1,14): Unexpected character after link destination -
      "{@link rz-remocon-api.remoconBuilder} で作成可能。",
      // tsdoc-link-tag-destination-syntax (1,14): Unexpected character after link destination -
      "{@link rz-remocon-api#remoconBuilder} で作成可能。",
    ];
    links.forEach((link) => {
      const comment = parseComment(`/** ${link} */`);
      console.log(link);
      console.log(
        comment.log.messages
          .map(
            (message) =>
              `${message.messageId} ${message.text} ${message.tokenSequence}`,
          )
          .join(),
      );
    });
  });
});

describe("docNodeToString", () => {
  it("装飾、リンク、コード、エスケープをプレーンテキスト化する", () => {
    const { docComment } = parseComment(
      "/**\n * 通常 {@link Thing | 表示名} \\{literal\\} \\`code\\`\n */",
    );

    expect(docNodeToString(docComment.summarySection).trim()).toBe(
      "通常 表示名 {literal} `code`",
    );
  });

  it("改行を空白にし、fenced code の本文を返す", () => {
    const { docComment } = parseComment(
      "/**\n * 一行目\n * 二行目\n *\n * ```ts\n * const answer = 42;\n * ```\n */",
    );

    expect(docNodeToString(docComment.summarySection)).toBe(
      "一行目 二行目  const answer = 42;\n",
    );
  });
});

describe("docCommentToRecord", () => {
  it("remarks と deprecated を含むレコードに変換する", () => {
    const { docComment } = parseComment(`/**
     * 概要。
     *
     * @remarks 補足です。
     * @deprecated 古い API です。
     */`);

    expect(toDocCommentRecord(docComment)).toEqual({
      summary: "概要。",
      params: {},
      remarks: "補足です。",
      deprecated: "古い API です。",
    });
  });

  it("空のブロックは省略する", () => {
    const { docComment } = parseComment(`/**
     * 概要。
     * @remarks
     * @returns
     * @deprecated
     */`);

    expect(toDocCommentRecord(docComment)).toEqual({
      summary: "概要。",
      params: {},
    });
  });
});
