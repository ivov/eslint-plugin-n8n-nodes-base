import { UPDATE_FIELDS_NODE_PARAM_DISPLAY_NAME } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "layout",
		docs: {
			description: `\`displayName\` for Update operation node parameter must be \`${UPDATE_FIELDS_NODE_PARAM_DISPLAY_NAME}\``,
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			useUpdateFields: `Use '${UPDATE_FIELDS_NODE_PARAM_DISPLAY_NAME}' [autofixable]`,
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isUpdateFields(node)) return;

				const displayName = getters.nodeParam.getDisplayName(node);

				if (!displayName) return;

				const expected = UPDATE_FIELDS_NODE_PARAM_DISPLAY_NAME;

				if (displayName.value !== expected) {
					const fixed = utils.keyValue("displayName", expected);

					context.report({
						messageId: "useUpdateFields",
						node: displayName.ast,
						fix: (fixer) => fixer.replaceText(displayName.ast, fixed),
					});
				}
			},
		};
	},
});
