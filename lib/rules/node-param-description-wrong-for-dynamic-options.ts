import { DYNAMIC_OPTIONS_NODE_PARAMETER } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`description\` in dynamic-options-type node parameter must be \`${DYNAMIC_OPTIONS_NODE_PARAMETER.DESCRIPTION}\``,
      recommended: "error",
    },
    schema: [],
    fixable: "code",
    messages: {
      useStandardDescription: `Replace with '${DYNAMIC_OPTIONS_NODE_PARAMETER.DESCRIPTION}' [autofixable]`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isOptionsType(node)) return;

        const loadOptionsMethod = getters.nodeParam.getLoadOptionsMethod(node);

        if (!loadOptionsMethod) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) return;

        if (description.value !== DYNAMIC_OPTIONS_NODE_PARAMETER.DESCRIPTION) {
          context.report({
            messageId: "useStandardDescription",
            node: description.ast,
            fix: (fixer) => {
              return fixer.replaceText(
                description.ast,
                `description: '${DYNAMIC_OPTIONS_NODE_PARAMETER.DESCRIPTION}'`
              );
            },
          });
        }
      },
    };
  },
});
