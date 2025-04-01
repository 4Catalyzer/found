#!/bin/bash


echo "Build parser"
yarn patch-package 
yarn rollup -c rollup.config.js

echo "Build library"
yarn babel src --out-dir lib --delete-dir-on-start -x .ts,.tsx,.js,.mjs --env-name esm
yarn babel src --out-dir cjs --delete-dir-on-start -x .ts,.tsx,.js,.mjs --env-name cjs

echo "replace import placeholder"
sed -i '' 's/__IMPORT__/(s) => import(\/* webpackIgnore: true \*\/ \/\* @vite-ignore \*\/ s)/' ./{lib,cjs}/Provider.js

echo "{ \"type\": \"commonjs\" }" > ./cjs/package.json

echo "Generate types"
yarn tsc -p . --emitDeclarationOnly --declaration --outDir lib
yarn tsc -p . --emitDeclarationOnly --declaration --outDir cjs

