import { MISCASED_ID_REGEX } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "`ID` in `placeholder` in node parameter must be fully uppercased.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      uppercaseId: "Use 'ID' [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node) && !id.isOption(node)) return;

        const placeholder = getters.nodeParam.getPlaceholder(node);

        if (!placeholder || isToleratedException(placeholder.value)) return;

        if (MISCASED_ID_REGEX.test(placeholder.value)) {
          const correctlyCased = placeholder.value
            .replace(/\bid\b/i, "ID")
            .replace(/\bids\b/i, "IDs");

          const fixed = utils.keyValue("placeholder", correctlyCased);

          context.report({
            messageId: "uppercaseId",
            node: placeholder.ast,
            fix: (fixer) => fixer.replaceText(placeholder.ast, fixed),
          });
        }
      },
    };
  },
});

function isToleratedException(placeholderValue: string) {
  return (
    placeholderValue.includes("SELECT") ||
    placeholderValue.includes("id, name".replace(/\s/, ""))
  );
}
