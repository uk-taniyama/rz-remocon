import { itemKey, loadJson } from "./utils";

function traverseChildren(
  item: TypeDocItem,
  callback: (item: TypeDocItem) => void,
) {
  item.children?.forEach((child) => {
    callback(child);
  });
}

function traverse(
  item: TypeDocItem,
  callback: (item: TypeDocItem, stack: TypeDocItem[]) => void,
) {
  const stack: TypeDocItem[] = [];

  function visit(item: TypeDocItem) {
    stack.push(item);
    callback(item, stack);

    traverseChildren(item, visit);

    stack.pop();
  }

  visit(item);
}

export const ReflectionKindMap = {
  Project: 0x1,
  Module: 0x2,
  Namespace: 0x4,
  Enum: 0x8,
  EnumMember: 0x10,
  Variable: 0x20,
  Function: 0x40,
  Class: 0x80,
  Interface: 0x100,
  Constructor: 0x200,
  Property: 0x400,
  Method: 0x800,
  CallSignature: 0x1000,
  IndexSignature: 0x2000,
  ConstructorSignature: 0x4000,
  Parameter: 0x8000,
  TypeLiteral: 0x10000,
  TypeParameter: 0x20000,
  Accessor: 0x40000,
  GetSignature: 0x80000,
  SetSignature: 0x100000,
  TypeAlias: 0x200000,
  Reference: 0x400000,
  /**
   * Generic non-ts content to be included in the generated docs as its own page.
   */
  Document: 0x800000,
};

export interface SourceRef {
  fileName: string;
  line: number;
  character: number;
}

/**
 * typedocで出力したjsonの型。
 */
interface TypeDocItem {
  children?: TypeDocItem[];
  kind: number;
  name: string;
  sources?: SourceRef[];
}

export type SourceDict = Record<string, SourceRef[]>;

export function createSourceDict(docs: TypeDocItem): SourceDict {
  const dict: SourceDict = {};
  let pkg = "";
  traverse(docs, (item, stack) => {
    // moduleをパッケージ名として覚える。
    if (item.kind === ReflectionKindMap.Module) {
      pkg = item.name;
      return;
    }
    if (item.kind === ReflectionKindMap.Property) {
      return;
    }
    // ソース情報を覚える。
    if (pkg && item.sources?.length) {
      const key = itemKey(pkg, item.name);
      if (key in dict) {
        console.warn(
          `${key}が複数存在します。`,
          dict[key],
          item.sources,
          stack.map((s) => s.kind.toString(16)),
        );
        return;
      }
      dict[itemKey(pkg, item.name)] = item.sources;
    }
  });
  return dict;
}

let sourceDict: SourceDict | undefined;

export function loadSourceDict(jsonPath: string) {
  sourceDict = createSourceDict(loadJson<TypeDocItem>(jsonPath));
  return sourceDict;
}

export function getSourceList(pkg: string, name: string) {
  return sourceDict?.[itemKey(pkg, name)];
}

export function warn(pkg: string, name: string, message: string) {
  const sourceList = getSourceList(pkg, name);
  const source = sourceList
    ? `${sourceList[0].fileName}:${sourceList[0].line}`
    : "???:??";
  console.warn(`${source} ${message}`);
}
