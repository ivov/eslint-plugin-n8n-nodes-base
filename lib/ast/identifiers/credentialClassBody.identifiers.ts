import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import type { StringClassField } from "../../types";

/**
 * Module to identify fields in a credential class body.
 */

function isStringField(
	fieldName: "name" | "displayName" | "documentationUrl" | "placeholder",
	property: TSESTree.ClassElement
) {
	/**
	 * This plugin is on ESLint 8, but n8n-workflow is still at ESLint 7.32,
	 * which uses `ClassProperty` instead of `PropertyDefinition`. Hence these
	 * checks are generalized for now, until n8n-workflow upgrades its ESLint to 8.
	 */
	return (
		"key" in property &&
		"type" in property.key &&
		// property.type === AST_NODE_TYPES.PropertyDefinition &&
		// property.computed === false &&
		property.key.type === AST_NODE_TYPES.Identifier &&
		property.key.name === fieldName &&
		property.value !== null &&
		property.value.type === AST_NODE_TYPES.Literal &&
		typeof property.value.value === "string"
	);
}

export function isName(
	property: TSESTree.ClassElement
): property is StringClassField {
	return isStringField("name", property);
}

export function isDisplayName(
	property: TSESTree.ClassElement
): property is StringClassField {
	return isStringField("displayName", property);
}

export function isDocumentationUrl(
	property: TSESTree.ClassElement
): property is StringClassField {
	return isStringField("documentationUrl", property);
}

export function isPlaceholder(
	property: TSESTree.ClassElement
): property is StringClassField {
	return isStringField("placeholder", property);
}

function isArrayField(fieldName: "extends", property: TSESTree.ClassElement) {
	/**
	 * This plugin is on ESLint 8, but n8n-workflow is still at ESLint 7.32,
	 * which uses `ClassProperty` instead of `PropertyDefinition`. Hence these
	 * checks are generalized for now, until n8n-workflow upgrades its ESLint to 8.
	 */
	return (
		"key" in property &&
		"type" in property.key &&
		// property.type === AST_NODE_TYPES.PropertyDefinition &&
		// property.computed === false &&
		property.key.type === AST_NODE_TYPES.Identifier &&
		property.key.name === fieldName &&
		property.value !== null &&
		property.value.type === AST_NODE_TYPES.ArrayExpression
	);
}

export function isFieldExtends(
	property: TSESTree.ClassElement
): property is TSESTree.PropertyDefinitionNonComputedName & {
	value: { elements: TSESTree.ObjectExpression[] };
} {
	return isArrayField("extends", property);
}
