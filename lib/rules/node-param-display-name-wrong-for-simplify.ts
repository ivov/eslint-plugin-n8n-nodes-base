import { SIMPLIFY_NODE_PARAMETER } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`displayName\` for Simplify node parameter must be ${SIMPLIFY_NODE_PARAMETER.DISPLAY_NAME}`,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      useSimplify: `Replace with '${SIMPLIFY_NODE_PARAMETER.DISPLAY_NAME}' [autofixable]`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isSimplify(node)) return;

        const displayName = getters.nodeParam.getDisplayName(node);

        if (!displayName) return;

        if (displayName.value !== SIMPLIFY_NODE_PARAMETER.DISPLAY_NAME) {
          context.report({
            messageId: "useSimplify",
            node: displayName.ast,
            fix: (fixer) => {
              return fixer.replaceText(
                displayName.ast,
                `displayName: '${SIMPLIFY_NODE_PARAMETER.DISPLAY_NAME}'`
              );
            },
          });
        }
      },
    };
  },
});
