import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: "`default` for a Simplify node parameter must be `true`.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      setTrueDefault: "Set 'true' as default [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isSimplify(node)) return;

        const _default = getters.nodeParam.getDefault(node);

        if (!_default) return;

        if (_default.value === false) {
          context.report({
            messageId: "setTrueDefault",
            node: _default.ast,
            fix: (fixer) => {
              return fixer.replaceText(_default.ast, "default: true");
            },
          });
        }
      },
    };
  },
});
