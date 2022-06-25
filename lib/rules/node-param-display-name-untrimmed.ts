import { DOCUMENTATION } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`displayName\` in node parameter or in fixed collection section must be trimmed. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_NAME}`,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      trimWhitespace: "Trim whitespace [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        const isNodeParameter = id.isNodeParameter(node);
        const isFixedCollectionSection = id.isFixedCollectionSection(node);
        const isOption = id.isOption(node);

        if (!isNodeParameter && !isFixedCollectionSection && !isOption) return;

        if (isNodeParameter || isFixedCollectionSection) {
          const displayName = getters.nodeParam.getDisplayName(node);

          if (!displayName) return;

          const trimmed = displayName.value.trim();

          if (displayName.value !== trimmed) {
            const fixed = utils.keyValue("displayName", trimmed);

            context.report({
              messageId: "trimWhitespace",
              node: displayName.ast,
              fix: (fixer) => fixer.replaceText(displayName.ast, fixed),
            });
          }
        } else if (isOption) {
          const name = getters.nodeParam.getName(node);

          if (!name) return;

          const trimmed = name.value.trim();

          if (name.value !== trimmed) {
            const fixed = utils.keyValue("name", trimmed);

            context.report({
              messageId: "trimWhitespace",
              node: name.ast,
              fix: (fixer) => fixer.replaceText(name.ast, fixed),
            });
          }
        }
      },
    };
  },
});
