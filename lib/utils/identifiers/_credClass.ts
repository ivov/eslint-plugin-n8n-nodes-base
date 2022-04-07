import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

export function isCredentialClass(node: TSESTree.ClassDeclaration) {
  return (
    node.implements?.length === 1 &&
    node.implements[0].type === AST_NODE_TYPES.TSClassImplements &&
    node.implements[0].expression.type === AST_NODE_TYPES.Identifier &&
    node.implements[0].expression.name === "ICredentialType"
  );
}
