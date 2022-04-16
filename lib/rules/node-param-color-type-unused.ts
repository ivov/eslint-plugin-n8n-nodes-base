import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "`color`-type must be used for color-related node parameter.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      useColorParam: "Use 'color' for 'type' [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        const name = getters.nodeParam.getName(node);

        if (!name) return;

        const type = getters.nodeParam.getType(node);

        if (!type) return;

        if (/colo(u?)r/i.test(name.value) && type.value !== "color") {
          context.report({
            messageId: "useColorParam",
            node: type.ast,
            fix: (fixer) => fixer.replaceText(type.ast, "type: 'color'"),
          });
        }
      },
    };
  },
});
