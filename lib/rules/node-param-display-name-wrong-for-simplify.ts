import { SIMPLIFY_NODE_PARAMETER } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: `\`displayName\` for Simplify node parameter must be ${SIMPLIFY_NODE_PARAMETER.DISPLAY_NAME}`,
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			useSimplify: `Replace with '${SIMPLIFY_NODE_PARAMETER.DISPLAY_NAME}' [autofixable]`,
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isSimplify(node)) return;

				const displayName = getters.nodeParam.getDisplayName(node);

				if (!displayName) return;

				const expected = SIMPLIFY_NODE_PARAMETER.DISPLAY_NAME;

				if (displayName.value !== expected) {
					const fixed = utils.keyValue("displayName", expected);

					context.report({
						messageId: "useSimplify",
						node: displayName.ast,
						fix: (fixer) => fixer.replaceText(displayName.ast, fixed),
					});
				}
			},
		};
	},
});
