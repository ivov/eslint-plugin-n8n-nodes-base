import * as utils from "../ast";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: "`required: false` in node parameter must be removed because it is implied.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      remove: "Remove superfluous property [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        const required = getters.nodeParam.getRequired(node);

        if (!required) return;

        if (required.value === false) {
          const rangeToRemove = utils.getRangeToRemove(required);

          context.report({
            messageId: "remove",
            node: required.ast,
            fix: (fixer) => {
              return fixer.removeRange(rangeToRemove);
            },
          });
        }
      },
    };
  },
});
