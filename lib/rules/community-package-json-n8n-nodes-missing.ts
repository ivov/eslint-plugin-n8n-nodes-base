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
        "`n8n.nodes` key must be present in `package.json` of community package",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      addN8nNodes: "Add an `n8n.nodes` key to package.json",
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

        if (!hasN8nNodes(n8n)) {
          context.report({
            messageId: "addN8nNodes",
            node,
          });
        }
      },
    };
  },
});

function hasN8nNodes(n8n: { ast: TSESTree.ObjectLiteralElement }) {
  if (
    n8n.ast.type === AST_NODE_TYPES.Property &&
    n8n.ast.value.type === AST_NODE_TYPES.ObjectExpression
  ) {
    return n8n.ast.value.properties.some(id.hasNodesLiteral);
  }

  return false;
}