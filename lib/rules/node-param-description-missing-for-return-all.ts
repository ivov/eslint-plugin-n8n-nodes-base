import { RETURN_ALL_NODE_PARAMETER } from "../constants";
import * as utils from "../ast";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "`description` for Return All node parameter must be present.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      addReturnAllDescription: `Add description: '${RETURN_ALL_NODE_PARAMETER.DESCRIPTION}' [autofixable]`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isReturnAll(node)) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) {
          const type = getters.nodeParam.getType(node); // insertion point

          if (!type) return;

          const { range, indentation } = utils.getInsertionArgs(type);

          context.report({
            messageId: "addReturnAllDescription",
            node,
            fix: (fixer) =>
              fixer.insertTextAfterRange(
                range,
                `\n${indentation}description: '${RETURN_ALL_NODE_PARAMETER.DESCRIPTION}',`
              ),
          });
        }
      },
    };
  },
});
