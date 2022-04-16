import { UPSERT_NODE_PARAMETER } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`description\` for Upsert node parameter must be \`${UPSERT_NODE_PARAMETER.DESCRIPTION}\``,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      useUpsertDescription: `Replace with '${UPSERT_NODE_PARAMETER.DESCRIPTION}' [autofixable]`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isOption(node)) return;

        if (!id.hasValue("upsert", node)) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) return;

        const expected = UPSERT_NODE_PARAMETER.DESCRIPTION;

        if (description.value !== expected) {
          const fixed = utils.keyValue("description", expected);

          context.report({
            messageId: "useUpsertDescription",
            node: description.ast,
            fix: (fixer) => fixer.replaceText(description.ast, fixed),
          });
        }
      },
    };
  },
});
