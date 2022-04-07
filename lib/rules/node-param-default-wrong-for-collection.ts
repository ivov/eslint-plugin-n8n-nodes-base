import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "`default` for collection-type node parameter must be an object.",
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

        if (!id.nodeParam.isCollectionType(node)) return;

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
            fix: (fixer) => {
              return fixer.replaceText(_default.ast, "default: {}");
            },
          });
        }
      },
    };
  },
});
