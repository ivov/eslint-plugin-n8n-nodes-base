import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";
import * as utils from "../utils";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { COMMUNITY_PACKAGE_JSON } from "../constants";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `The \`repository.url\` key in the \`package.json\` of a community package must be different from the default value \`${COMMUNITY_PACKAGE_JSON.REPOSITORY_URL}\`.`,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      updateRepositoryUrl: "Update the `repository.url` key in package.json",
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

        const repository = getters.packageJson.getRepository(node);

        if (!repository) return;

        const repositoryUrl = getRepositoryUrl(repository);

        if (repositoryUrl === COMMUNITY_PACKAGE_JSON.REPOSITORY_URL) {
          context.report({
            messageId: "updateRepositoryUrl",
            node,
          });
        }
      },
    };
  },
});

function getRepositoryUrl(repository: { ast: TSESTree.ObjectLiteralElement }) {
  if (
    repository.ast.type === AST_NODE_TYPES.Property &&
    repository.ast.value.type === AST_NODE_TYPES.ObjectExpression
  ) {
    const repositoryUrl = repository.ast.value.properties.find(id.hasUrlLiteral);

    if (!repositoryUrl) return false;

    if (
      repositoryUrl.type === AST_NODE_TYPES.Property &&
      repositoryUrl.value.type === AST_NODE_TYPES.Literal
    ) {
      return repositoryUrl.value.value;
    }
  }

  return null;
}
