import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

/**
 * Module to identify four of the five lintable sections:
 *   - node param,
 *   - option in options-type or multi-options-type node param,
 *   - fixed collection section, and
 *   - node class description.
 *
 * Cred class body, the fifth section, is identified via filename.
 */

export type IdentifierKey =
	| "displayName" // nodeParameter, fixedCollectionSection, nodeClassDescription
	| "name" // nodeParameter, fixedCollectionSection, nodeClassDescription, option
	| "type" // nodeParameter
	| "default" // nodeParameter
	| "value" // option
	| "values" // fixedCollectionSection
	| "group"; // nodeClassDescription

export const IDENTIFIER_KEYS: Record<string, IdentifierKey[]> = {
	nodeParam: ["displayName", "name", "type", "default"],
	option: ["name", "value"], // in options-type or multi-options-type node param
	fixedCollectionSection: ["displayName", "name", "values"],
	nodeClassDescription: ["displayName", "name", "group"],
};

function isLintableSection(
	section:
		| "nodeParam"
		| "option"
		| "fixedCollectionSection"
		| "nodeClassDescription",
	node: TSESTree.ObjectExpression,
	options?: { skipKeys: IdentifierKey[] }
) {
	const requiredKeys = IDENTIFIER_KEYS[section];

	const keysToCheck: string[] = options
		? requiredKeys.filter((key) => !options.skipKeys.includes(key))
		: requiredKeys;

	const totalFound = node.properties.reduce((acc, property) => {
		if (
			property.type === AST_NODE_TYPES.Property &&
			property.key.type === AST_NODE_TYPES.Identifier &&
			keysToCheck.includes(property.key.name)
		) {
			acc++;
		}
		return acc;
	}, 0);

	return totalFound === keysToCheck.length;
}

export function isNodeParameter(
	node: TSESTree.ObjectExpression,
	options?: { skipKeys: IdentifierKey[] }
) {
	return isLintableSection("nodeParam", node, options);
}

export function isOption(node: TSESTree.ObjectExpression) {
	return isLintableSection("option", node);
}

export function isFixedCollectionSection(node: TSESTree.ObjectExpression) {
	return isLintableSection("fixedCollectionSection", node);
}

export function isNodeClassDescription(node: TSESTree.ObjectExpression) {
	return isLintableSection("nodeClassDescription", node);
}
