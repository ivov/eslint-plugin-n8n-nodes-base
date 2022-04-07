import { DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        `\`displayName\` for dynamic-multi-options-type node parameter must end with \`${DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER.DISPLAY_NAME_SUFFIX}\``,
      recommended: "error",
    },
    schema: [],
    messages: {
      endWithNameOrId: `Replace with '<Entity> ${DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER.DISPLAY_NAME_SUFFIX}' [non-autofixable]`, // TODO: Attempt autofix
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
          context.report({
            messageId: "endWithNameOrId",
            node: displayName.ast,
          });
        }
      },
    };
  },
});
