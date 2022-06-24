import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

const getPackageJsonProperty =
  (keyName: "name" | "keywords") => (node: TSESTree.ObjectExpression) => {
    return node.properties.find((property) => {
      return (
        property.type === AST_NODE_TYPES.Property &&
        property.computed === false &&
        property.key.type === AST_NODE_TYPES.Literal &&
        property.key.value === keyName
      );
    });
  };

export const getName = getPackageJsonProperty("name");

export const getKeywords = getPackageJsonProperty("keywords");
