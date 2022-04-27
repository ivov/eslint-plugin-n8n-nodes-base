import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "`default` for a number-type node parameter must be a number, except for a number-type ID parameter.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      setNumberDefault: "Set a number default [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isNumericType(node)) return;

        const _default = getters.nodeParam.getDefault(node);

        if (!_default) return;

        const name = getters.nodeParam.getName(node);

        const hasNonNumberDefault = typeof _default.value !== "number";

        if (hasNonNumberDefault && name?.value.toLowerCase().endsWith("id")) {
          return; // disregard numeric param for ID
        }

        if (hasNonNumberDefault) {
          context.report({
            messageId: "setNumberDefault",
            node: _default.ast,
            fix: (fixer) => fixer.replaceText(_default.ast, "default: 0"),
          });
        }
      },
    };
  },
});
