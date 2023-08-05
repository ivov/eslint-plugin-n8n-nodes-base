# Scratchpad

This dir is a scratchpad for checking rules against nodes, credentials and community files. These can be sample files, or all nodes and credentials in the n8n codebase.

## Sample checks

To lint sample files:

0. Edit the lint rule at `lib/rules` and build the project with `pnpm build`.

1. Edit a file at `sample/nodes`, `sample/credentials` or `sample/community`. This is the target to lint.

2. In `.eslintrc.js` enable the ruleset or rule to check.

```js
// to check all rules in the credentials ruleset
const RULESET = ["plugin:n8n-nodes-base/credentials"];

// to check a single node rule against the sample target
const RULES = {
	"n8n-nodes-base/node-class-description-name-miscased": "error",
};
```

3. Run the relevant check:

```sh
pnpm sample:creds
pnpm sample:nodes
pnpm sample:community
```

## Codebase checks

To lint all nodes and credentials from the n8n codebase:

1. At your local n8n dir, switch to the branch containing the files to check, and set the env var `LOCAL_N8N_DIR` to your local n8n dir, e.g. `export LOCAL_N8N_DIR=$HOME/Development/n8n`

2. Run `pnpm codebase:prepare` to copy over the codebase files to `scratchpad/codebase`. This step is needed because cross-repository linting is not supported.

3. In `.eslintrc.js` enable the ruleset or rule to check.

4. Run the relevant check:

```sh
pnpm codebase:creds
pnpm codebase:nodes
```
