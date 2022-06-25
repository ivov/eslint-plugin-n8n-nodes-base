import { DOCUMENTATION } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `The string \`comma-separated\` in \`description\` must be hyphenated. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_DESCRIPTION_IN_OPTION}`,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      hyphenate: "Hyphenate [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node) && !id.isOption(node)) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) return;

        // ignore first char to disregard casing
        if (description.value.toLowerCase().includes("omma separated")) {
          const hyphenated = description.value.replace(
            /omma separated/g,
            "omma-separated"
          );

          const fixed = utils.keyValue("description", hyphenated, {
            backtickedValue: utils.isMultiline(description),
          });

          context.report({
            messageId: "hyphenate",
            node: description.ast,
            fix: (fixer) => fixer.replaceText(description.ast, fixed),
          });
        }
      },
    };
  },
});
