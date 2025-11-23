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
				"`default` for a number-type node parameter must be a number, except for a number-type ID parameter.",
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			setNumberDefault: "Set a number default [autofixable]",
			constWrongType: "Const used in default has wrong type. Change const to number type",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isNumericType(node)) return;

				const _default = getters.nodeParam.getDefault(node);

				if (!_default) return;

				// Handle unparseable defaults (Identifiers, CallExpressions, MemberExpressions)
				if (_default.isUnparseable) {
					// Check if it's an Identifier reference
					const property = _default.ast as TSESTree.Property;
					if (property.value.type === AST_NODE_TYPES.Identifier) {
						const resolvedValue = utils.resolveIdentifierValue(property.value, context);

						// If resolved to a string, check if it's a numeric string
						if (typeof resolvedValue === "string") {
							const numValue = Number(resolvedValue);
							if (!isNaN(numValue)) {
								context.report({
									messageId: "constWrongType",
									node: _default.ast,
								});
							}
						}
					}
					return;
				}

				if (!Boolean(_default.value)) return; // tolerate falsy values for number default

				if (typeof _default.value !== "number") {
					context.report({
						messageId: "setNumberDefault",
						node: _default.ast,
						fix: (fixer) => fixer.replaceText(_default.ast, "default: 0"),
					});
				}
			},
		};
	},
});
