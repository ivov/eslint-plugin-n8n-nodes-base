import { DOCUMENTATION } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`displayName\` in node parameter or in fixed collection section must not contain excess inner whitespace. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_NAME}`,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      removeInnerWhitespace: "Remove excess inner whitespace [autofixable]",
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

          if (/\s{2,}/.test(displayName.value)) {
            context.report({
              messageId: "removeInnerWhitespace",
              node: displayName.ast,
              fix: (fixer) => {
                return fixer.replaceText(
                  displayName.ast,
                  `displayName: '${displayName.value.replace(/\s{2,}/g, " ")}'`
                );
              },
            });
          }
        } else if (isOption) {
          const name = getters.nodeParam.getName(node);

          if (!name) return;

          if (/\s{2,}/.test(name.value)) {
            context.report({
              messageId: "removeInnerWhitespace",
              node: name.ast,
              fix: (fixer) => {
                return fixer.replaceText(
                  name.ast,
                  `name: '${name.value.replace(/\s{2,}/g, " ")}'`
                );
              },
            });
          }
        }
      },
    };
  },
});
