#!/usr/bin/env pwsh
npx vue-cli-service build

cd dist

git init
git add -A
git commit -m 'deploy from ngexplorer-vue'

git push -f https://github.com/ngchain/ngexplorer.git master

rm -r -fo .git
cd -
