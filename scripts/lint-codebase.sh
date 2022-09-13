#!/bin/bash

echo 'Linting codebase...'

./node_modules/eslint/bin/eslint.js --no-eslintrc --config lint-codebase-config.js --ext .ts scripts/downloads

if [[ $? == 2 ]] ; then
    echo "Linter crashed while linting codebase"
    exit 1
fi

exit 0