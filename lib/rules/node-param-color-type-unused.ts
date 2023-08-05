import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"`string`-type color-related node parameter must be `color`-type.",
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			useColorParam: "Use 'color' for 'type' [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				const name = getters.nodeParam.getName(node);

				if (!name) return;

				const type = getters.nodeParam.getType(node);

				if (!type) return;

				if (/colo(u?)r/i.test(name.value) && type.value === "string") {
					context.report({
						messageId: "useColorParam",
						node: type.ast,
						fix: (fixer) => fixer.replaceText(type.ast, "type: 'color'"),
					});
				}
			},
		};
	},
});
