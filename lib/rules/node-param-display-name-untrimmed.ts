import { DOCUMENTATION } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

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

          if (displayName.value !== displayName.value.trim()) {
            context.report({
              messageId: "trimWhitespace",
              node: displayName.ast,
              fix: (fixer) => {
                return fixer.replaceText(
                  displayName.ast,
                  `displayName: '${displayName.value.trim()}'`
                );
              },
            });
          }
        } else if (isOption) {
          const name = getters.nodeParam.getName(node);

          if (!name) return;

          if (name.value !== name.value.trim()) {
            context.report({
              messageId: "trimWhitespace",
              node: name.ast,
              fix: (fixer) => {
                return fixer.replaceText(
                  name.ast,
                  `name: '${name.value.trim()}'`
                );
              },
            });
          }
        }
      },
    };
  },
});
