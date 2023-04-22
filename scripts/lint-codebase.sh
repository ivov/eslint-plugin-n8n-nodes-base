#!/bin/bash

echo 'Step 1: Setting up linter...'

npm ci
npm run build
node scripts/make-lint-codebase-config.mjs

# `make-lint-codebase-config.mjs` creates `.eslintplugin.js`, based on
# `dist/index.js` (same as `index.js`) but with the rules dir path adjusted
# relative to the root. `.eslintplugin.js` contains all this project's configs
# and is referenced by `lint-codebase-config.js` via `eslint-plugin-local`.

# @TODO: Why is `.eslintplugin.js` based on `dist/index.js` instead of the root `index.js`?

echo 'Step 2: Fetching codebase...'

node scripts/get-codebase.mjs

echo 'Step 3: Linting codebase...'

npm i eslint-plugin-n8n-nodes-base
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