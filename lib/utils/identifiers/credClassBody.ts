import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import type { StringClassField } from "../../types";

/**
 * Module to identify fields in a credential class body.
 */

function isStringField(
  fieldName: "name" | "displayName" | "documentationUrl" | "placeholder",
  property: TSESTree.ClassElement
) {
  return (
    property.type === AST_NODE_TYPES.PropertyDefinition &&
    property.computed === false &&
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
  return (
    property.type === AST_NODE_TYPES.PropertyDefinition &&
    property.computed === false &&
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
