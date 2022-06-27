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
        "The `author.name` key must be present in the `package.json` of a community package.",
      recommended: "error",
    },
    schema: [],
    messages: {
      addAuthorName: "Add an `author.name` key to package.json",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isCommunityPackageJson(context.getFilename(), node)) return;

        const author = getters.communityPackageJson.getAuthor(node);

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
