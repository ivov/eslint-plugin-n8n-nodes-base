import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import * as utils from "../utils";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "`name` key must be present in `package.json` of community package",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      addName: "Add a `name` key to package.json",
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
        if (isProdRun && !prod.isTopLevelObjectExpression(node)) return;
        if (isTestRun && !test.isTopLevelObjectExpression(node)) return;

        if (!getters.packageJson.getName(node)) {
          context.report({
            messageId: "addName",
            node,
          });
        }
      },
    };
  },
});

const prod = {
  isTopLevelObjectExpression(node: TSESTree.ObjectExpression) {
    return node.parent?.parent?.type === AST_NODE_TYPES.Program;
  },
};

const test = {
  isTopLevelObjectExpression(node: TSESTree.ObjectExpression) {
    return node.parent?.parent?.type === AST_NODE_TYPES.VariableDeclaration; // `const packageJson = {` in test
  },
};
