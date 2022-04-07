import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

export function hasValue(
  value: "getAll" | "upsert",
  _nodeParam: TSESTree.ObjectExpression
) {
  for (const property of _nodeParam.properties) {
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
