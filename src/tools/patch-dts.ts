import { readFileSync, writeFileSync } from "node:fs";

const table = {
  // PH1: 内部の相対パスを仮パッケージ名にする。
  // NOTE: `/`を含むパッケージ名は`ae-forgotten-export`となり、パッケージとして認識されないので一旦仮に。
  PH1: new Map([
    ['"../api"', '"rz-remocon-api"'],
    ['"../../api"', '"rz-remocon-api"'],
  ]),
  // PH2: 仮パッケージ名を実パッケージ名にする。
  PH2: new Map([["'rz-remocon-api'", "'rz-remocon/api'"]]),
};

const argv = process.argv;
const ph = process.argv[2] as keyof typeof table;
const target = table[ph];
if (!table) {
  throw new Error(`Unknown ph: ${ph}`);
}
console.log("patchDts", ph);

function patchDts(file: string) {
  const original = readFileSync(file, "utf8");
  let patched = original;
  for (const [from, to] of target) {
    patched = patched.replaceAll(from, to);
  }
  if (patched === original) {
    return;
  }
  console.log(`Patched ${file}`);
  writeFileSync(file, patched);
}

for (let i = 3; i < argv.length; i += 1) {
  patchDts(argv[i]);
}
