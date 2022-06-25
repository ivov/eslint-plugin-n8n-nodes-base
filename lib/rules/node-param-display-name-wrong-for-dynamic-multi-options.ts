import { DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER } from "../constants";
import * as utils from "../ast";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { plural, singular } from "pluralize";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`displayName\` for dynamic-multi-options-type node parameter must end with \`${DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER.DISPLAY_NAME_SUFFIX}\``,
      recommended: "error",
    },
    schema: [],
    fixable: "code",
    messages: {
      endWithNamesOrIds: `End with '{Entity} ${DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER.DISPLAY_NAME_SUFFIX}' [autofixable]`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isMultiOptionsType(node)) return;

        const loadOptionsMethod = getters.nodeParam.getLoadOptionsMethod(node);

        if (!loadOptionsMethod) return;

        const displayName = getters.nodeParam.getDisplayName(node);

        if (!displayName) return;

        if (
          !displayName.value.endsWith(
            DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER.DISPLAY_NAME_SUFFIX
          )
        ) {
          const { value: displayNameValue } = displayName;

          const parts = displayNameValue.split(" ");

          if (
            parts.length === 1 &&
            plural(displayNameValue) === displayNameValue
          ) {
            const fixed = utils.keyValue(
              "displayName",
              `${singular(displayNameValue)} Names or IDs`
            );

            return context.report({
              messageId: "endWithNamesOrIds",
              node: displayName.ast,
              fix: (fixer) => fixer.replaceText(displayName.ast, fixed),
            });
          }

          if (
            parts.length === 1 &&
            singular(displayNameValue) === displayNameValue
          ) {
            const fixed = utils.keyValue(
              "displayName",
              `${displayNameValue} Names or IDs`
            );

            return context.report({
              messageId: "endWithNamesOrIds",
              node: displayName.ast,
              fix: (fixer) => fixer.replaceText(displayName.ast, fixed),
            });
          }

          const [entity, ...rest] = parts;

          if (parts.length > 1 && plural(entity) === entity) {
            const fixed = utils.keyValue(
              "displayName",
              `${singular(entity)} Names or IDs`
            );

            return context.report({
              messageId: "endWithNamesOrIds",
              node: displayName.ast,
              fix: (fixer) => fixer.replaceText(displayName.ast, fixed),
            });
          }
        }
      },
    };
  },
});
