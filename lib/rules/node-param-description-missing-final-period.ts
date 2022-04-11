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

        if (
          description.value.split(". ").length === 2 &&
          !description.value.endsWith(".") &&
          !description.value.endsWith("---") && // final period exception (PEM key)
          !description.value.endsWith("</code>") // final period exception
        ) {
          context.report({
            messageId: "missingFinalPeriod",
            node: description.ast,
            fix: (fixer) => {
              return fixer.replaceText(
                description.ast,
                `description: '${description.value + "."}'`
              );
            },
          });
        }
      },
    };
  },
});
