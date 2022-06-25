import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "`default` for fixed-collection-type node parameter must be an object.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      setObjectDefault: "Set an object default [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isFixedCollectionType(node)) return;

        const _default = getters.nodeParam.getDefault(node);

        if (!_default) return;

        if (
          !Array.isArray(_default.value) &&
          _default.value !== null &&
          typeof _default.value !== "object"
        ) {
          context.report({
            messageId: "setObjectDefault",
            node: _default.ast,
            fix: (fixer) => fixer.replaceText(_default.ast, "default: {}"),
          });
        }
      },
    };
  },
});
