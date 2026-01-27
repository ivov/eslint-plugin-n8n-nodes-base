import { ESLintUtils } from "@typescript-eslint/utils";
import type { RuleRecommendation } from "@typescript-eslint/utils/ts-eslint";

type PluginRuleDocs = {
	recommended?: RuleRecommendation;
};

export const createRule = ESLintUtils.RuleCreator<PluginRuleDocs>(
	(ruleName) => {
		return `https://github.com/ivov/eslint-plugin-n8n-nodes-base/blob/master/docs/rules/${ruleName}.md`;
	}
);

export const getRuleName = ({ filename }: { filename: string }) =>
	filename
		.split("/")
		.pop()
		?.replace(/(\.test)?\.(j|t)s/, "") ?? "Unknown";
