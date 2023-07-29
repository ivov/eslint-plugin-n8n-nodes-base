const RULESET = [
	// "plugin:n8n-nodes-base/credentials",
	"plugin:n8n-nodes-base/nodes",
	// "plugin:n8n-nodes-base/community",
];

const RULES = {
	// "n8n-nodes-base/cred-class-field-placeholder-url-missing-eg": "error",
	// "n8n-nodes-base/node-class-description-name-miscased": "error",
	// "n8n-nodes-base/community-package-json-license-missing": "error",
};

module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ["./tsconfig.json"],
		extraFileExtensions: [".json"], // for community rules
	},
	ignorePatterns: ["tsconfig.json"],
	plugins: ["eslint-plugin-n8n-nodes-base"],
	...(RULESET.length > 0 ? { extends: RULESET } : {}),
	...(Object.keys(RULES).length > 0 ? { rules: RULES } : {}),
};
