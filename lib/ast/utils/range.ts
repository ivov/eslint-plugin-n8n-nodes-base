import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { getIndentationString } from "./format";

export function getRangeWithTrailingComma(referenceNode: {
	ast: TSESTree.BaseNode;
}) {
	const { range } = referenceNode.ast;

	return [range[0], range[1] + 1] as const; // `+ 1` to include trailing comma
}

export function isMultiline(node: { ast: TSESTree.BaseNode; value: string }) {
	return node.ast.loc.start.line !== node.ast.loc.end.line;
}

/**
 * Get full range of type assertion for its removal.
 *
 * `- 4` to grab the initial `as` keyword and its two whitespaces
 *
 * ```ts
 * type: "string" as NodePropertyTypes,
 *            // ^-------------------^
 * ```
 */
export function getRangeOfAssertion(typeIdentifier: TSESTree.Identifier) {
	return [typeIdentifier.range[0] - 4, typeIdentifier.range[1]] as const;
}

export function getRangeToRemove(referenceNode: { ast: TSESTree.BaseNode }) {
	const { range } = referenceNode.ast;
	const indentation = getIndentationString(referenceNode);

	if (referenceNode.ast.type === AST_NODE_TYPES.TSArrayType) {
		// `- 1` to offset closing square bracket
		return [range[0] - indentation.length, range[1] - 1] as const;
	}

	// `+ 2` to include trailing comma and empty line
	return [range[0] - indentation.length, range[1] + 2] as const;
}
