[//]: # "File generated from a template. Do not edit this file directly."

# node-param-option-name-wrong-for-get-all

Option `name` for Get All node parameter must be `Get All`

📋 This rule is part of the `plugin:n8n-nodes-base/nodes` config.

🔧 Run ESLint with `--fix` option to autofix the issue flagged by this rule.

## Examples

❌ Example of **incorrect** code:

```js
const test = {
	name: "List",
	value: "getAll",
};
```

✅ Example of **correct** code:

```js
const test = {
	name: "Get All",
	value: "getAll",
};
```

## Links

- [Rule source](../../lib/rules/node-param-option-name-wrong-for-get-all.ts)
- [Test source](../../tests/node-param-option-name-wrong-for-get-all.test.ts)
