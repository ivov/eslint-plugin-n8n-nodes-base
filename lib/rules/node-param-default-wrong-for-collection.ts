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
				"`default` for collection-type node parameter must be an object.",
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			setObjectDefault: "Set an object default [autofixable]",
			constWrongType:
				"Const used in default has wrong type. Change const to object type",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isCollectionType(node)) return;

				const _default = getters.nodeParam.getDefault(node);

				if (!_default) return;

				// Handle unparseable defaults (Identifiers, CallExpressions, MemberExpressions)
				if (_default.isUnparseable) {
					// Check if it's an Identifier reference
					const property = _default.ast as TSESTree.Property;
					if (property.value.type === AST_NODE_TYPES.Identifier) {
						const resolvedValue = utils.resolveIdentifierValue(
							property.value,
							context
						);

						// Collection should be object or array or null, not primitives
						if (typeof resolvedValue !== "object") {
							context.report({
								messageId: "constWrongType",
								node: _default.ast,
							});
						}
					}
					return;
				}

				if (
					!Array.isArray(_default.value) &&
					_default.value !== null &&
					typeof _default.value !== "object"
				) {
					context.report({
						messageId: "setObjectDefault",
						node: _default.ast,
						fix: (fixer) => fixer.replaceText(_default.ast, "default: {}"),
					});
				}
			},
		};
	},
});
