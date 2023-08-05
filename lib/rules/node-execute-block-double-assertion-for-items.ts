import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { utils } from "../ast/utils";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"In the `execute()` method there is no need to double assert the type of `items.length`.",
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			removeDoubleAssertion: "Remove double assertion [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			MethodDefinition(node) {
				if (!utils.isNodeFile(context.getFilename())) return;

				const executeContent = getters.nodeExecuteBlock.getExecuteContent(node);

				if (!executeContent) return;

				const init = getDoublyAssertedDeclarationInit(executeContent);

				if (init) {
					context.report({
						messageId: "removeDoubleAssertion",
						node: init,
						fix: (fixer) => fixer.replaceText(init, "items.length"),
					});
				}
			},
		};
	},
});

// TODO: Refactor
function getDoublyAssertedDeclarationInit(
	executeMethod: TSESTree.BlockStatement
) {
	for (const node of executeMethod.body) {
		if (node.type === AST_NODE_TYPES.VariableDeclaration) {
			for (const declaration of node.declarations) {
				if (!declaration.init) continue;
				if (
					declaration.init.type === AST_NODE_TYPES.TSAsExpression &&
					declaration.init.typeAnnotation.type ===
						AST_NODE_TYPES.TSNumberKeyword &&
					declaration.init.expression.type === AST_NODE_TYPES.TSAsExpression &&
					declaration.init.expression.typeAnnotation.type ===
						AST_NODE_TYPES.TSUnknownKeyword &&
					declaration.init.expression.expression.type ===
						AST_NODE_TYPES.MemberExpression &&
					declaration.init.expression.expression.object.type ===
						AST_NODE_TYPES.Identifier &&
					declaration.init.expression.expression.object.name === "items" &&
					declaration.init.expression.expression.property.type ===
						AST_NODE_TYPES.Identifier &&
					declaration.init.expression.expression.property.name === "length"
				) {
					return declaration.init;
				}
			}
		}
	}

	return null;
}
