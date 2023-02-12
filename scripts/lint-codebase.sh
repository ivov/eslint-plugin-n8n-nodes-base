#!/bin/bash

echo 'Step 1: Setting up linter...'

npm ci
npm run build
node scripts/make-lint-codebase-config.mjs

# `make-lint-codebase-config.mjs` creates `.eslintplugin.js`, based on
# `dist/index.js` (same as `index.js`) but with the rules dir path adjusted
# relative to the root. `.eslintplugin.js` contains all the linter's rules
# and is referenced implicitly by `lint-codebase-config.js``

echo 'Step 2: Fetching codebase...'

node scripts/get-codebase.mjs

echo 'Step 3: Linting codebase...'

./node_modules/eslint/bin/eslint.js \
    --no-eslintrc \
    --config lint-codebase-config.js \
    --ext .ts \
    scripts/downloads \
    > lint-run.log

if [[ $? == 2 ]] ; then
    echo 'Linter crashed while running through codebase'
    exit 1
fi

echo 'Linter successfully ran through codebase'

exit 0