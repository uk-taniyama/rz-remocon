import type { Parent, Root } from "mdast";
import remarkParse from "remark-parse";
import { unified } from "unified";

export function dropPosition<T extends Parent>(parent: T): T {
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

export function parseMarkdown(markdown: string): Root {
  const root = unified().use(remarkParse).parse(markdown);
  return dropPosition(root);
}
