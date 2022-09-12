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
	plugins: ["eslint-plugin-n8n-nodes-base"],
	extends: ["plugin:n8n-nodes-base/nodes", "plugin:n8n-nodes-base/credentials"],
};
