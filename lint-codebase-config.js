/**
 * Config for the `lint-codebase` command.
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
