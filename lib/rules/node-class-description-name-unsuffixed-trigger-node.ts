import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "`name` in node class description for trigger node must be suffixed with `-Trigger`.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      fixInputs: "Suffix with '-Trigger' [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeClassDescription(node)) return;

        if (!utils.isTriggerNodeFile(context.getFilename())) return;

        const name = getters.nodeClassDescription.getName(node);

        if (!name) return;

        if (!name.value.endsWith("Trigger")) {
          const suffixed = `${name.value}Trigger`;
          const fixed = utils.keyValue("name", suffixed);

          context.report({
            messageId: "fixInputs",
            node: name.ast,
            fix: (fixer) => fixer.replaceText(name.ast, fixed),
          });
        }
      },
    };
  },
});
