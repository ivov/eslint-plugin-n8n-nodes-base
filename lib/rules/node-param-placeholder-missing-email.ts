import { EMAIL_PLACEHOLDER } from "../constants";
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
      missingEmail: `Add "placeholder: '${EMAIL_PLACEHOLDER}'" [autofixable]`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node) && !id.isOption(node)) return;

        if (!id.nodeParam.isEmail(node)) return;

        const placeholder = getters.nodeParam.getPlaceholder(node);

        if (!placeholder) {
          const type = getters.nodeParam.getType(node); // insertion point

          if (!type) return;

          const { range, indentation } = utils.getInsertionArgs(type);

          context.report({
            messageId: "missingEmail",
            node,
            fix: (fixer) =>
              fixer.insertTextAfterRange(
                range,
                `\n${indentation}placeholder: '${EMAIL_PLACEHOLDER}',`
              ),
          });
        }
      },
    };
  },
});
