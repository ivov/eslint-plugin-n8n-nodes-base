import { DOCUMENTATION, VALID_HTML_TAG_REGEX } from "../constants";
import * as utils from "../ast";
import { identifiers as id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`description\` in node parameter must encode angle brackets for them to render. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_DESCRIPTION_IN_OPTION}`,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      encodeAngleBrackets:
        "Encode angle brackets with '&lt;' and '&gt;' [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node) && !id.isOption(node)) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) return;

        if (!/(<.*>)/.test(description.value)) return;

        // allow `<br>` in PEM key example
        if (description.value.includes("PRIVATE KEY")) return;

        if (!VALID_HTML_TAG_REGEX.test(description.value)) {
          const encoded = description.value
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

          const fixed = utils.keyValue("description", encoded, {
            backtickedValue: utils.isMultiline(description),
          });

          context.report({
            messageId: "encodeAngleBrackets",
            node: description.ast,
            fix: (fixer) => fixer.replaceText(description.ast, fixed),
          });
        }
      },
    };
  },
});
