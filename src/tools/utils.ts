import { readFileSync, writeFileSync } from "node:fs";
import { stringify } from "safe-stable-stringify";

/** "<パッケージ名>/<項目名>" 形式のキーを作る（例: "api/RemoconBuilder"） */
export function itemKey(pkg: string, name: string): string {
  return `${pkg}/${name}`;
}

export function loadJson<T = unknown>(jsonPath: string): T {
  return JSON.parse(readFileSync(jsonPath, "utf-8"));
}

export function saveJson(jsonPath: string, data: unknown) {
  writeFileSync(jsonPath, JSON.stringify(data, null, 2));
}

export function saveJsonSafe(jsonPath: string, data: unknown) {
  writeFileSync(jsonPath, `${stringify(data, null, 2)}`);
}
