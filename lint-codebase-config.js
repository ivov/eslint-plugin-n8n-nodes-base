/**
 * Base config for the `lint-codebase` command.
 * 
 * Implicitly references rules in `.eslintplugin.js` via `eslint-plugin-local`.
 *
 * @type {import('@types/eslint').ESLint.ConfigData}
 */
module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ["./tsconfig.json"],
	},
	plugins: ["eslint-plugin-local"],
	extends: ["plugin:eslint-plugin-local/nodes", "plugin:eslint-plugin-local/credentials"],
};
