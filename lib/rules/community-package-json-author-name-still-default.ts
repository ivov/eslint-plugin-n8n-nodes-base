import { identifiers as id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import * as utils from "../ast";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { COMMUNITY_PACKAGE_JSON } from "../constants";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `The \`author.name\` value in the \`package.json\` of a community package must be different from the default value \`${COMMUNITY_PACKAGE_JSON.AUTHOR_NAME}\`.`,
      recommended: "error",
    },
    schema: [],
    messages: {
      updateAuthorName: "Update the `author.name` key in package.json",
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

        const authorName = getAuthorName(author);

        if (authorName === COMMUNITY_PACKAGE_JSON.AUTHOR_NAME) {
          context.report({
            messageId: "updateAuthorName",
            node,
          });
        }
      },
    };
  },
});

function getAuthorName(author: { ast: TSESTree.ObjectLiteralElement }) {
  if (
    author.ast.type === AST_NODE_TYPES.Property &&
    author.ast.value.type === AST_NODE_TYPES.ObjectExpression
  ) {
    const authorName = author.ast.value.properties.find(id.hasNameLiteral);

    if (!authorName) return false;

    if (
      authorName.type === AST_NODE_TYPES.Property &&
      authorName.value.type === AST_NODE_TYPES.Literal
    ) {
      return authorName.value.value;
    }
  }

  return null;
}
