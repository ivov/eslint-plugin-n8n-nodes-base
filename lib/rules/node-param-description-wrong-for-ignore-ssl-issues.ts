import { IGNORE_SSL_ISSUES_NODE_PARAMETER } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: `\`description\` for Ignore SSL node parameter must be \`${IGNORE_SSL_ISSUES_NODE_PARAMETER.DESCRIPTION}\``,
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			useIgnoreSslDescription: `Replace with '${IGNORE_SSL_ISSUES_NODE_PARAMETER.DESCRIPTION}' [autofixable]`,
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isIgnoreSslIssues(node)) return;

				const description = getters.nodeParam.getDescription(node);

				if (!description) return;

				const expected = IGNORE_SSL_ISSUES_NODE_PARAMETER.DESCRIPTION;

				if (description.value !== expected) {
					const fixed = utils.keyValue("description", expected);

					context.report({
						messageId: "useIgnoreSslDescription",
						node: description.ast,
						fix: (fixer) => fixer.replaceText(description.ast, fixed),
					});
				}
			},
		};
	},
});
