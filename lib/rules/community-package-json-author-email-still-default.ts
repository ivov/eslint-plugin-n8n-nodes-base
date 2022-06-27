import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { utils } from "../ast/utils";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { COMMUNITY_PACKAGE_JSON } from "../constants";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `The \`author.email\` value in the \`package.json\` of a community package must be different from the default value \`${COMMUNITY_PACKAGE_JSON.AUTHOR_EMAIL}\`.`,
      recommended: "error",
    },
    schema: [],
    messages: {
      updateAuthorEmail: "Update the `author.email` key in package.json",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isCommunityPackageJson(context.getFilename(), node)) return;

        const author = getters.communityPackageJson.getAuthor(node);

        if (!author) return;

        const authorName = getAuthorEmail(author);

        if (authorName === COMMUNITY_PACKAGE_JSON.AUTHOR_EMAIL) {
          context.report({
            messageId: "updateAuthorEmail",
            node,
          });
        }
      },
    };
  },
});

function getAuthorEmail(author: { ast: TSESTree.ObjectLiteralElement }) {
  if (
    author.ast.type === AST_NODE_TYPES.Property &&
    author.ast.value.type === AST_NODE_TYPES.ObjectExpression
  ) {
    const authorName = author.ast.value.properties.find(id.hasEmailLiteral);

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
