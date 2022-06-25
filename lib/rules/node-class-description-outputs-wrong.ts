import * as utils from "../ast";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "The number of `outputs` in node class description for any node must be one, or two for If node, or four for Switch node.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      fixOutputs: "Replace with \"['main']\" [autofixable]",
      fixOutputsIf: "Replace with \"['main', 'main']\" [autofixable]",
      fixOutputsSwitch:
        "Replace with \"['main', 'main', 'main', 'main']\" [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeClassDescription(node)) return;

        const outputs = getters.nodeClassDescription.getOutputs(node);

        if (!outputs) return;

        const inputsTotal = outputs.value.length;

        const name = getters.nodeClassDescription.getName(node);

        if (!name) return;

        // if node is only node with two outputs
        if (name.value === "if" && inputsTotal !== 2) {
          context.report({
            messageId: "fixOutputsIf",
            node: outputs.ast,
            fix: (fixer) => {
              return fixer.replaceText(outputs.ast, "inputs: ['main', 'main']");
            },
          });
        }

        // switch node is only node with four outputs
        if (name.value === "switch" && inputsTotal !== 4) {
          context.report({
            messageId: "fixOutputsSwitch",
            node: outputs.ast,
            fix: (fixer) => {
              return fixer.replaceText(
                outputs.ast,
                "inputs: ['main', 'main', 'main', 'main']"
              );
            },
          });
        }

        if (
          inputsTotal !== 1 ||
          (inputsTotal === 1 && outputs.value[0] !== "main")
        ) {
          context.report({
            messageId: "fixOutputs",
            node: outputs.ast,
            fix: (fixer) => {
              return fixer.replaceText(outputs.ast, "outputs: ['main']");
            },
          });
        }
      },
    };
  },
});
