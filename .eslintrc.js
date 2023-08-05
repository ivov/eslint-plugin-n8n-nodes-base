/**
 * @type {import('@types/eslint').ESLint.ConfigData}
 */
module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
	},
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: ["./tsconfig.json"],
	},
	plugins: [
		"@typescript-eslint/eslint-plugin",
		"eslint-plugin-import",
		"eslint-plugin-prettier",
		"eslint-plugin-eslint-plugin",
	],
	extends: [
		"eslint-config-airbnb-typescript/base",
		"plugin:@typescript-eslint/recommended",
		"eslint-config-prettier",
		"plugin:eslint-plugin/recommended",
	],
	rules: {
		// https://github.com/prettier/eslint-plugin-prettier#arrow-body-style-and-prefer-arrow-callback-issue
		"arrow-body-style": "off",
		"prefer-arrow-callback": "off",

		"@typescript-eslint/ban-ts-comment": "off",
		"@typescript-eslint/no-use-before-define": "off",
		"@typescript-eslint/naming-convention": [
			"error",
			{
				selector: "variable",
				format: ["camelCase", "PascalCase", "UPPER_CASE"],
				leadingUnderscore: "allow",
			},
		],
		"@typescript-eslint/no-unused-vars": [
			"error",
			{
				argsIgnorePattern: "^_",
				destructuredArrayIgnorePattern: "^_",
				varsIgnorePattern: "^_",
				ignoreRestSiblings: true,
			},
		],
	},
};
