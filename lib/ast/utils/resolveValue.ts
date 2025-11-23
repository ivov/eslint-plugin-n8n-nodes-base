import { AST_NODE_TYPES, TSESTree, TSESLint } from "@typescript-eslint/utils";
import { restoreObject } from "../restorers";

/**
 * Helper function to resolve an Identifier to its literal value
 */
export function resolveIdentifierValue(
	identifierNode: TSESTree.Identifier,
	context: TSESLint.RuleContext<string, unknown[]>
): string | number | boolean | null | object | unknown[] {
	const sourceCode = context.sourceCode;
	if (!sourceCode.getScope) return null;
	const scope = sourceCode.getScope(identifierNode);

	// Find the variable in scope
	const variable = scope.set.get(identifierNode.name);
	if (!variable || variable.defs.length === 0) return null;

	// Get the variable declaration
	const def = variable.defs[0];
	if (def.type !== "Variable" || !def.node.init) return null;

	// Extract the literal value
	const init = def.node.init;
	if (
		init.type === AST_NODE_TYPES.Literal &&
		typeof init.value === "string"
	) {
		return init.value;
	}
	if (
		init.type === AST_NODE_TYPES.Literal &&
		typeof init.value === "number"
	) {
		return init.value;
	}
	if (
		init.type === AST_NODE_TYPES.Literal &&
		typeof init.value === "boolean"
	) {
		return init.value;
	}
	if (init.type === AST_NODE_TYPES.ObjectExpression) {
		return restoreObject(init);
	}
	if (init.type === AST_NODE_TYPES.ArrayExpression) {
		return []; // Return empty array as marker that it's an array type
	}

	return null;
}
