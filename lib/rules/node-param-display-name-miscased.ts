import { titleCase } from "title-case";
import { DOCUMENTATION } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`displayName\` in node parameter or in fixed collection section must title cased. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_NAME}`,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      useTitleCase: "Change to title case [autofixable]",
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

          if (utils.isKebabCase(displayName.value)) return;

          const titledCased = titleCase(displayName.value);

          if (displayName.value !== titledCased) {
            const fixed = utils.keyValue("displayName", titledCased);

            context.report({
              messageId: "useTitleCase",
              node: displayName.ast,
              fix: (fixer) => fixer.replaceText(displayName.ast, fixed),
            });
          }
        } else if (isOption) {
          const name = getters.nodeParam.getName(node);

          if (!name) return;

          if (utils.isUrl(name.value)) return;

          if (utils.isKebabCase(name.value)) return;

          const titleCased = titleCase(name.value);

          if (name.value !== titleCased) {
            const fixed = utils.keyValue("name", titleCased);

            context.report({
              messageId: "useTitleCase",
              node: name.ast,
              fix: (fixer) => fixer.replaceText(name.ast, fixed),
            });
          }
        }
      },
    };
  },
});
