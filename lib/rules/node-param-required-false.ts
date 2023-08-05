import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"`required: false` in node parameter must be removed because it is implied.",
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			remove: "Remove superfluous property [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				const required = getters.nodeParam.getRequired(node);

				if (!required) return;

				if (required.value === false) {
					const rangeToRemove = utils.getRangeToRemove(required);

					context.report({
						messageId: "remove",
						node: required.ast,
						fix: (fixer) => fixer.removeRange(rangeToRemove),
					});
				}
			},
		};
	},
});
