import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: "Option `name` for Get All node parameter must be `Get All`",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      useGetAll: "Replace with 'Get All' [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isOption(node)) return;

        if (!id.hasValue("getAll", node)) return;

        const name = getters.nodeParam.getName(node);

        if (!name) return;

        if (name.value !== "Get All") {
          context.report({
            messageId: "useGetAll",
            node: name.ast,
            fix: (fixer) => fixer.replaceText(name.ast, "name: 'Get All'"),
          });
        }
      },
    };
  },
});
