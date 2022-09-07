import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: "Option `name` for Get Many node parameter must be `Get Many`",
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			useGetMany: "Replace with 'Get Many' [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isOption(node)) return;

				if (!id.hasValue("getAll", node)) return;

				const name = getters.nodeParam.getName(node);

				if (!name) return;

				if (name.value !== "Get Many") {
					context.report({
						messageId: "useGetMany",
						node: name.ast,
						fix: (fixer) => fixer.replaceText(name.ast, "name: 'Get Many'"),
					});
				}
			},
		};
	},
});
