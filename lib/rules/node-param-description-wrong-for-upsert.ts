import { UPSERT_NODE_PARAMETER } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`description\` for Upsert node parameter must be \`${UPSERT_NODE_PARAMETER.DESCRIPTION}\`. The resource name e.g. \`'contact'\` is also allowed instead of \`'record'\`.`,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      useUpsertDescription: `Replace with '${UPSERT_NODE_PARAMETER.DESCRIPTION}'.  [autofixable]`,
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

        const { value } = description;
        const expected = UPSERT_NODE_PARAMETER.DESCRIPTION;
        const [expectedStart, expectedEnd] = expected.split("record");

        if (
          value !== expected &&
          (!value.startsWith(expectedStart) || !value.endsWith(expectedEnd)) // exception
        ) {
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
