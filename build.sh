#!/bin/bash


echo "Build library"
yarn babel src --out-dir lib --delete-dir-on-start --extensions .ts,.tsx --ignore '**/*.d.ts'
yarn babel src --out-dir cjs --env-name cjs --delete-dir-on-start --extensions .ts,.tsx --ignore '**/*.d.ts'  


echo "{ \"type\": \"commonjs\" }" > ./cjs/package.json

echo "Generate types"
yarn tsc -p . --emitDeclarationOnly --declaration --outDir lib
yarn tsc -p . --emitDeclarationOnly --declaration --outDir cjs

yarn cpy types/*.d.ts lib
yarn cpy types/*.d.ts cjs