import { DOCUMENTATION } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: `\`description\` in node parameter must not use unneeded backticks. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_DESCRIPTION_IN_OPTION}`,
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			useSingleQuotes: "Use quotes instead [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node) && !id.isOption(node)) return;

				const description = getters.nodeParam.getDescription(node);

				if (!description) return;

				if (utils.isMultiline(description)) return;

				if (description.hasUnneededBackticks) {
					const fixed = utils.keyValue("description", description.value);

					context.report({
						messageId: "useSingleQuotes",
						node: description.ast,
						fix: (fixer) => fixer.replaceText(description.ast, fixed),
					});
				}
			},
		};
	},
});
