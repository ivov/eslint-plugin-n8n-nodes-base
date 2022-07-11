import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { utils } from "../ast/utils";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "The `n8n.n8nNodesApiVersion` value in the `package.json` of a community package must be a number.",
      recommended: "error",
    },
    schema: [],
    messages: {
      changeToNumber:
        "Change the `n8n.n8nNodesApiVersion` value to number in package.json",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isCommunityPackageJson(context.getFilename(), node)) return;

        const n8n = getters.communityPackageJson.getN8n(node);

        if (!n8n) return;

        const apiVersion = getN8nNodesApiVersion(n8n);

        if (!apiVersion) return;

        if (!hasNumberValue(apiVersion)) {
          context.report({
            messageId: "changeToNumber",
            node,
          });
        }
      },
    };
  },
});

function getN8nNodesApiVersion(n8n: { ast: TSESTree.ObjectLiteralElement }) {
  if (
    n8n.ast.type === AST_NODE_TYPES.Property &&
    n8n.ast.value.type === AST_NODE_TYPES.ObjectExpression
  ) {
    return n8n.ast.value.properties.find(id.hasNodesApiVersion) ?? null;
  }

  return null;
}

function hasNumberValue(n8nNodesApiVersion: TSESTree.ObjectLiteralElement) {
  return (
    n8nNodesApiVersion.type === AST_NODE_TYPES.Property &&
    n8nNodesApiVersion.value.type === AST_NODE_TYPES.Literal &&
    typeof n8nNodesApiVersion.value.value === "number"
  );
}
