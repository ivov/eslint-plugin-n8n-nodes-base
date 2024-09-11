#!/bin/bash

# This script runs this commit of `eslint-plugin-n8n-nodes-base` on the
# n8n codebase to ensure the linter does not crash during the run.

# ----- #

# 0. Install dependencies with npm. We must use npm instead of pnpm to 
# allow `eslint-plugin-local` to `require('../../.eslintplugin')`.
# The flag `--ignore-scripts` bypasses the pnpm block at `preinstall`.

echo 'Step 0: Setting up...'

npm install --ignore-scripts
npm install eslint-plugin-local@1.0.0
pnpm build

# ----- #

# 1. `index.js` is the entrypoint to this plugin - it is copied during build
# to `/dist/index.js` and references the rules dir at `/dist/lib/rules`.
# This reference is relative to the entrypoint's location after copy.

# `eslint-plugin-local` requires the entrypoint to be named `.eslintplugin.js`
# and located at root, so we copy `index.js` into `.eslintplugin.js`, with
# the rules dir path adjusted relative to the root of the project.

echo 'Step 1: Creating .eslintplugin.js...'

node scripts/make-dot-eslintplugin-js.mjs

# ----- #

# 2. Fetch the entire codebase from the n8n repo at GitHub.

echo 'Step 2: Fetching codebase...'

node scripts/fetch-codebase.mjs

# ----- #

# 3. Run this commit of `eslint-plugin-n8n-nodes-base` on the codebase, 
# using the ESLint config `eslintrc.lc.js` (lc -> lint codebase), which
# references `.eslintplugin.js` (all rules) via `eslint-plugin-local`.
# The flag `--no-eslintrc` prevents ESLint from finding and using
# the sibling `.eslintrc.js` that is intended for this plugin.

echo 'Step 3: Linting codebase...'

./node_modules/eslint/bin/eslint.js \
    --no-eslintrc \
    --config .eslintrc.lc.js \
    --ext .ts \
    scripts/downloads

# ----- #

if [[ $? == 2 ]] ; then
    echo 'ERROR: Linter crashed while running through codebase'
    exit 1
fi

echo 'SUCCESS: Linter successfully ran through codebase'
echo 'Ignore any actual lint errors or warnings from the run'
exit 0
