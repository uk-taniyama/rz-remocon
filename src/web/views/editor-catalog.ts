/*
 * エディタのカタログ（追加できるキーの一覧）。
 * REGZA のキー、特殊キー（タブ・ラベル）、任意のコードを持つカスタムキーを、
 * 追加用の項目（`RemoteKeyCatalogEntry`）として扱う。
 * 描画は行わない。アイコンの有無は、`createEditorCatalog` の引数 `hasIcon` で決める。
 */
import type { ReactNode } from "react";
import {
  type ColorResolver,
  RemoteKeys,
  resolveRemoteKeyKindDef,
  SPECIAL_KEY_DEFS,
} from "../../api";
import type { RemoteKeyIconRender } from "../remoteKeys";
import { GRID_COLUMNS, type RemoteKeyCatalogEntry, UNIT } from "./editor-grid";

/** カスタムキー（任意のコードを持つキー）の名前。カタログの一覧には含まれない。 */
const CUSTOM_KEY_NAME = "custom";

/**
 * 入力されたコードから、カスタムキーのカタログ項目を生成する。
 *
 * @param code - カスタムキーのコード。空文字列の場合は、コードもラベルも空のキーになる。
 */
export function customKeyEntry(code: string): RemoteKeyCatalogEntry {
  const def = resolveRemoteKeyKindDef(CUSTOM_KEY_NAME);
  return {
    kind: def.kind,
    name: CUSTOM_KEY_NAME,
    // コードが空文字列の場合は、コードもラベルも空になる。空のコードは送信できず、ラベルは後から編集できる。
    code,
    label: code,
    showLabel: true,
    color: def.color,
    w: UNIT,
    h: UNIT,
  };
}

/** 指定した名前のアイコンが存在するかを返す関数。 */
export type HasIcon = (name: string) => boolean;

/**
 * カタログの全項目（REGZA のキーと、特殊キー）を生成する。
 * アイコンがあるキーは、`icon` にキー名を設定し、ラベルを隠す（Builder の decorator と同じ）。
 * `hasIcon` が `true` を返すキー名を、アイコンありとして扱う。
 * `useEditorData` は、`useIconSet` の `hasIcon`（標準のアイコンとアイコン URL 対応表（`icon-urls.json`））を渡す。
 *
 * @param hasIcon - 指定した名前のアイコンが存在するかを返す関数。
 */
export function createEditorCatalog(
  hasIcon: HasIcon,
  colorResolver: ColorResolver,
): RemoteKeyCatalogEntry[] {
  const remoteKeyCatalog = Object.values(RemoteKeys).map((key) => {
    const kindDef = resolveRemoteKeyKindDef(key.name);
    const icon = hasIcon(key.name) ? key.name : undefined;
    return {
      kind: kindDef.kind,
      name: key.name,
      code: key.code,
      icon,
      label: key.label,
      showLabel: key.showLabel ?? !icon,
      color: colorResolver(key.name),
      w: UNIT,
      h: UNIT,
    } satisfies RemoteKeyCatalogEntry;
  });
  const specialKeyCatalog: RemoteKeyCatalogEntry[] = Object.entries(
    SPECIAL_KEY_DEFS,
  ).map(([name, def]) => ({
    kind: resolveRemoteKeyKindDef(name).kind,
    name,
    label: def.label,
    showLabel: true,
    color: colorResolver(name),
    w: def.fullWidth ? GRID_COLUMNS : UNIT,
    h: UNIT,
  }));
  return [...remoteKeyCatalog, ...specialKeyCatalog];
}

/**
 * カタログの項目のアイコンを描画する。`icon` がない場合は `null` を返す。
 * 描画関数には、キー一覧と同じもの（標準のアイコンとアイコン URL 対応表（`icon-urls.json`）を使用するもの）を渡す。
 */
export function renderCatalogIcon(
  entry: RemoteKeyCatalogEntry,
  iconRender: RemoteKeyIconRender,
): ReactNode {
  if (entry.icon === undefined) {
    return null;
  }
  return iconRender({
    name: entry.name,
    icon: entry.icon,
    color: entry.color,
    x: 0,
    y: 0,
    w: entry.w,
    h: entry.h,
  });
}

/* -------------------------------------------------------------------------- */
/* 特殊キーのカタログ                                                         */
/* -------------------------------------------------------------------------- */
