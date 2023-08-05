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
		/**
		 * Plugin with ruleset required by eslint-config-airbnb-typescript
		 * https://github.com/iamturns/eslint-config-airbnb-typescript#2-install-eslint-plugins
		 */
		"@typescript-eslint/eslint-plugin",

		/**
		 * Plugin to lint import/export syntax
		 * https://github.com/import-js/eslint-plugin-import
		 */
		"eslint-plugin-import",

		/**
		 * Plugin to report misformatting as lint violations
		 * https://github.com/prettier/eslint-plugin-prettier
		 */
		"eslint-plugin-prettier",

		/**
		 * Plugin to lint ESLint plugins
		 * https://github.com/not-an-aardvark/eslint-plugin-eslint-plugin
		 */
		"eslint-plugin-eslint-plugin",
	],
	extends: [
		/**
		 * Config for Airbnb style guide for TS, /base to remove React rules
		 *
		 * https://github.com/iamturns/eslint-config-airbnb-typescript
		 * https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base/rules
		 */
		"eslint-config-airbnb-typescript/base",

		/**
		 * Config for rules recommended by typescript-eslint (without type checking)
		 *
		 * https://github.com/typescript-eslint/typescript-eslint/blob/1c1b572c3000d72cfe665b7afbada0ec415e7855/packages/eslint-plugin/src/configs/recommended.ts
		 */
		"plugin:@typescript-eslint/recommended",

		/**
		 * Config to disable ESLint rules covered by Prettier
		 *
		 * https://github.com/prettier/eslint-config-prettier
		 */
		"eslint-config-prettier",

		/**
		 * Recommended config for eslint-plugin-eslint-plugin
		 */
		"plugin:eslint-plugin/recommended",
	],
	rules: {
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
