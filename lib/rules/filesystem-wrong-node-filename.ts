import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "Node filename must match `name` in node class description, excluding the filename suffix. Example: `Test.node.ts` matches `Test` in `Test.description.name`.",
      recommended: "error",
    },
    schema: [],
    messages: {
      renameFile: "Rename file to {{ expected }} [non-autofixable]", // filesystem linting
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeClassDescription(node)) return;

        const name = getters.nodeClassDescription.getName(node);

        if (!name) return;

        const actual = utils.getNodeFilename(context.getFilename());
        const expected = utils.toExpectedNodeFilename(name.value);

        if (actual !== expected) {
          const topOfFile = { line: 1, column: 1 };

          context.report({
            messageId: "renameFile",
            loc: { start: topOfFile, end: topOfFile },
            data: { expected },
          });
        }
      },
    };
  },
});
