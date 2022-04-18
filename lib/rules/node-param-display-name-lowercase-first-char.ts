import { DOCUMENTATION } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";
import { titleCase } from "title-case";

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
      removePeriodUseTitleCase:
        "Remove period and use title case [autofixable]",
      useTitleCase: "Use title case [autofixable]",
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

          if (utils.isAllowedLowercase(displayName.value)) return;

          if (isTwoWordsInCamelCase(displayName.value)) {
            const properCased = titleCase(
              displayName.value.replace(/([a-z])([A-Z])/g, "$1 $2")
            );

            const fixed = utils.keyValue("displayName", properCased);

            return context.report({
              messageId: "useTitleCase",
              node: displayName.ast,
              fix: (fixer) => fixer.replaceText(displayName.ast, fixed),
            });
          }

          if (isTwoWordsJoinedByPeriod(displayName.value)) {
            const properCased = titleCase(
              displayName.value.replace(".", " ").replace(/_/g, " ")
            );
            const fixed = utils.keyValue("displayName", properCased);

            return context.report({
              messageId: "removePeriodUseTitleCase",
              node: displayName.ast,
              fix: (fixer) => fixer.replaceText(displayName.ast, fixed),
            });
          }

          const firstChar = displayName.value.charAt(0);

          if (/[a-z]/.test(firstChar)) {
            const properCased =
              firstChar.toUpperCase() + displayName.value.slice(1);
            const fixed = utils.keyValue("displayName", properCased);

            context.report({
              messageId: "uppercaseFirstChar",
              node: displayName.ast,
              fix: (fixer) => fixer.replaceText(displayName.ast, fixed),
            });
          }
        } else if (isOption) {
          const name = getters.nodeParam.getName(node);

          if (!name) return;

          if (utils.isAllowedLowercase(name.value)) return;

          if (isTwoWordsInCamelCase(name.value)) {
            const properCased = titleCase(
              name.value.replace(/([a-z])([A-Z])/g, "$1 $2")
            );

            const fixed = utils.keyValue("name", properCased);

            return context.report({
              messageId: "useTitleCase",
              node: name.ast,
              fix: (fixer) => fixer.replaceText(name.ast, fixed),
            });
          }

          if (isTwoWordsJoinedByPeriod(name.value)) {
            const properCased = titleCase(
              name.value.replace(".", " ").replace(/_/g, " ")
            );
            const fixed = utils.keyValue("name", properCased);

            return context.report({
              messageId: "removePeriodUseTitleCase",
              node: name.ast,
              fix: (fixer) => fixer.replaceText(name.ast, fixed),
            });
          }

          const firstChar = name.value.charAt(0);

          if (/[a-z]/.test(firstChar)) {
            const properCased = firstChar.toUpperCase() + name.value.slice(1);

            const fixed = utils.keyValue("name", properCased);

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

const isTwoWordsInCamelCase = (value: string) => /([a-z])([A-Z])/.test(value);

const isTwoWordsJoinedByPeriod = (value: string) => /\w+\.\w+/.test(value);
