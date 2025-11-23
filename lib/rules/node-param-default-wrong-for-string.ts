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
				"`default` for a string-type node parameter must be a string, unless `typeOptions.multipleValues` is set to `true`.",
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			setStringDefault: "Set a string default [autofixable]",
			constWrongType: "Const used in default has wrong type. Change const to string type",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isStringType(node)) return;

				const _default = getters.nodeParam.getDefault(node);

				if (!_default) return;

				const typeOptions = getters.nodeParam.getTypeOptions(node);

				// Handle unparseable defaults (Identifiers, CallExpressions, MemberExpressions)
				if (_default.isUnparseable) {
					// Check if it's an Identifier reference
					const property = _default.ast as TSESTree.Property;
					if (property.value.type === AST_NODE_TYPES.Identifier) {
						const resolvedValue = utils.resolveIdentifierValue(property.value, context);

						// If resolved to a non-string value, report error
						if (resolvedValue !== null && typeof resolvedValue !== "string") {
							context.report({
								messageId: "constWrongType",
								node: _default.ast,
							});
						}
					}
					return;
				}

				if (
					typeOptions?.value.multipleValues &&
					Array.isArray(_default.value)
				) {
					return;
				}

				if (typeof _default.value !== "string") {
					context.report({
						messageId: "setStringDefault",
						node: _default.ast,
						fix: (fixer) => fixer.replaceText(_default.ast, "default: ''"),
					});
				}
			},
		};
	},
});
