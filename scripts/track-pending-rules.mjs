import { writeFile, access } from "fs/promises";
import fetch from "node-fetch";

async function downloadEslintConfig() {
	const NODES_BASE_LINT_CONFIG_URL =
		"https://raw.githubusercontent.com/n8n-io/n8n/master/packages/nodes-base/.eslintrc.js";

	const response = await fetch(NODES_BASE_LINT_CONFIG_URL);
	const text = await response.text();

	const asEs6 = text
		.replace("module.exports = ", "export default ")
		.replace(/const.*;/, "")
		.replace("...sharedOptions(__dirname),", "");

	await writeFile("scripts/downloads/nodes-base-eslint-config.mjs", asEs6);
}

function getUsedRules(eslintConfig) {
	return eslintConfig.overrides.reduce(
		(acc, o) => {
			if (o.files.some((f) => f.includes("nodes"))) {
				return {
					...acc,
					nodes: Object.entries(o.rules)
						.filter(([_, value]) => value === "error")
						.map(([key, _]) => key),
				};
			}

			if (o.files.some((f) => f.includes("credentials"))) {
				return {
					...acc,
					credentials: Object.entries(o.rules)
						.filter(([_, value]) => value === "error")
						.map(([key, _]) => key),
				};
			}

			return acc;
		},
		{ nodes: [], credentials: [] }
	);
}

async function assertDistIndexExists() {
	const exists = async (path) => {
		try {
			await access(path);
			return true;
		} catch {
			return false;
		}
	};

	if (!(await exists("./dist/index.js"))) {
		console.error(
			"Error: Missing `dist/index.js`. Please run `pnpm build` first."
		);
		process.exit(1);
	}
}

await downloadEslintConfig();

import eslintConfig from "./downloads/nodes-base-eslint-config.mjs";

const usedPluginRules = getUsedRules(eslintConfig);
const usedNodesRules = new Set(usedPluginRules.nodes);
const usedCredsRules = new Set(usedPluginRules.credentials);

await assertDistIndexExists();

import allRules from "../dist/index.js";

const allNodesRules = Object.keys(allRules.configs.nodes.rules);
const allCredsRules = Object.keys(allRules.configs.credentials.rules);

const missingNodesRules = allNodesRules.filter((r) => !usedNodesRules.has(r));
const missingCredsRules = allCredsRules.filter((r) => !usedCredsRules.has(r));

if (missingNodesRules.length > 0) {
	console.info(
		`The following nodes rules are not yet enabled:`,
		missingNodesRules
	);
}

if (missingCredsRules.length > 0) {
	console.info(
		`The following creds rules are not yet enabled:`,
		missingCredsRules
	);
}
