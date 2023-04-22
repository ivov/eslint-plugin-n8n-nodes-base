/**
 * Base config for the `lint-codebase` command.
 *
 * @type {import('@types/eslint').ESLint.ConfigData}
 */
module.exports = {
	parser: "@typescript-eslint/parser",
	plugins: ["eslint-plugin-local"],

	/**
	 * `eslint-plugin-local` references the `nodes` and `credentials` configs in
	 * `.eslintplugin.js`, which is based on this project's `dist/index.js`.
	 * Hence this requires `eslint-plugin-n8n-nodes-base` to be installed.
	 */
	extends: ["plugin:eslint-plugin-local/nodes", "plugin:eslint-plugin-local/credentials"],
};
