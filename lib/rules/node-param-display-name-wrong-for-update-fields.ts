import { UPDATE_FIELDS_NODE_PARAM_DISPLAY_NAME } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`displayName\` for Update operation node parameter must be \`${UPDATE_FIELDS_NODE_PARAM_DISPLAY_NAME}\``,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      useUpdateFields: `Use '${UPDATE_FIELDS_NODE_PARAM_DISPLAY_NAME}' [autofixable]`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isUpdateFields(node)) return;

        const displayName = getters.nodeParam.getDisplayName(node);

        if (!displayName) return;

        if (displayName.value !== UPDATE_FIELDS_NODE_PARAM_DISPLAY_NAME) {
          context.report({
            messageId: "useUpdateFields",
            node: displayName.ast,
            fix: (fixer) => {
              return fixer.replaceText(
                displayName.ast,
                `displayName: '${UPDATE_FIELDS_NODE_PARAM_DISPLAY_NAME}'`
              );
            },
          });
        }
      },
    };
  },
});
