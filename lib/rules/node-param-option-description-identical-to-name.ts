import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "`description` in option in options-type node parameter must not be identical to `name`.",
      recommended: "error",
    },
    schema: [],
    fixable: "code",
    messages: {
      removeDescription: "Remove omittable description [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isOption(node)) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) return;

        const name = getters.nodeParam.getName(node);

        if (!name) return;

        const triviaLess = description.value
          .replace(/^The\s/g, "")
          .replace(/\.$/, "");

        if (triviaLess.toLowerCase() === name.value.toLowerCase()) {
          const rangeToRemove = utils.getRangeToRemove(description);

          context.report({
            messageId: "removeDescription",
            node: description.ast,
            fix: (fixer) => fixer.removeRange(rangeToRemove),
          });
        }
      },
    };
  },
});
