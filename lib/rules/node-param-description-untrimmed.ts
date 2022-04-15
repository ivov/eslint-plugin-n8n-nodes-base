import { DOCUMENTATION } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

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
          const escaped = utils.escape(trimmed);
          const quotedDescription =
            utils.isMultiline(description) && description.value.includes("<")
              ? `\`${escaped}\``
              : `'${escaped}'`;
          const fixed = `description: ${quotedDescription}`;

          context.report({
            messageId: "trimWhitespace",
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
