#!/usr/bin/env pwsh

$ErrorActionPreference = "Stop"

npx vue-cli-service build

cd dist

git init
git add -A
git commit -m 'deploy from ngexplorer-vue'

git push -f git@github.com:ngchain/ngexplorer.git master

rm -r -fo .git
cd -
