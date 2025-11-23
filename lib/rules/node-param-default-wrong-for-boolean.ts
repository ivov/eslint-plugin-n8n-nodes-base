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
				"`default` for boolean-type node parameter must be a boolean.",
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			setBooleanDefault: "Set a boolean default [autofixable]",
			constWrongType: "Const used in default has wrong type. Change const to boolean type",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isBooleanType(node)) return;

				const _default = getters.nodeParam.getDefault(node);

				if (!_default) return;

				// Handle unparseable defaults (Identifiers, CallExpressions, MemberExpressions)
				if (_default.isUnparseable) {
					// Check if it's an Identifier reference
					const property = _default.ast as TSESTree.Property;
					if (property.value.type === AST_NODE_TYPES.Identifier) {
						const resolvedValue = utils.resolveIdentifierValue(property.value, context);

						// If resolved to a non-boolean value, report error
						if (resolvedValue !== null && typeof resolvedValue !== "boolean") {
							context.report({
								messageId: "constWrongType",
								node: _default.ast,
							});
						}
					}
					return;
				}

				if (typeof _default.value !== "boolean") {
					context.report({
						messageId: "setBooleanDefault",
						node: _default.ast,
						fix: (fixer) => fixer.replaceText(_default.ast, "default: false"),
					});
				}
			},
		};
	},
});
