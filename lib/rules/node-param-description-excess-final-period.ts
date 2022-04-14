import { DOCUMENTATION } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`description\` in node parameter must end without a final period if a single-sentence description. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_DESCRIPTION_IN_OPTION}`,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      excessFinalPeriod: "Remove final period [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node) && !id.isOption(node)) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) return;

        // to prevent overlap with node-param-description-weak
        if (utils.isWeakDescription(description)) return;

        if (
          description.value.split(". ").length === 1 &&
          description.value.endsWith(".")
        ) {
          context.report({
            messageId: "excessFinalPeriod",
            node: description.ast,
            fix: (fixer) => {
              return fixer.replaceText(
                description.ast,
                `description: '${description.value.slice(
                  0,
                  description.value.length - 1
                )}'`
              );
            },
          });
        }
      },
    };
  },
});
