import * as utils from "../ast";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "`noDataExpression` in an Operation node parameter must be present and enabled.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      addNoDataExpression: "Add 'noDataExpression: true' [autofixable]",
      enableNoDataExpression: "Enable 'noDataExpression' [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isOperation(node)) return;

        const noDataExpression = getters.nodeParam.getNoDataExpression(node);

        if (!noDataExpression) {
          const type = getters.nodeParam.getType(node); // insertion point

          if (!type) return;

          const { range, indentation } = utils.getInsertionArgs(type);

          context.report({
            messageId: "addNoDataExpression",
            node,
            fix: (fixer) => {
              return fixer.insertTextAfterRange(
                range,
                `\n${indentation}noDataExpression: true,`
              );
            },
          });
        } else if (noDataExpression.value === false) {
          context.report({
            messageId: "enableNoDataExpression",
            node: noDataExpression.ast,
            fix: (fixer) =>
              fixer.replaceText(noDataExpression.ast, `noDataExpression: true`),
          });
        }
      },
    };
  },
});
