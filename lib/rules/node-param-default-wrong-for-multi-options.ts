import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

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
			constWrongType: "Const used in default has wrong type. Change const to array type",
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

				// Handle unparseable defaults (Identifiers, CallExpressions, MemberExpressions)
				if (_default.isUnparseable) {
					// Check if it's an Identifier reference
					const property = _default.ast as TSESTree.Property;
					if (property.value.type === AST_NODE_TYPES.Identifier) {
						const resolvedValue = utils.resolveIdentifierValue(property.value, context);

						// Multi-options should be array, not other types
						if (resolvedValue !== null && !Array.isArray(resolvedValue)) {
							context.report({
								messageId: "constWrongType",
								node: _default.ast,
							});
						}
					}
					return;
				}

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
