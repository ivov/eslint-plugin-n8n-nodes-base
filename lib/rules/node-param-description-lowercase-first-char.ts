import { DOCUMENTATION } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: `First char in \`description\` in node parameter must be uppercase. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_DESCRIPTION_IN_OPTION}`,
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			uppercaseFirstChar: "Change first char to uppercase [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node) && !id.isOption(node)) return;

				if (id.isReturnValue(node)) return;

				const description = getters.nodeParam.getDescription(node);

				if (!description) return;

				const { value } = description;
				const firstChar = value.charAt(0);

				if (/[a-z]/.test(firstChar)) {
					const correctlyCased = firstChar.toUpperCase() + value.slice(1);
					const fixed = utils.keyValue("description", correctlyCased);

					context.report({
						messageId: "uppercaseFirstChar",
						node: description.ast,
						fix: (fixer) => fixer.replaceText(description.ast, fixed),
					});
				}
			},
		};
	},
});
