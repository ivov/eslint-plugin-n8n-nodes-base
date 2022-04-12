import { DOCUMENTATION } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`description\` in node parameter must not use unneeded backticks. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_DESCRIPTION_IN_OPTION}`,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      useSingleQuotes: "Use quotes instead [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node) && !id.isOption(node)) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) return;

        if (utils.isMultiline(description)) return;

        if (description.hasUnneededBackticks) {
          const fixed = /'/.test(description.value)
            ? `description: '${description.value.replace(/'/g, "\\'")}'`
            : `description: '${description.value}'`;

          context.report({
            messageId: "useSingleQuotes",
            node: description.ast,
            fix: (fixer) => {
              return fixer.replaceText(description.ast, fixed);
            },
          });
        }
      },
    };
  },
});
