import { RETURN_ALL_NODE_PARAMETER } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`description\` for Return All node parameter must be \`${RETURN_ALL_NODE_PARAMETER.DESCRIPTION}\``,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      useReturnAll: `Replace with '${RETURN_ALL_NODE_PARAMETER.DESCRIPTION}' [autofixable]`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isReturnAll(node)) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) return;

        if (description.value !== RETURN_ALL_NODE_PARAMETER.DESCRIPTION) {
          context.report({
            messageId: "useReturnAll",
            node: description.ast,
            fix: (fixer) => {
              return fixer.replaceText(
                description.ast,
                `description: '${RETURN_ALL_NODE_PARAMETER.DESCRIPTION}'`
              );
            },
          });
        }
      },
    };
  },
});
