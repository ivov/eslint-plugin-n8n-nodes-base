import { IGNORE_SSL_ISSUES_NODE_PARAMETER } from "../constants";
import * as utils from "../ast";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "`description` for Ignore SSL node parameter must be present.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      addIgnoreSslIssuesDescription: `Add description: '${IGNORE_SSL_ISSUES_NODE_PARAMETER.DESCRIPTION}' [autofixable]`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isIgnoreSslIssues(node)) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) {
          const type = getters.nodeParam.getType(node); // insertion point

          if (!type) return;

          const { range, indentation } = utils.getInsertionArgs(type);

          context.report({
            messageId: "addIgnoreSslIssuesDescription",
            node,
            fix: (fixer) => {
              return fixer.insertTextAfterRange(
                range,
                `\n${indentation}description: '${IGNORE_SSL_ISSUES_NODE_PARAMETER.DESCRIPTION}',`
              );
            },
          });
        }
      },
    };
  },
});
