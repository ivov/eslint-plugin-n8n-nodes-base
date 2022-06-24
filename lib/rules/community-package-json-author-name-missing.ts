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
        "`author.name` key must be present in `package.json` of community package",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      addAuthorName: "Add an `author.name` key to package.json",
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

        const author = getters.packageJson.getAuthor(node);

        if (!author) return;

        if (!hasAuthorName(author)) {
          context.report({
            messageId: "addAuthorName",
            node,
          });
        }
      },
    };
  },
});

function hasAuthorName(author: { ast: TSESTree.ObjectLiteralElement }) {
  if (
    author.ast.type === AST_NODE_TYPES.Property &&
    author.ast.value.type === AST_NODE_TYPES.ObjectExpression
  ) {
    return author.ast.value.properties.some(id.hasNameLiteral);
  }

  return false;
}