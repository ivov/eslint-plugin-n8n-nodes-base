import { titleCase } from "title-case";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: "`displayName` field in credential class must be title cased.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      useTitleCase: "Change to title case [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node) {
        if (!id.isCredentialClass(node)) return;

        const displayName = getters.credClassBody.getDisplayName(node.body);

        if (!displayName) return;

        if (displayName.value !== titleCase(displayName.value)) {
          context.report({
            messageId: "useTitleCase",
            node: displayName.ast,
            fix: (fixer) => {
              return fixer.replaceText(
                displayName.ast,
                `displayName = '${titleCase(displayName.value)}';`
              );
            },
          });
        }
      },
    };
  },
});
