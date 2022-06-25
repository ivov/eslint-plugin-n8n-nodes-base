import { DOCUMENTATION } from "../constants";
import * as utils from "../ast";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`description\` in node parameter must be trimmed. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_DESCRIPTION_IN_OPTION}`,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      trimWhitespace: "Trim whitespace [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node) && !id.isOption(node)) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) return;

        const trimmed = description.value.trim();

        if (description.value !== trimmed) {
          const fixed = utils.keyValue("description", trimmed, {
            backtickedValue: utils.isMultiline(description),
          });

          context.report({
            messageId: "trimWhitespace",
            node: description.ast,
            fix: (fixer) => fixer.replaceText(description.ast, fixed),
          });
        }
      },
    };
  },
});
