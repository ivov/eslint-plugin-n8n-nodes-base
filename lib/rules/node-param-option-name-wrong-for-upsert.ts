import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: "Option `name` for Upsert node parameter must be `Upsert`.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      useUpsert: "Replace with 'Upsert' [autofixable]",
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
            messageId: "useUpsert",
            node: name.ast,
            fix: (fixer) => {
              return fixer.replaceText(name.ast, "name: 'Upsert'");
            },
          });
        }
      },
    };
  },
});
