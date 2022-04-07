import { DOCUMENTATION, LINE_BREAK_HTML_TAG_REGEX } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`description\` in node parameter must not contain an HTML line break. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_DESCRIPTION_IN_OPTION}`,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      removeTag: "Remove line break [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node) && !id.isOption(node)) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) return;

        if (LINE_BREAK_HTML_TAG_REGEX.test(description.value)) {
          context.report({
            messageId: "removeTag",
            node: description.ast,
            fix: (fixer) => {
              return fixer.replaceText(
                description.ast,
                `description: '${description.value
                  .replace(new RegExp(LINE_BREAK_HTML_TAG_REGEX, "g"), "")
                  .replace(/\s{2,}/, " ")}'`
              );
            },
          });
        }
      },
    };
  },
});
