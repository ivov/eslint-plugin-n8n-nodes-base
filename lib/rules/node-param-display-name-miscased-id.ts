import { DOCUMENTATION, MISCASED_ID_REGEX } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`ID\` in \`displayName\` in node parameter must be fully uppercased. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_NAME}`,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      uppercaseId: "Use 'ID' [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        const isNodeParameter = id.isNodeParameter(node);
        const isOption = id.isOption(node);

        if (!isNodeParameter && !isOption) return;

        if (isNodeParameter) {
          const displayName = getters.nodeParam.getDisplayName(node);

          if (!displayName) return;

          if (MISCASED_ID_REGEX.test(displayName.value)) {
            const correctlyCased = displayName.value
              .replace(/\bid\b/i, "ID")
              .replace(/\bids\b/i, "IDs");

            const fixed = utils.keyValue("displayName", correctlyCased);

            context.report({
              messageId: "uppercaseId",
              node: displayName.ast,
              fix: (fixer) => fixer.replaceText(displayName.ast, fixed),
            });
          }
        } else if (isOption) {
          const name = getters.nodeParam.getName(node);

          if (!name) return;

          if (MISCASED_ID_REGEX.test(name.value)) {
            const correctlyCased = name.value
              .replace(/\bid\b/i, "ID")
              .replace(/\bids\b/i, "IDs");

            const fixed = utils.keyValue("name", correctlyCased);

            context.report({
              messageId: "uppercaseId",
              node: name.ast,
              fix: (fixer) => fixer.replaceText(name.ast, fixed),
            });
          }
        }
      },
    };
  },
});
