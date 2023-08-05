import { DOCUMENTATION } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: `\`description\` in node parameter must not contain excess inner whitespace. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_DESCRIPTION_IN_OPTION}`,
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			removeInnerWhitespace: "Remove excess inner whitespace [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node) && !id.isOption(node)) return;

				const description = getters.nodeParam.getDescription(node);

				if (!description) return;

				const isMultiline = utils.isMultiline(description);

				// tolerate multiline when used to format HTML tags
				if (isMultiline && /</.test(description.value)) return;

				if (/\s{2,}/.test(description.value)) {
					const withoutExcess = description.value
						// .replace(/\n\t/g, ". ") // wrong multiline → multiple sentences intended
						.replace(/\s{2,}/g, " ");

					const fixed = utils.keyValue("description", withoutExcess);

					context.report({
						messageId: "removeInnerWhitespace",
						node: description.ast,
						fix: (fixer) => fixer.replaceText(description.ast, fixed),
					});
				}
			},
		};
	},
});
