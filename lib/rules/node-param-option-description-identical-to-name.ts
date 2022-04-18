import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "`description` in option in options-type node parameter must not be identical to `name`.",
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
        if (!id.isOption(node)) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) return;

        const name = getters.nodeParam.getName(node);

        if (!name) return;

        if (description.value.toLowerCase() === name.value.toLowerCase()) {
          context.report({
            messageId: "fillOutDescription",
            node: description.ast,
          });
        }
      },
    };
  },
});
