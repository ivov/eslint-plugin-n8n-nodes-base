import { DYNAMIC_OPTIONS_NODE_PARAMETER } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: `\`displayName\` for dynamic-options-type node parameter must end with \`${DYNAMIC_OPTIONS_NODE_PARAMETER.DISPLAY_NAME_SUFFIX}\``,
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			endWithNameOrId: `End with '{Entity} ${DYNAMIC_OPTIONS_NODE_PARAMETER.DISPLAY_NAME_SUFFIX}' [autofixable]`,
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isOptionsType(node)) return;

				const loadOptionsMethod = getters.nodeParam.getLoadOptionsMethod(node);

				if (!loadOptionsMethod) return;

				const displayName = getters.nodeParam.getDisplayName(node);

				if (!displayName) return;

				if (
					!displayName.value.endsWith(
						DYNAMIC_OPTIONS_NODE_PARAMETER.DISPLAY_NAME_SUFFIX
					)
				) {
					const withEndSegment = utils.addEndSegment(displayName.value);
					const fixed = utils.keyValue("displayName", withEndSegment);

					context.report({
						messageId: "endWithNameOrId",
						node: displayName.ast,
						fix: (fixer) => fixer.replaceText(displayName.ast, fixed),
					});
				}
			},
		};
	},
});
