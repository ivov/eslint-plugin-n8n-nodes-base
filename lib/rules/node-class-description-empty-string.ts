import * as utils from "../ast";
import { identifiers as id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: "`description` in node class description must be filled out.",
      recommended: "error",
    },
    schema: [],
    messages: {
      fillOutDescription: "Fill out description [non-autofixable]", // unknowable description
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeClassDescription(node)) return;

        const description = getters.nodeClassDescription.getDescription(node);

        if (!description) return;

        if (description.value === "") {
          context.report({
            messageId: "fillOutDescription",
            node: description.ast,
          });
        }
      },
    };
  },
});
