import { DOCUMENTATION } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `First char in \`displayName\` in node parameter or in fixed collection section must be uppercase. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_NAME}`,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      uppercaseFirstChar: "Change first char to uppercase [autofixable]",
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

          if (utils.isUrl(displayName.value)) return;

          if (/[a-z]/.test(displayName.value.charAt(0))) {
            context.report({
              messageId: "uppercaseFirstChar",
              node: displayName.ast,
              fix: (fixer) => {
                const fixed =
                  displayName.value.charAt(0).toUpperCase() +
                  displayName.value.slice(1);

                return fixer.replaceText(
                  displayName.ast,
                  `displayName: '${fixed}'`
                );
              },
            });
          }
        } else if (isOption) {
          const name = getters.nodeParam.getName(node);

          if (!name) return;

          if (utils.isUrl(name.value)) return;

          if (/[a-z]/.test(name.value.charAt(0))) {
            context.report({
              messageId: "uppercaseFirstChar",
              node: name.ast,
              fix: (fixer) => {
                const fixed =
                  name.value.charAt(0).toUpperCase() + name.value.slice(1);

                return fixer.replaceText(name.ast, `name: '${fixed}'`);
              },
            });
          }
        }
      },
    };
  },
});
