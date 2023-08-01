/**
 * @type {import('jest').Config}
 */
module.exports = {
	testEnvironment: "node",
	transform: { "^.+\\.ts$": "esbuild-jest" },
	testPathIgnorePatterns: [
		"/dist/",
		"/node_modules/",
		"/scripts/downloads",
		"/scratchpad/",
	],
};
