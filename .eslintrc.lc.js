/**
 * ESLint config for the `lint-codebase` command. See `scripts/lint-codebase.sh`.
 *
 * @type {import('@types/eslint').ESLint.ConfigData}
 */
module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	plugins: ["eslint-plugin-local"],

	/**
	 * `eslint-plugin-local` references `.eslintplugin.js`.
	 */
	extends: [
		"plugin:eslint-plugin-local/nodes",
		"plugin:eslint-plugin-local/credentials",
	],
};
