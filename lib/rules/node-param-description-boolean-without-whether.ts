import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"`description` in a boolean node parameter must start with `Whether`.",
			recommended: "strict",
		},
		schema: [],
		messages: {
			useWhether: "Start with 'Whether' [non-autofixable]", // unpredictable input, unknowable description
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isBooleanType(node)) return;

				// to prevent overlap with node-param-description-wrong-for-simplify
				if (id.nodeParam.isSimplify(node)) return;

				const description = getters.nodeParam.getDescription(node);

				if (!description) return;

				if (!description.value.startsWith("Whether")) {
					context.report({
						messageId: "useWhether",
						node: description.ast,
					});
				}
			},
		};
	},
});
