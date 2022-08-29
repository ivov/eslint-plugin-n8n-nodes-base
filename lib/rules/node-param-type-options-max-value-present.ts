import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "layout",
		docs: {
			description:
				"`maxValue` in `typeOptions` in Limit node parameter is deprecated and must not be present.",
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			removeMaxValue: "Remove `maxValue` [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isLimit(node)) return;

				const maxValue = getters.nodeParam.getMaxValue(node);

				if (!maxValue) return;

				const rangeToRemove = utils.getRangeToRemove(maxValue);

				context.report({
					messageId: "removeMaxValue",
					node: maxValue.ast,
					fix: (fixer) => fixer.removeRange(rangeToRemove),
				});
			},
		};
	},
});
