import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { utils } from "../ast/utils";
import { N8N_NODE_ERROR_TYPES } from "../constants";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"The `execute()` method in a node may only throw `NodeOperationError`, `NodeApiError`, `TriggerCloseError`, `UserError`, `OperationalError`, `UnexpectedError`, or the deprecated `ApplicationError`.",
			recommended: "strict",
		},
		schema: [],
		messages: {
			useProperError:
				"Use `NodeOperationError`, `NodeApiError`, `TriggerCloseError`, `UserError`, `OperationalError`, or `UnexpectedError` [non-autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			"ThrowStatement > NewExpression"(node: TSESTree.NewExpression) {
				if (!utils.isNodeFile(context.filename)) return;

				if (node.callee.type !== AST_NODE_TYPES.Identifier) return;

				const { name: errorType } = node.callee;

				if (!N8N_NODE_ERROR_TYPES.includes(errorType)) {
					context.report({
						messageId: "useProperError",
						node,
					});
				}
			},
		};
	},
});
