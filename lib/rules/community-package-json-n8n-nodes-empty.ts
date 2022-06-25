import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";
import * as utils from "../utils";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "The `n8n.nodes` value in the `package.json` of a community package must contain at least one filepath.",
      recommended: "error",
    },
    schema: [],
    messages: {
      addOneFilepath:
        "Enter at least one filepath in `n8n.nodes` in package.json",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        const isTestRun = process.env.NODE_ENV === "test";
        const isProdRun = !isTestRun;
        const filename = context.getFilename();

        if (isProdRun && !filename.includes("package.json")) return;
        if (isProdRun && !id.prod.isTopLevelObjectExpression(node)) return;
        if (isTestRun && !id.test.isTopLevelObjectExpression(node)) return;

        const n8n = getters.packageJson.getN8n(node);

        if (!n8n) return;

        if (!hasAtLeastOneFilepath(n8n)) {
          context.report({
            messageId: "addOneFilepath",
            node,
          });
        }
      },
    };
  },
});

function hasAtLeastOneFilepath(n8n: { ast: TSESTree.ObjectLiteralElement }) {
  if (
    n8n.ast.type === AST_NODE_TYPES.Property &&
    n8n.ast.value.type === AST_NODE_TYPES.ObjectExpression
  ) {
    const nodes = n8n.ast.value.properties.find(id.hasNodesLiteral);

    if (!nodes) return false;

    if (
      nodes.type === AST_NODE_TYPES.Property &&
      nodes.value.type === AST_NODE_TYPES.ArrayExpression
    ) {
      return nodes.value.elements.some(
        (element) => element.type === AST_NODE_TYPES.Literal
      );
    }
  }

  return null;
}
