import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

/**
 * Module to identify an object literal property with
 * a particular key type and key name.
 */

export function isStringPropertyWithKey(
  keyName:
    | "displayName"
    | "name"
    | "type"
    | "description"
    | "loadOptionsMethod"
    | "subtitle"
    | "icon"
    | "value", // option in options-type node param
  property: TSESTree.ObjectLiteralElement
) {
  return (
    property.type === AST_NODE_TYPES.Property &&
    property.computed === false &&
    property.key.type === AST_NODE_TYPES.Identifier &&
    property.key.name === keyName &&
    property.value.type === AST_NODE_TYPES.Literal &&
    typeof property.value.value === "string"
  );
}

export function isObjectPropertyWithKey(
  keyName: "displayOptions" | "typeOptions" | "show" | "default",
  property: TSESTree.ObjectLiteralElement
) {
  return (
    property.type === AST_NODE_TYPES.Property &&
    property.computed === false &&
    property.key.type === AST_NODE_TYPES.Identifier &&
    property.key.name === keyName &&
    property.value.type === AST_NODE_TYPES.ObjectExpression
  );
}

export function isBooleanPropertyWithKey(
  keyName: "required" | "noDataExpression",
  property: TSESTree.ObjectLiteralElement
) {
  return (
    property.type === AST_NODE_TYPES.Property &&
    property.computed === false &&
    property.key.type === AST_NODE_TYPES.Identifier &&
    property.key.name === keyName &&
    property.value.type === AST_NODE_TYPES.Literal &&
    typeof property.value.value === "boolean"
  );
}

export function isNumericPropertyWithKey(
  keyName: "version" | "defaultVersion",
  property: TSESTree.ObjectLiteralElement
) {
  return (
    property.type === AST_NODE_TYPES.Property &&
    property.computed === false &&
    property.key.type === AST_NODE_TYPES.Identifier &&
    property.key.name === keyName &&
    property.value.type === AST_NODE_TYPES.Literal &&
    typeof property.value.value === "number"
  );
}

export function isArrayPropertyWithKey(
  keyName:
    | "options" // node parameter
    | "default" // node parameter
    | "resource" // displayOptions.show
    | "operation" // displayOptions.show
    | "values" // fixed collection section
    | "inputs" // node class description
    | "outputs" // node class description
    | "credentials" // node class description
    | "properties", // node class description
  property: TSESTree.ObjectLiteralElement
) {
  return (
    property.type === AST_NODE_TYPES.Property &&
    property.computed === false &&
    property.key.type === AST_NODE_TYPES.Identifier &&
    property.key.name === keyName &&
    property.value.type === AST_NODE_TYPES.ArrayExpression
  );
}

export function isPropertyPointingToVar(
  keyName: "options",
  property: TSESTree.ObjectLiteralElement
) {
  return (
    property.type === AST_NODE_TYPES.Property &&
    property.computed === false &&
    property.key.type === AST_NODE_TYPES.Identifier &&
    property.key.name === keyName &&
    property.value.type === AST_NODE_TYPES.Identifier
  );
}
