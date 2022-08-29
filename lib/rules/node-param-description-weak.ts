import { DOCUMENTATION } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: `\`description\` in node parameter must be either useful or omitted. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_DESCRIPTION_IN_OPTION}`,
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			removeWeakDescription: "Remove omittable description [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node) && !id.isOption(node)) return;

				const description = getters.nodeParam.getDescription(node);

				if (!description) return;

				if (id.isWeakDescription(description)) {
					const rangeToRemove = utils.getRangeToRemove(description);

					context.report({
						messageId: "removeWeakDescription",
						node: description.ast,
						fix: (fixer) => fixer.removeRange(rangeToRemove),
					});
				}
			},
		};
	},
});
