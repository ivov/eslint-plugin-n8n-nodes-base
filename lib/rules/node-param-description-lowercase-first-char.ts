import { DOCUMENTATION } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `First char in \`description\` in node parameter must be uppercase. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_DESCRIPTION_IN_OPTION}`,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      uppercaseFirstChar: "Change first char to uppercase [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node) && !id.isOption(node)) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) return;

        if (/[a-z]/.test(description.value.charAt(0))) {
          context.report({
            messageId: "uppercaseFirstChar",
            node: description.ast,
            fix: (fixer) => {
              const fixed =
                description.value.charAt(0).toUpperCase() +
                description.value.slice(1);

              return fixer.replaceText(
                description.ast,
                `description: '${fixed}'`
              );
            },
          });
        }
      },
    };
  },
});
