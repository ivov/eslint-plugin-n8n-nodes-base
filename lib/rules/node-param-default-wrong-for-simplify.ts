import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: "`default` for a Simplify node parameter must be `true`.",
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			setTrueDefault: "Set 'true' as default [autofixable]",
			constWrongValue: "Const used in default must be true",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isSimplify(node)) return;

				const _default = getters.nodeParam.getDefault(node);

				if (!_default) return;

				// Handle unparseable defaults (Identifiers, CallExpressions, MemberExpressions)
				if (_default.isUnparseable) {
					// Check if it's an Identifier reference
					const property = _default.ast as TSESTree.Property;
					if (property.value.type === AST_NODE_TYPES.Identifier) {
						const resolvedValue = utils.resolveIdentifierValue(property.value, context);

						// Simplify default must be true
						if (resolvedValue !== null && resolvedValue !== true) {
							context.report({
								messageId: "constWrongValue",
								node: _default.ast,
							});
						}
					}
					return;
				}

				if (_default.value === false) {
					context.report({
						messageId: "setTrueDefault",
						node: _default.ast,
						fix: (fixer) => fixer.replaceText(_default.ast, "default: true"),
					});
				}
			},
		};
	},
});
