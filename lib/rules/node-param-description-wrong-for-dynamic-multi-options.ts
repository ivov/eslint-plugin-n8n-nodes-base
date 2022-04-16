import { DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`description\` in dynamic-multi-options-type node parameter must be \`${DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER.DESCRIPTION}\``,
      recommended: "error",
    },
    schema: [],
    fixable: "code",
    messages: {
      useStandardDescription: `Replace with '${DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER.DESCRIPTION}' [autofixable]`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isMultiOptionsType(node)) return;

        const loadOptionsMethod = getters.nodeParam.getLoadOptionsMethod(node);

        if (!loadOptionsMethod) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) return;

        const expected = DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER.DESCRIPTION;

        if (description.value !== expected) {
          const fixed = utils.keyValue("description", expected);

          context.report({
            messageId: "useStandardDescription",
            node: description.ast,
            fix: (fixer) => fixer.replaceText(description.ast, fixed),
          });
        }
      },
    };
  },
});
