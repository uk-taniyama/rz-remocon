#!/bin/sh
set -e

rm -rf work dist

tsup
vite build
tsx --tsconfig tsconfig.gen.json src/gen/default-remocon.ts dist/public/data
cp scripts/remote.js dist/public/assets/
tsc -p tsconfig.dts.json
tsc -p tsconfig.dts.gen.json
npx tsx src/tools/patch-dts.ts PH1 $(find work/ -name '*.d.ts')
api-extractor run --local -c api-extractor.lib.json
api-extractor run --local -c api-extractor.api.json
api-extractor run --local -c api-extractor.gen.json
npx tsx src/tools/patch-dts.ts PH2 $(find dist/ -name '*.d.ts')

# typedoc
cd typedoc
if [ ! -d node_modules ]
then
  npm i
fi
npm run gen
cd ..

# generate-docs.ts <api-json-dir> <typedoc-json> <work-dir> <out-dir>
npx tsx src/tools/generate-docs.ts work/doc work/typedoc/docs.json work/gen-docs refs
