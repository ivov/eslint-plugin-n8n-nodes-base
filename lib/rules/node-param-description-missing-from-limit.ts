import { LIMIT_NODE_PARAMETER } from "../constants";
import * as utils from "../ast";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: "`description` in Limit node parameter must be present.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      addDescription: `Add description: '${LIMIT_NODE_PARAMETER.DESCRIPTION}' [autofixable]`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isLimit(node)) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) {
          const type = getters.nodeParam.getType(node);

          if (!type) return;

          const { range, indentation } = utils.getInsertionArgs(type);

          context.report({
            messageId: "addDescription",
            node,
            fix: (fixer) =>
              fixer.insertTextAfterRange(
                range,
                `\n${indentation}description: '${LIMIT_NODE_PARAMETER.DESCRIPTION}',`
              ),
          });
        }
      },
    };
  },
});
