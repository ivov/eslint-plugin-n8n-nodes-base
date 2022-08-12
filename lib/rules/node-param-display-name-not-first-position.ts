import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"By convention, `displayName` in node parameter must be placed first.",
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			setDisplayNameFirst:
				"Place `displayName` as first property [non-autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				const displayName = getters.nodeParam.getDisplayName(node);

				if (!displayName) return;

				const [firstProperty] = node.properties;

				if (!id.nodeParam.isDisplayName(firstProperty)) {
					context.report({
						messageId: "setDisplayNameFirst",
						node: displayName.ast,
					});
				}
			},
		};
	},
});
