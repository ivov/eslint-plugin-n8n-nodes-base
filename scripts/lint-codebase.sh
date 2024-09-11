#!/bin/bash

# This script runs all rules in `eslint-plugin-n8n-nodes-base` (as they exist in
# this commit) on `n8n-io/n8n/packages/nodes-base`. The purpose is to ensure the
# linter runs successfully (does not crash) on the entire codebase during a CI
# run. The actual lint results can be disregarded.

# To do so, we build all rules locally and run ESLint on a lint config file that
# points to those locally built rules. Specifically, we set up an
# `.eslintrc.lc.js` file that enables the `eslint-plugin-local` plugin and two
# configs: `eslint-plugin-local/nodes` and `eslint-plugin-local/credentials` .
# Those configs made up of locally built rules are in an `.eslintplugin.js`
# file, which `eslint-plugin-local` uses to resolve the rules.

# ----------------------------------------------------------- #

# 0. Install dependencies. Use npm instead of pnpm to allow 
# `eslint-plugin-local` to `require('../../.eslintplugin')`.
# `--ignore-scripts` bypasses the pnpm block at `preinstall`.

echo 'Step 0: Installing dependencies...'

npm install --ignore-scripts
npm install eslint-plugin-local@1.0.0
pnpm build


# 1. `index.js` is the entrypoint to this plugin - it is copied during build
# to `/dist/index.js` and references the rules dir at `/dist/lib/rules`.
# This reference is relative to the entrypoint's location after copy.

# `eslint-plugin-local` requires the entrypoint to be named `.eslintplugin.js`
# and located at root, so we copy `index.js` into `.eslintplugin.js`, with
# the rules dir path adjusted relative to the root of the project.

echo 'Step 1: Creating `.eslintplugin.js`...'

node scripts/make-dot-eslintplugin-js.mjs


# 2. Fetch the entire codebase from the n8n repo at GitHub.

echo 'Step 2: Fetching codebase...'

node scripts/fetch-codebase.mjs


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
    echo '❌ Error: Linter crashed while running through codebase'
    echo 'Review and fix the failing lint rule(s) before releasing'
    exit 1
fi

echo '✅ Success: Linter successfully ran through codebase'
echo 'The goal was to ensure the linter does not crash during the run'
echo 'You can disregard any actual lint errors or warnings from the run'
exit 0
