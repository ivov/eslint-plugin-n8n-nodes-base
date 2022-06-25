import * as utils from "../ast";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "`default` for boolean-type node parameter must be a boolean.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      setBooleanDefault: "Set a boolean default [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isBooleanType(node)) return;

        const _default = getters.nodeParam.getDefault(node);

        if (!_default) return;

        if (typeof _default.value !== "boolean") {
          context.report({
            messageId: "setBooleanDefault",
            node: _default.ast,
            fix: (fixer) => fixer.replaceText(_default.ast, "default: false"),
          });
        }
      },
    };
  },
});
