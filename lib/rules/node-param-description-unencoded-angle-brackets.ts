import { DOCUMENTATION, VALID_HTML_TAG_REGEX } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

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

        if (description.value.includes("PRIVATE KEY")) return; // <br> allowed in PEM key example

        if (!VALID_HTML_TAG_REGEX.test(description.value)) {
          context.report({
            messageId: "encodeAngleBrackets",
            node: description.ast,
            fix: (fixer) => {
              const encoded = description.value
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

              return fixer.replaceText(
                description.ast,
                `description: '${encoded}'`
              );
            },
          });
        }
      },
    };
  },
});
