import { DOCUMENTATION } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`description\` in node parameter must end with a final period if a multiple-sentence description, unless ending with \`</code>\`. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_DESCRIPTION_IN_OPTION}`,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      missingFinalPeriod: "Add final period [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node) && !id.isOption(node)) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) return;

        // prevent overlap with node-param-description-untrimmed
        if (description.value !== description.value.trim()) return;

        // prevent overlap with node-param-description-excess-inner-whitespace
        if (/\s{2,}/.test(description.value)) return;

        // disregard "e.g." when checking periods
        const egLess = description.value.replace("e.g.", "");

        if (
          egLess.split(". ").length === 2 &&
          !egLess.endsWith(".") &&
          !isAllowedException(egLess)
        ) {
          const fixed = utils.keyValue("description", description.value + ".");

          context.report({
            messageId: "missingFinalPeriod",
            node: description.ast,
            fix: (fixer) => fixer.replaceText(description.ast, fixed),
          });
        }
      },
    };
  },
});

/**
 * Check whether a description is an exception to this rule.
 * - PEM key example
 * - `</code>` HTML tag
 */
const isAllowedException = (descriptionValue: string) =>
  descriptionValue.endsWith("---") || descriptionValue.endsWith("</code>");
