#!/bin/bash


echo "Build library"
yarn babel src --out-dir lib --delete-dir-on-start --extensions .ts,.tsx --ignore '**/*.d.ts'  --copy-files --no-copy-ignored
yarn babel src --out-dir cjs --env-name cjs --delete-dir-on-start --extensions .ts,.tsx --ignore '**/*.d.ts' --copy-files --no-copy-ignored


echo "{ \"type\": \"commonjs\" }" > ./cjs/package.json

echo "Generate types"
yarn tsc -p . --emitDeclarationOnly --declaration --outDir lib
yarn tsc -p . --emitDeclarationOnly --declaration --outDir cjs
