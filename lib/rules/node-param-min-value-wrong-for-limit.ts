import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "layout",
		docs: {
			description:
				"`minValue` for Limit node parameter must be a positive integer.",
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			setPositiveMinValue: "Set a positive integer [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isLimit(node)) return;

				const minValue = getters.nodeParam.getMinValue(node);

				if (!minValue) return;

				if (minValue.value < 1) {
					context.report({
						messageId: "setPositiveMinValue",
						node: minValue.ast,
						fix: (fixer) => fixer.replaceText(minValue.ast, "minValue: 1"),
					});
				}
			},
		};
	},
});
