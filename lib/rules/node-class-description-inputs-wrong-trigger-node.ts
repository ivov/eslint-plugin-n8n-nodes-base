import * as utils from "../ast";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "The number of `inputs` in node class description for trigger node should be zero.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      fixInputs: "Replace with '[]' [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!utils.isTriggerNodeFile(context.getFilename())) return;

        if (!id.isNodeClassDescription(node)) return;

        const inputs = getters.nodeClassDescription.getInputs(node);

        if (!inputs) return;

        const inputsTotal = inputs.value.length;

        if (inputsTotal !== 0) {
          context.report({
            messageId: "fixInputs",
            node: inputs.ast,
            fix: (fixer) => fixer.replaceText(inputs.ast, "inputs: []"),
          });
        }
      },
    };
  },
});
