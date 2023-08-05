import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"`default` for a multi-options-type node parameter must be an array.",
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			setArrayDefault: "Set an array as default [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isMultiOptionsType(node)) return;

				const _default = getters.nodeParam.getDefault(node);

				if (!_default) return;

				if (!Array.isArray(_default.value)) {
					context.report({
						messageId: "setArrayDefault",
						node: _default.ast,
						fix: (fixer) => fixer.replaceText(_default.ast, `default: []`),
					});
				}
			},
		};
	},
});
