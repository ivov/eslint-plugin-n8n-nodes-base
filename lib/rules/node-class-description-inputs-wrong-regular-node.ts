import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "The number of `inputs` in node class description for regular node should be one, or two for Merge node.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      fixInputs: "Replace with \"['main']\" [autofixable]",
      fixInputsMerge: "Replace with \"['main', 'main']\" [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeClassDescription(node)) return;

        const inputs = getters.nodeClassDescription.getInputs(node);

        if (!inputs) return;

        if (!utils.isRegularNodeFile(context.getFilename())) return;

        const inputsTotal = inputs.value.length;

        // merge node is only regular node with two inputs
        if (
          getters.nodeParam.getName(node)?.value === "merge" &&
          inputsTotal !== 2
        ) {
          context.report({
            messageId: "fixInputsMerge",
            node: inputs.ast,
            fix: (fixer) => {
              return fixer.replaceText(inputs.ast, "inputs: ['main', 'main']");
            },
          });
        }

        if (
          inputsTotal !== 1 ||
          (inputsTotal === 1 && inputs.value[0] !== "main")
        ) {
          context.report({
            messageId: "fixInputs",
            node: inputs.ast,
            fix: (fixer) => {
              return fixer.replaceText(inputs.ast, "inputs: ['main']");
            },
          });
        }
      },
    };
  },
});
