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

          if (isAllowedException(displayName.value)) return;

          const firstChar = displayName.value.charAt(0);

          if (/[a-z]/.test(firstChar)) {
            const correctlyCased =
              firstChar.toUpperCase() + displayName.value.slice(1);
            const fixed = utils.keyValue("displayName", correctlyCased);

            context.report({
              messageId: "uppercaseFirstChar",
              node: displayName.ast,
              fix: (fixer) => fixer.replaceText(displayName.ast, fixed),
            });
          }
        } else if (isOption) {
          const name = getters.nodeParam.getName(node);

          if (!name) return;

          if (isAllowedException(name.value)) return;

          const firstChar = name.value.charAt(0);

          if (/[a-z]/.test(firstChar)) {
            const correctlyCased =
              firstChar.toUpperCase() + name.value.slice(1);

            const fixed = utils.keyValue("name", correctlyCased);

            context.report({
              messageId: "uppercaseFirstChar",
              node: name.ast,
              fix: (fixer) => fixer.replaceText(name.ast, fixed),
            });
          }
        }
      },
    };
  },
});

function isAllowedException(value: string) {
  if (utils.isUrl(value)) return true;

  if (utils.isKebabCase(value)) return true;

  return ["bmp", "tiff", "gif", "jpg", "jpeg", "png"].includes(value);
}
