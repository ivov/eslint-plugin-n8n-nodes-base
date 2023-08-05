import { LIMIT_NODE_PARAMETER } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: `\`default\` for a Limit node parameter must be \`${LIMIT_NODE_PARAMETER.DEFAULT_VALUE}\`.`,
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			setLimitDefault: `Set ${LIMIT_NODE_PARAMETER.DEFAULT_VALUE} as default [autofixable]`,
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isLimit(node)) return;

				const _default = getters.nodeParam.getDefault(node);

				if (!_default) return;

				if (_default.value !== LIMIT_NODE_PARAMETER.DEFAULT_VALUE) {
					context.report({
						messageId: "setLimitDefault",
						node: _default.ast,
						fix: (fixer) =>
							fixer.replaceText(
								_default.ast,
								`default: ${LIMIT_NODE_PARAMETER.DEFAULT_VALUE}`
							),
					});
				}
			},
		};
	},
});
