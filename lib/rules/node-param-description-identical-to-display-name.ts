import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "`description` in node parameter must not be identical to `displayName`.",
      recommended: "error",
    },
    schema: [],
    messages: {
      fillOutDescription: "Fill out description [non-autofixable]", // TODO: Or remove
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) return;

        const displayName = getters.nodeParam.getDisplayName(node);

        if (!displayName) return;

        if (description.value === displayName.value) {
          context.report({
            messageId: "fillOutDescription",
            node: description.ast,
          });
        }
      },
    };
  },
});
