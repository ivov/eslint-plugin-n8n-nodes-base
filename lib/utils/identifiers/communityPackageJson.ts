import { TSESTree, AST_NODE_TYPES } from "@typescript-eslint/utils";

export const prod = {
  isTopLevelObjectExpression(node: TSESTree.ObjectExpression) {
    return node.parent?.parent?.type === AST_NODE_TYPES.Program;
  },
};

export const test = {
  isTopLevelObjectExpression(node: TSESTree.ObjectExpression) {
    return node.parent?.parent?.type === AST_NODE_TYPES.VariableDeclaration;
  },
};

const hasLiteral =
  (keyName: string) => (property: TSESTree.ObjectLiteralElement) => {
    return (
      property.type === AST_NODE_TYPES.Property &&
      property.key.type === AST_NODE_TYPES.Literal &&
      property.key.value === keyName
    );
  };

export const hasNameLiteral = hasLiteral("name");