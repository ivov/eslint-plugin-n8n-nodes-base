import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "Option `name` for Upsert node parameter must be `Create or Update`.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      useCreateOrUpdate: "Replace with 'Create or Update' [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isOption(node)) return;

        if (!id.hasValue("upsert", node)) return;

        const name = getters.nodeParam.getName(node);

        if (!name) return;

        if (name.value !== "Upsert") {
          context.report({
            messageId: "useCreateOrUpdate",
            node: name.ast,
            fix: (fixer) => fixer.replaceText(name.ast, "name: 'Create or Update'"),
          });
        }
      },
    };
  },
});
