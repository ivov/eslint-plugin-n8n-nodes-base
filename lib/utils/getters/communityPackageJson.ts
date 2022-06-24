import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

const getPackageJsonProperty =
  (keyName: "name" | "keywords" | "description" | "version" | "n8n") =>
  (node: TSESTree.ObjectExpression) => {
    const found = node.properties.find((property) => {
      return (
        property.type === AST_NODE_TYPES.Property &&
        property.computed === false &&
        property.key.type === AST_NODE_TYPES.Literal &&
        property.key.value === keyName
      );
    });

    if (!found) return null;

    return {
      ast: found,
      // @ts-ignore
      value: found.value.value ?? "TODO restored object",
      // TODO: 'Literal' (found.value.value) or 'ObjectExpression' (nested object)
    };
  };

export const getName = getPackageJsonProperty("name");

export const getKeywords = getPackageJsonProperty("keywords");

export const getDescription = getPackageJsonProperty("description");

export const getVersion = getPackageJsonProperty("version");

export const getN8n = getPackageJsonProperty("n8n");
