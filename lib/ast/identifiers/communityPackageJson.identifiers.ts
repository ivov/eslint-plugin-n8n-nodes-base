import { TSESTree, AST_NODE_TYPES } from "@typescript-eslint/utils";
import { id } from "../identifiers";

const isTestRun = process.env.NODE_ENV === "test";
const isProdRun = !isTestRun;

export function isCommunityPackageJson(
  filename: string,
  node: TSESTree.ObjectExpression
) {
  // skip `*-still-default` rules until parent dir renamed away from n8n-nodes-starter
  // to avoid triggering `*-still-default` violations with our sample `package.json`
  if (filename.includes('n8n-nodes-starter')) return false;

  if (isProdRun && !filename.includes("package.json")) return false;
  if (isProdRun && !id.prod.isTopLevelObjectExpression(node)) return false;
  if (isTestRun && !id.test.isTopLevelObjectExpression(node)) return false;

  return true;
}

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
  (keyName: "name" | "nodes" | "email" | "url" | "n8nNodesApiVersion") =>
  (property: TSESTree.ObjectLiteralElement) => {
    return (
      property.type === AST_NODE_TYPES.Property &&
      property.key.type === AST_NODE_TYPES.Literal &&
      property.key.value === keyName
    );
  };

export const hasNameLiteral = hasLiteral("name");
export const hasEmailLiteral = hasLiteral("email");
export const hasNodesLiteral = hasLiteral("nodes");
export const hasNodesApiVersion = hasLiteral("n8nNodesApiVersion");
export const hasUrlLiteral = hasLiteral("url");
