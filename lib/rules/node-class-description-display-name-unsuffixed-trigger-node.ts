import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "`displayName` in node class description for trigger node must be suffixed with `-Trigger`.",
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
        if (!utils.isTriggerNodeFile(context.getFilename())) return;

        if (!id.isNodeClassDescription(node)) return;

        const displayName = getters.nodeClassDescription.getDisplayName(node);

        if (!displayName) return;

        if (!displayName.value.endsWith("Trigger")) {
          const suffixedDisplayName = `${displayName.value}Trigger`;

          context.report({
            messageId: "fixInputs",
            node: displayName.ast,
            fix: (fixer) => {
              return fixer.replaceText(
                displayName.ast,
                `displayName: '${suffixedDisplayName}'`
              );
            },
          });
        }
      },
    };
  },
});
