import { type RemoteKeyConfig, TAB_KEY_NAME } from "../../api";

/** タブ1個分のグループ。タブ自身と、そのタブに属するキー。 */
export interface RemoteKeyTabGroup {
  tab: RemoteKeyConfig;
  buttons: RemoteKeyConfig[];
}

/**
 * タブで始まるキーの並びを、タブごとのグループに分ける。
 * 各グループには、そのタブから次のタブの手前までのキーを含める。
 * キーの `y` 座標は、タブの下端を 0 とした相対的な値に変換する。
 * 先頭がタブでない場合は、既存の表示（タブなし）を維持するため、`undefined` を返す。
 */
export function groupRemoteKeysByTab(
  keys: RemoteKeyConfig[],
): RemoteKeyTabGroup[] | undefined {
  if (keys[0]?.name !== TAB_KEY_NAME) return undefined;

  const groups: RemoteKeyTabGroup[] = [];
  let currentGroup: RemoteKeyTabGroup | undefined;

  for (const key of keys) {
    if (key.name === TAB_KEY_NAME) {
      currentGroup = { tab: key, buttons: [] };
      groups.push(currentGroup);
    } else {
      if (currentGroup) {
        currentGroup.buttons.push({
          ...key,
          y: key.y - currentGroup.tab.y - currentGroup.tab.h,
        });
      }
    }
  }

  return groups;
}
