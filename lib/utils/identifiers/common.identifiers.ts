import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { WEAK_DESCRIPTIONS } from "../../constants";

// ----------------------------------------
//            target property
// ----------------------------------------

/**
 * Check whether the property has a specific key name and value type.
 */
function isTargetProperty(
  {
    keyName,
    valueType,
  }: {
    keyName: string;
    valueType: "string" | "number" | "boolean" | "object" | "array";
  },
  property: TSESTree.ObjectLiteralElement
) {
  if (
    property.type !== AST_NODE_TYPES.Property ||
    property.computed !== false ||
    property.key.type !== AST_NODE_TYPES.Identifier ||
    property.key.name !== keyName
  ) {
    return false;
  }

  // non-computed property with specific key name, now check type

  if (valueType === "object") {
    return property.value.type === AST_NODE_TYPES.ObjectExpression;
  }

  if (valueType === "array") {
    return property.value.type === AST_NODE_TYPES.ArrayExpression;
  }

  return (
    property.value.type === AST_NODE_TYPES.Literal &&
    typeof property.value.value === valueType
  );
}

/**
 * Check whether the property has a specific key name and points to a string `Literal`.
 */
export function isStringPropertyNamed(
  keyName:
    | "displayName"
    | "name"
    | "type"
    | "description"
    | "placeholder"
    | "loadOptionsMethod"
    | "subtitle"
    | "icon"
    | "value", // option in options-type node param,
  property: TSESTree.ObjectLiteralElement
) {
  return isTargetProperty({ keyName, valueType: "string" }, property);
}

/**
 * Check whether the property has a specific key name and points to a number `Literal`.
 */
export function isNumericPropertyNamed(
  keyName: "version" | "defaultVersion",
  property: TSESTree.ObjectLiteralElement
) {
  return isTargetProperty({ keyName, valueType: "number" }, property);
}

/**
 * Check whether the property has a specific key name and points to a boolean `Literal`.
 */
export function isBooleanPropertyNamed(
  keyName: "required" | "noDataExpression",
  property: TSESTree.ObjectLiteralElement
) {
  return isTargetProperty({ keyName, valueType: "boolean" }, property);
}

/**
 * Check whether the property has a specific key name and points to an `ObjectExpression`.
 */
export function isObjectPropertyNamed(
  keyName: "displayOptions" | "typeOptions" | "show" | "default",
  property: TSESTree.ObjectLiteralElement
) {
  return isTargetProperty({ keyName, valueType: "object" }, property);
}

/**
 * Check whether the property has a specific key name and points to an `ArrayExpression`.
 */
export function isArrayPropertyNamed(
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
  return isTargetProperty({ keyName, valueType: "array" }, property);
}

/**
 * Check whether a property points to an identifier, e.g. `options: myVar`
 */
export function isIdentifierPropertyNamed(
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

// ----------------------------------------
//             miscellaneous
// ----------------------------------------

export function isCredentialClass(node: TSESTree.ClassDeclaration) {
  return (
    node.implements?.length === 1 &&
    node.implements[0].type === AST_NODE_TYPES.TSClassImplements &&
    node.implements[0].expression.type === AST_NODE_TYPES.Identifier &&
    node.implements[0].expression.name === "ICredentialType"
  );
}

export function hasValue(
  value: "getAll" | "upsert",
  nodeParam: TSESTree.ObjectExpression
) {
  for (const property of nodeParam.properties) {
    if (
      property.type === AST_NODE_TYPES.Property &&
      property.computed === false &&
      property.key.type === AST_NODE_TYPES.Identifier &&
      property.value.type === AST_NODE_TYPES.Literal &&
      property.value.value === value &&
      typeof property.value.value === "string"
    ) {
      return true;
    }
  }

  return false;
}

export function isReturnValue(node: TSESTree.Node) {
  return node.parent?.type === AST_NODE_TYPES.ReturnStatement;
}

export function isArgument(node: TSESTree.Node) {
  return (
    node.parent?.type === AST_NODE_TYPES.TSAsExpression ||
    node.parent?.type === AST_NODE_TYPES.CallExpression
  );
}

export function isWeakDescription({ value }: { value: string }) {
  return WEAK_DESCRIPTIONS.some((wd) =>
    value.toLowerCase().includes(wd.toLowerCase())
  );
}
