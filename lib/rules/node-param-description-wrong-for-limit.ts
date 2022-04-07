import { LIMIT_NODE_PARAMETER } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`description\` for Limit node parameter must be \`${LIMIT_NODE_PARAMETER.DESCRIPTION}\``,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      useLimit: `Replace with '${LIMIT_NODE_PARAMETER.DESCRIPTION}' [autofixable]`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isLimit(node)) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) return;

        if (description.value !== LIMIT_NODE_PARAMETER.DESCRIPTION) {
          context.report({
            messageId: "useLimit",
            node: description.ast,
            fix: (fixer) => {
              return fixer.replaceText(
                description.ast,
                `description: '${LIMIT_NODE_PARAMETER.DESCRIPTION}'`
              );
            },
          });
        }
      },
    };
  },
});
