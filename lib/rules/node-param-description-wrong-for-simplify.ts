import { SIMPLIFY_NODE_PARAMETER } from "../constants";
import * as utils from "../ast";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`description\` for Simplify node parameter must be \`${SIMPLIFY_NODE_PARAMETER.DESCRIPTION}\``,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      useSimplify: `Replace with '${SIMPLIFY_NODE_PARAMETER.DESCRIPTION}' [autofixable]`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isSimplify(node)) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) return;

        const expected = SIMPLIFY_NODE_PARAMETER.DESCRIPTION;

        if (description.value !== expected) {
          const fixed = utils.keyValue("description", expected);

          context.report({
            messageId: "useSimplify",
            node: description.ast,
            fix: (fixer) => fixer.replaceText(description.ast, fixed),
          });
        }
      },
    };
  },
});
