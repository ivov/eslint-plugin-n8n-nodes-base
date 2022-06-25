import { LIMIT_NODE_PARAMETER } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`description\` for Limit node parameter must be \`${LIMIT_NODE_PARAMETER.DESCRIPTION}\``,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      useLimit: `Replace with '${LIMIT_NODE_PARAMETER.DESCRIPTION}' [autofixable]`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isLimit(node)) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) return;

        const expected = LIMIT_NODE_PARAMETER.DESCRIPTION;

        if (description.value !== expected) {
          const fixed = utils.keyValue("description", expected);

          context.report({
            messageId: "useLimit",
            node: description.ast,
            fix: (fixer) => fixer.replaceText(description.ast, fixed),
          });
        }
      },
    };
  },
});
