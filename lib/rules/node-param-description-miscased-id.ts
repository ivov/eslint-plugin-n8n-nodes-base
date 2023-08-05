import { DOCUMENTATION, MISCASED_ID_REGEX } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: `\`ID\` in \`description\` in node parameter must be fully uppercased. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_DESCRIPTION_IN_OPTION}`,
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			uppercaseId: "Use 'ID' [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node) && !id.isOption(node)) return;

				const description = getters.nodeParam.getDescription(node);

				if (!description) return;

				if (MISCASED_ID_REGEX.test(description.value)) {
					const correctlyCased = description.value
						.replace(/\bid\b/i, "ID")
						.replace(/\bids\b/i, "IDs");

					const fixed = utils.keyValue("description", correctlyCased);

					context.report({
						messageId: "uppercaseId",
						node: description.ast,
						fix: (fixer) => fixer.replaceText(description.ast, fixed),
					});
				}
			},
		};
	},
});
